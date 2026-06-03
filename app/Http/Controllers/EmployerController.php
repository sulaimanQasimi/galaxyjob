<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyRequest;
use App\Http\Requests\JobRequest;
use App\Models\Application;
use App\Models\Category;
use App\Models\Company;
use App\Models\Job;
use App\Models\Location;
use App\Models\Skill;
use App\Support\Slugs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployerController extends Controller
{
    public function company()
    {
        return Inertia::render('employer/company/edit', ['company' => request()->user()->company]);
    }

    public function updateCompany(CompanyRequest $request)
    {
        $data = $request->validated();
        foreach (['logo', 'cover_image'] as $file) {
            if ($request->hasFile($file)) {
                $data[$file] = $request->file($file)->store('companies', 'public');
            }
        }

        $company = request()->user()->company;
        $data['slug'] = Slugs::unique(Company::class, $data['name'], $company?->id);
        $data['verification_status'] = $company?->verification_status === 'approved' ? 'approved' : 'pending';
        request()->user()->company()->updateOrCreate(['user_id' => request()->user()->id], $data);

        return back()->with('success', 'Company profile saved.');
    }

    public function jobs()
    {
        $company = request()->user()->company;
        return Inertia::render('employer/jobs/index', ['jobs' => $company?->jobs()->with(['category', 'location'])->withCount('applications')->latest()->paginate(15) ?? null, 'company' => $company]);
    }

    public function createJob()
    {
        return Inertia::render('employer/jobs/create', $this->formData());
    }

    public function storeJob(JobRequest $request)
    {
        $company = $request->user()->company;
        abort_unless($company && $company->is_active, 403);

        $data = $request->validated();
        $skills = $data['skill_ids'] ?? [];
        unset($data['skill_ids']);

        $job = $company->jobs()->create($data + [
            'slug' => Slugs::unique(Job::class, $data['title']),
            'status' => 'pending',
            'is_featured' => $request->boolean('is_featured'),
        ]);
        $job->skills()->sync($skills);

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
        $job->update($data + ['slug' => Slugs::unique(Job::class, $data['title'], $job->id), 'status' => 'pending', 'is_featured' => $request->boolean('is_featured')]);
        $job->skills()->sync($skills);

        return redirect()->route('employer.jobs.index')->with('success', 'Job updated and sent for approval.');
    }

    public function destroyJob(Job $job)
    {
        $this->authorizeEmployerJob($job);
        $job->delete();

        return back()->with('success', 'Job deleted.');
    }

    public function applicants(Job $job)
    {
        $this->authorizeEmployerJob($job);
        return Inertia::render('employer/jobs/applicants', ['job' => $job->load(['category', 'location']), 'applications' => $job->applications()->with(['user.employeeProfile'])->latest()->paginate(15)]);
    }

    public function updateApplicant(Request $request, Application $application)
    {
        $this->authorizeEmployerJob($application->job);
        $application->update($request->validate(['status' => ['required', 'in:pending,reviewed,shortlisted,rejected,hired']]));

        return back()->with('success', 'Applicant status updated.');
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
}
