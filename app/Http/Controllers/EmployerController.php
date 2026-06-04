<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyRequest;
use App\Http\Requests\JobRequest;
use App\Models\Application;
use App\Models\ApplicationMessage;
use App\Models\Category;
use App\Models\Company;
use App\Models\EmployerPackage;
use App\Models\EmployerSubscription;
use App\Models\Job;
use App\Models\Location;
use App\Models\Payment;
use App\Models\Skill;
use App\Models\User;
use App\Support\Audits;
use App\Support\Slugs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployerController extends Controller
{
    public function company()
    {
        return Inertia::render('employer/company/edit', ['company' => request()->user()->company?->load('verificationDocuments')]);
    }

    public function updateCompany(CompanyRequest $request)
    {
        $data = $request->validated();
        foreach (['logo', 'cover_image'] as $file) {
            if ($request->hasFile($file)) {
                $data[$file] = $request->file($file)->store('companies', 'public');
            }
        }
        $document = null;
        if ($request->hasFile('verification_document')) {
            $document = [
                'document_type' => $data['verification_document_type'] ?? 'Business license',
                'file_path' => $request->file('verification_document')->store('company-verification', 'public'),
            ];
        }
        unset($data['verification_document'], $data['verification_document_type']);

        $company = request()->user()->company;
        $data['slug'] = Slugs::unique(Company::class, $data['name'], $company?->id);
        $data['verification_status'] = $company?->verification_status === 'approved' ? 'approved' : 'pending';
        $company = request()->user()->company()->updateOrCreate(['user_id' => request()->user()->id], $data);
        if ($document) {
            $company->verificationDocuments()->create($document);
        }
        Audits::record('company.profile_saved', $company, [], $data);

        return back()->with('success', 'Company profile saved.');
    }

    public function jobs()
    {
        $company = request()->user()->company;

        return Inertia::render('employer/jobs/index', [
            'jobs' => $company?->jobs()->with(['category', 'location'])->withCount('applications')->latest()->paginate(15) ?? null,
            'company' => $company,
            'subscription' => $this->activeSubscription(),
        ]);
    }

    public function createJob()
    {
        return Inertia::render('employer/jobs/create', $this->formData());
    }

    public function storeJob(JobRequest $request)
    {
        $company = $request->user()->company;
        abort_unless($company && $company->is_active, 403);
        $subscription = $this->activeSubscription();
        abort_unless($subscription && $subscription->remainingJobPosts() > 0, 403, 'Your active package has no job posts remaining.');

        $data = $request->validated();
        $skills = $data['skill_ids'] ?? [];
        unset($data['skill_ids']);
        abort_if($request->boolean('is_featured') && $subscription->remainingFeaturedPosts() <= 0, 403, 'Your active package has no featured posts remaining.');

        $job = $company->jobs()->create($data + [
            'slug' => Slugs::unique(Job::class, $data['title']),
            'status' => 'pending',
            'is_featured' => $request->boolean('is_featured'),
            'is_urgent' => $request->boolean('is_urgent'),
        ]);
        $job->skills()->sync($skills);
        $subscription->increment('job_posts_used');
        if ($job->is_featured) {
            $subscription->increment('featured_posts_used');
        }
        Audits::record('job.submitted', $job, [], $job->only(['title', 'status', 'is_featured', 'is_urgent']));

        return redirect()->route('employer.jobs.index')->with('success', 'Job submitted for approval.');
    }

    public function editJob(Job $job)
    {
        $this->authorizeEmployerJob($job);

        return Inertia::render('employer/jobs/edit', $this->formData() + ['job' => $job->load('skills')]);
    }

    public function updateJob(JobRequest $request, Job $job)
    {
        $this->authorizeEmployerJob($job);
        $data = $request->validated();
        $skills = $data['skill_ids'] ?? [];
        unset($data['skill_ids']);
        $subscription = $this->activeSubscription();
        abort_if(! $job->is_featured && $request->boolean('is_featured') && (! $subscription || $subscription->remainingFeaturedPosts() <= 0), 403, 'Your active package has no featured posts remaining.');
        $old = $job->only(['title', 'status', 'is_featured', 'is_urgent']);
        $job->update($data + ['slug' => Slugs::unique(Job::class, $data['title'], $job->id), 'status' => 'pending', 'is_featured' => $request->boolean('is_featured'), 'is_urgent' => $request->boolean('is_urgent')]);
        $job->skills()->sync($skills);
        if (! $old['is_featured'] && $job->is_featured && $subscription) {
            $subscription->increment('featured_posts_used');
        }
        Audits::record('job.updated', $job, $old, $job->only(['title', 'status', 'is_featured', 'is_urgent']));

        return redirect()->route('employer.jobs.index')->with('success', 'Job updated and sent for approval.');
    }

    public function destroyJob(Job $job)
    {
        $this->authorizeEmployerJob($job);
        Audits::record('job.deleted', $job, $job->only(['title', 'status']), []);
        $job->delete();

        return back()->with('success', 'Job deleted.');
    }

    public function applicants(Job $job)
    {
        $this->authorizeEmployerJob($job);
        $applications = $job->applications()
            ->with(['user.employeeProfile.skills', 'statusUpdates.user', 'messages.user'])
            ->latest()
            ->paginate(15)
            ->through(fn (Application $application) => $this->withApplicantMatch($application, $job->loadMissing('skills')));

        return Inertia::render('employer/jobs/applicants', ['job' => $job->load(['category', 'location', 'skills']), 'applications' => $applications]);
    }

    public function updateApplicant(Request $request, Application $application)
    {
        $this->authorizeEmployerJob($application->job);
        $data = $request->validate([
            'status' => ['required', 'in:pending,reviewed,shortlisted,rejected,hired'],
            'note' => ['nullable', 'string', 'max:2000'],
            'interview_at' => ['nullable', 'date'],
        ]);

        $application->update(['status' => $data['status']]);
        $application->statusUpdates()->create([
            'user_id' => $request->user()->id,
            'status' => $data['status'],
            'note' => $data['note'] ?? null,
            'interview_at' => $data['interview_at'] ?? null,
        ]);
        Audits::record('application.status_updated', $application, [], $data);

        return back()->with('success', 'Applicant status updated.');
    }

    public function storeApplicationMessage(Request $request, Application $application)
    {
        $this->authorizeEmployerJob($application->job);
        $data = $request->validate(['body' => ['required', 'string', 'max:2000']]);

        ApplicationMessage::create([
            'application_id' => $application->id,
            'user_id' => $request->user()->id,
            'body' => $data['body'],
        ]);

        return back()->with('success', 'Message sent.');
    }

    public function closeJob(Job $job)
    {
        $this->authorizeEmployerJob($job);
        $old = $job->only(['status']);
        $job->update(['status' => 'closed']);
        Audits::record('job.closed', $job, $old, ['status' => 'closed']);

        return back()->with('success', 'Job closed.');
    }

    public function candidates(Request $request)
    {
        abort_unless($request->user()->company?->verification_status === 'approved' && $request->user()->company?->is_active, 403);

        return Inertia::render('employer/candidates/index', [
            'candidates' => User::with(['employeeProfile.skills'])
                ->where('role', 'employee')
                ->where('status', 'active')
                ->whereHas('employeeProfile', function ($query) use ($request) {
                    $query
                        ->when($request->search, fn ($q, $search) => $q->where(fn ($nested) => $nested
                            ->where('headline', 'like', "%{$search}%")
                            ->orWhere('summary', 'like', "%{$search}%")
                            ->orWhere('address', 'like', "%{$search}%")))
                        ->when($request->experience_min, fn ($q, $min) => $q->where('experience_years', '>=', $min))
                        ->when($request->salary_max, fn ($q, $max) => $q->where('expected_salary', '<=', $max))
                        ->when($request->skill_id, fn ($q, $skillId) => $q->whereHas('skills', fn ($skills) => $skills->where('skills.id', $skillId)));
                })
                ->latest()
                ->paginate(15)
                ->withQueryString()
                ->through(fn (User $candidate) => $this->withCandidateMatch($candidate)),
            'filters' => $request->only(['search', 'experience_min', 'salary_max', 'skill_id']),
            'skills' => Skill::orderBy('name')->get(),
        ]);
    }

    public function packages()
    {
        return Inertia::render('employer/packages/index', [
            'packages' => EmployerPackage::where('is_active', true)->orderBy('price')->get(),
            'payments' => request()->user()->payments()->with(['package', 'subscription'])->latest()->paginate(10),
            'subscription' => $this->activeSubscription(),
        ]);
    }

    public function storePayment(Request $request)
    {
        $data = $request->validate([
            'employer_package_id' => ['required', 'exists:employer_packages,id'],
            'reference' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
        $package = EmployerPackage::findOrFail($data['employer_package_id']);

        $payment = Payment::create([
            'user_id' => $request->user()->id,
            'employer_package_id' => $package->id,
            'amount' => $package->price,
            'currency' => $package->currency,
            'status' => 'pending',
            'reference' => $data['reference'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);
        Audits::record('employer.payment_requested', $payment, [], $payment->only(['amount', 'currency', 'status']));

        return back()->with('success', 'Payment request submitted for review.');
    }

    private function formData(): array
    {
        return [
            'categories' => Category::where('is_active', true)->orderBy('name')->get(),
            'locations' => Location::where('is_active', true)->orderBy('name')->get(),
            'skills' => Skill::orderBy('name')->get(),
        ];
    }

    private function authorizeEmployerJob(Job $job): void
    {
        abort_unless($job->company?->user_id === request()->user()->id, 403);
    }

    private function activeSubscription(): ?EmployerSubscription
    {
        return request()->user()->activeEmployerSubscription()->with('package')->first();
    }

    private function withApplicantMatch(Application $application, Job $job): Application
    {
        $profile = $application->user?->employeeProfile;
        $skillNames = $profile?->skills?->pluck('name', 'id') ?? collect();
        $jobSkillIds = $job->skills?->pluck('id')->all() ?? [];
        $matching = $skillNames->only($jobSkillIds)->values()->all();
        $score = min(100, (count($matching) * 18) + (($profile?->experience_years ?? 0) >= 2 ? 12 : 0) + ($profile?->cv_file ? 10 : 0));
        $application->match_score = $score;
        $application->match_reasons = array_values(array_filter([
            count($matching) ? 'Skills: '.implode(', ', $matching) : null,
            $profile?->cv_file ? 'CV uploaded' : null,
            $profile?->experience_years ? $profile->experience_years.' years experience' : null,
        ]));

        return $application;
    }

    private function withCandidateMatch(User $candidate): User
    {
        $profile = $candidate->employeeProfile;
        $skills = $profile?->skills?->pluck('name')->take(4)->join(', ');
        $candidate->match_score = min(100, (($profile?->skills?->count() ?? 0) * 8) + (($profile?->experience_years ?? 0) * 3) + ($profile?->cv_file ? 10 : 0));
        $candidate->match_reasons = array_values(array_filter([$skills ? 'Skills: '.$skills : null, $profile?->cv_file ? 'CV ready' : null]));

        return $candidate;
    }
}
