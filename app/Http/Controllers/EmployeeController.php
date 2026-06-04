<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeProfileRequest;
use App\Models\Application;
use App\Models\ApplicationMessage;
use App\Models\Category;
use App\Models\JobAlert;
use App\Models\Location;
use App\Models\ScholarshipAlert;
use App\Models\ScholarshipCategory;
use App\Models\Skill;
use App\Support\Audits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function profile()
    {
        return Inertia::render('employee/profile/edit', [
            'profile' => request()->user()->employeeProfile?->load('skills'),
            'skills' => Skill::orderBy('name')->get(),
        ]);
    }

    public function updateProfile(EmployeeProfileRequest $request)
    {
        $data = $request->validated();
        $skills = $data['skill_ids'] ?? [];
        unset($data['skill_ids']);

        if ($request->hasFile('cv_file')) {
            $data['cv_file'] = $request->file('cv_file')->store('cvs', 'public');
            $data['parsed_cv_data'] = $this->parseCv($request->file('cv_file')->getClientOriginalName(), $request->user()->email);
        }
        $data['is_public'] = $request->boolean('is_public');
        $data['public_slug'] = $data['public_slug'] ?: str($request->user()->name)->slug().'-'.$request->user()->id;
        $profile = $request->user()->employeeProfile()->updateOrCreate(['user_id' => $request->user()->id], $data);
        $profile->skills()->sync($skills);
        Audits::record('employee.profile_saved', $profile, [], $data);

        return back()->with('success', 'Profile saved.');
    }

    public function downloadCv()
    {
        $user = request()->user()->load('employeeProfile.skills');
        $profile = $user->employeeProfile;
        abort_unless($profile, 404);

        $lines = array_filter([
            $user->name,
            $profile->headline,
            $user->email.' | '.$profile->phone,
            $profile->address,
            '',
            'Summary',
            $profile->summary,
            '',
            'Experience',
            $profile->experience_years.' years',
            '',
            'Education',
            $profile->education,
            '',
            'Skills',
            $profile->skills->pluck('name')->join(', '),
            '',
            'Languages',
            $profile->languages,
            '',
            'Certifications',
            $profile->certifications,
            '',
            'Portfolio',
            $profile->portfolio_url,
        ], fn ($line) => $line !== null && $line !== '');

        return Response::make($this->basicPdf($lines), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="galaxy-jobs-cv.pdf"',
        ]);
    }

    public function applications()
    {
        return Inertia::render('employee/applications/index', ['applications' => request()->user()->applications()->with(['job.company', 'job.category', 'job.location', 'statusUpdates.user', 'messages.user'])->latest()->paginate(15)]);
    }

    public function storeApplicationMessage(Request $request, Application $application)
    {
        abort_unless($application->user_id === $request->user()->id, 403);
        $data = $request->validate(['body' => ['required', 'string', 'max:2000']]);

        ApplicationMessage::create([
            'application_id' => $application->id,
            'user_id' => $request->user()->id,
            'body' => $data['body'],
        ]);

        return back()->with('success', 'Message sent.');
    }

    public function withdrawApplication(Application $application)
    {
        abort_unless($application->user_id === request()->user()->id, 403);
        $application->statusUpdates()->create([
            'user_id' => request()->user()->id,
            'status' => 'withdrawn',
            'note' => 'Application withdrawn by candidate.',
        ]);
        $application->delete();

        return back()->with('success', 'Application withdrawn.');
    }

    public function savedJobs()
    {
        return Inertia::render('employee/saved-jobs/index', ['savedJobs' => request()->user()->savedJobs()->with(['job.company', 'job.category', 'job.location'])->latest()->paginate(15)]);
    }

    public function alerts()
    {
        return Inertia::render('employee/job-alerts/index', [
            'alerts' => request()->user()->jobAlerts()->with(['category', 'location'])->latest()->paginate(15),
            'savedSearches' => request()->user()->savedSearches()->latest()->get(),
            'scholarshipAlerts' => request()->user()->scholarshipAlerts()->with('category')->latest()->get(),
            'scholarshipCategories' => ScholarshipCategory::where('is_active', true)->orderBy('name')->get(),
            'categories' => Category::where('is_active', true)->orderBy('name')->get(),
            'locations' => Location::where('is_active', true)->orderBy('name')->get(),
        ]);
    }

    public function storeAlert(Request $request)
    {
        $data = $request->validate(['keyword' => ['nullable', 'string', 'max:255'], 'category_id' => ['nullable', 'exists:categories,id'], 'location_id' => ['nullable', 'exists:locations,id'], 'is_active' => ['nullable', 'boolean']]);
        $request->user()->jobAlerts()->create($data + ['is_active' => $request->boolean('is_active', true)]);

        return back()->with('success', 'Job alert created.');
    }

    public function destroyAlert(JobAlert $jobAlert)
    {
        abort_unless($jobAlert->user_id === request()->user()->id, 403);
        $jobAlert->delete();

        return back()->with('success', 'Job alert deleted.');
    }

    public function storeScholarshipAlert(Request $request)
    {
        $data = $request->validate([
            'keyword' => ['nullable', 'string', 'max:255'],
            'scholarship_category_id' => ['nullable', 'exists:scholarship_categories,id'],
            'country' => ['nullable', 'string', 'max:255'],
            'study_level' => ['nullable', 'string', 'max:255'],
            'funding_type' => ['nullable', 'string', 'max:255'],
        ]);
        $request->user()->scholarshipAlerts()->create($data + ['is_active' => true]);

        return back()->with('success', 'Scholarship alert created.');
    }

    public function destroyScholarshipAlert(ScholarshipAlert $scholarshipAlert)
    {
        abort_unless($scholarshipAlert->user_id === request()->user()->id, 403);
        $scholarshipAlert->delete();

        return back()->with('success', 'Scholarship alert deleted.');
    }

    public function savedCompanies()
    {
        return Inertia::render('employee/saved-companies/index', [
            'savedCompanies' => request()->user()->savedCompanies()->with(['company' => fn ($query) => $query->withCount(['jobs' => fn ($jobs) => $jobs->public()])])->latest()->paginate(15),
        ]);
    }

    public function calendar()
    {
        return Inertia::render('employee/calendar/index', [
            'interviews' => request()->user()->applications()->with(['job.company', 'statusUpdates' => fn ($query) => $query->whereNotNull('interview_at')->latest()])->latest()->get(),
        ]);
    }

    private function basicPdf(array $lines): string
    {
        $content = "BT\n/F1 14 Tf\n50 790 Td\n";
        foreach ($lines as $index => $line) {
            $fontSize = $index === 0 ? 20 : (in_array($line, ['Summary', 'Experience', 'Education', 'Skills', 'Languages', 'Certifications', 'Portfolio'], true) ? 14 : 11);
            $safeLine = str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], (string) $line);
            $content .= "/F1 {$fontSize} Tf\n({$safeLine}) Tj\n0 -22 Td\n";
        }
        $content .= 'ET';

        $objects = [
            "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n",
            "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n",
            "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj\n",
            "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n",
            '5 0 obj << /Length '.strlen($content)." >> stream\n{$content}\nendstream endobj\n",
        ];

        $pdf = "%PDF-1.4\n";
        $offsets = [0];
        foreach ($objects as $object) {
            $offsets[] = strlen($pdf);
            $pdf .= $object;
        }
        $xref = strlen($pdf);
        $pdf .= "xref\n0 ".(count($objects) + 1)."\n0000000000 65535 f \n";
        foreach (array_slice($offsets, 1) as $offset) {
            $pdf .= str_pad((string) $offset, 10, '0', STR_PAD_LEFT)." 00000 n \n";
        }
        $pdf .= 'trailer << /Size '.(count($objects) + 1)." /Root 1 0 R >>\nstartxref\n{$xref}\n%%EOF";

        return $pdf;
    }

    private function parseCv(string $fileName, string $email): array
    {
        return [
            'source' => $fileName,
            'email' => $email,
            'parsed_at' => now()->toIso8601String(),
        ];
    }
}
