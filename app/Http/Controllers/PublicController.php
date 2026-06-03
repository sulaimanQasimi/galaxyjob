<?php

namespace App\Http\Controllers;

use App\Http\Requests\ApplicationRequest;
use App\Models\Application;
use App\Models\Category;
use App\Models\Company;
use App\Models\Job;
use App\Models\Location;
use App\Models\SavedJob;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home()
    {
        return Inertia::render('public/home', [
            'stats' => [
                'jobs' => Job::public()->count(),
                'companies' => Company::where('verification_status', 'approved')->where('is_active', true)->count(),
                'categories' => Category::where('is_active', true)->count(),
            ],
            'featuredJobs' => Job::with(['company', 'category', 'location'])->public()->where('is_featured', true)->latest()->take(6)->get(),
            'latestJobs' => Job::with(['company', 'category', 'location'])->public()->latest()->take(8)->get(),
            'categories' => Category::withCount(['jobs' => fn ($query) => $query->public()])->where('is_active', true)->orderBy('name')->take(10)->get(),
            'locations' => Location::where('is_active', true)->orderBy('name')->get(),
        ]);
    }

    public function jobs(Request $request)
    {
        $jobs = Job::with(['company', 'category', 'location'])
            ->public()
            ->when($request->search, fn ($query, $search) => $query->where(fn ($q) => $q
                ->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")))
            ->when($request->category_id, fn ($query, $id) => $query->where('category_id', $id))
            ->when($request->location_id, fn ($query, $id) => $query->where('location_id', $id))
            ->when($request->job_type, fn ($query, $type) => $query->where('job_type', $type))
            ->when($request->experience_level, fn ($query, $level) => $query->where('experience_level', $level))
            ->when($request->salary_min, fn ($query, $min) => $query->where('salary_max', '>=', $min))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('public/jobs/index', [
            'jobs' => $jobs,
            'filters' => $request->only(['search', 'category_id', 'location_id', 'job_type', 'experience_level', 'salary_min']),
            'categories' => Category::where('is_active', true)->orderBy('name')->get(),
            'locations' => Location::where('is_active', true)->orderBy('name')->get(),
        ]);
    }

    public function showJob(Request $request, Job $job)
    {
        abort_unless($job->status === 'active' && $job->deadline->isFuture(), 404);

        $job->load(['company', 'category', 'location', 'skills']);

        return Inertia::render('public/jobs/show', [
            'job' => $job,
            'hasApplied' => $request->user()?->applications()->where('job_id', $job->id)->exists() ?? false,
            'isSaved' => $request->user()?->savedJobs()->where('job_id', $job->id)->exists() ?? false,
            'relatedJobs' => Job::with(['company', 'category', 'location'])->public()->where('category_id', $job->category_id)->whereKeyNot($job->id)->take(4)->get(),
        ]);
    }

    public function companies(Request $request)
    {
        return Inertia::render('public/companies/index', [
            'companies' => Company::withCount(['jobs' => fn ($query) => $query->public()])
                ->where('verification_status', 'approved')
                ->where('is_active', true)
                ->when($request->search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
                ->latest()
                ->paginate(12)
                ->withQueryString(),
            'filters' => $request->only('search'),
        ]);
    }

    public function showCompany(Company $company)
    {
        abort_unless($company->verification_status === 'approved' && $company->is_active, 404);

        return Inertia::render('public/companies/show', [
            'company' => $company,
            'jobs' => $company->jobs()->with(['category', 'location'])->public()->latest()->paginate(10),
        ]);
    }

    public function apply(ApplicationRequest $request, Job $job)
    {
        abort_unless($job->status === 'active' && $job->deadline->isFuture(), 404);

        $data = $request->validated();
        if ($request->hasFile('cv_file')) {
            $data['cv_file'] = $request->file('cv_file')->store('applications', 'public');
        }

        Application::firstOrCreate(
            ['job_id' => $job->id, 'user_id' => $request->user()->id],
            $data + ['status' => 'pending']
        );

        return back()->with('success', 'Application submitted.');
    }

    public function toggleSave(Request $request, Job $job)
    {
        abort_unless($request->user()?->isEmployee(), 403);

        $saved = SavedJob::where('job_id', $job->id)->where('user_id', $request->user()->id)->first();
        $saved ? $saved->delete() : SavedJob::create(['job_id' => $job->id, 'user_id' => $request->user()->id]);

        return back()->with('success', $saved ? 'Job removed from saved jobs.' : 'Job saved.');
    }
}
