<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Company;
use App\Models\Job;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $user = request()->user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->isEmployer()) {
            return redirect()->route('employer.dashboard');
        }

        return redirect()->route('employee.dashboard');
    }

    public function admin()
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => User::count(),
                'totalEmployers' => User::where('role', 'employer')->count(),
                'totalEmployees' => User::where('role', 'employee')->count(),
                'totalJobs' => Job::count(),
                'pendingJobs' => Job::where('status', 'pending')->count(),
                'activeJobs' => Job::where('status', 'active')->count(),
                'applications' => Application::count(),
            ],
            'pendingJobs' => Job::with(['company', 'category', 'location'])->where('status', 'pending')->latest()->take(6)->get(),
            'pendingCompanies' => Company::with('user')->where('verification_status', 'pending')->latest()->take(6)->get(),
        ]);
    }

    public function employer()
    {
        $company = request()->user()->company;

        return Inertia::render('employer/dashboard', [
            'company' => $company,
            'subscription' => request()->user()->activeEmployerSubscription()->with('package')->first(),
            'stats' => [
                'jobs' => $company?->jobs()->count() ?? 0,
                'activeJobs' => $company?->jobs()->where('status', 'active')->count() ?? 0,
                'pendingJobs' => $company?->jobs()->where('status', 'pending')->count() ?? 0,
                'applications' => $company?->jobs()->withCount('applications')->get()->sum('applications_count') ?? 0,
                'views' => $company?->jobs()->sum('views_count') ?? 0,
            ],
            'recentJobs' => $company?->jobs()->with(['category', 'location'])->withCount('applications')->latest()->take(6)->get() ?? [],
            'analytics' => [
                'topJobs' => $company?->jobs()->withCount('applications')->orderByDesc('views_count')->take(5)->get(['id', 'title', 'views_count']) ?? [],
                'applicationsByStatus' => $company
                    ? Application::whereHas('job', fn ($query) => $query->where('company_id', $company->id))
                        ->selectRaw('status, count(*) as total')
                        ->groupBy('status')
                        ->pluck('total', 'status')
                    : [],
                'recentApplications' => $company
                    ? Application::with(['user:id,name', 'job:id,title,company_id'])
                        ->whereHas('job', fn ($query) => $query->where('company_id', $company->id))
                        ->latest()
                        ->take(6)
                        ->get()
                    : [],
            ],
        ]);
    }

    public function employee()
    {
        $user = request()->user();

        return Inertia::render('employee/dashboard', [
            'profile' => $user->employeeProfile?->load('skills'),
            'profileCompleteness' => $this->profileCompleteness($user->employeeProfile),
            'stats' => [
                'applications' => $user->applications()->count(),
                'savedJobs' => $user->savedJobs()->count(),
                'alerts' => $user->jobAlerts()->count(),
            ],
            'applications' => $user->applications()->with(['job.company', 'job.category', 'job.location'])->latest()->take(6)->get(),
            'recommendedJobs' => $this->recommendedJobs($user),
        ]);
    }

    private function recommendedJobs(User $user)
    {
        $profile = $user->employeeProfile?->load('skills');
        $skillIds = $profile?->skills->pluck('id')->all() ?? [];
        $appliedJobIds = $user->applications()->pluck('job_id');
        $savedCategoryIds = $user->savedJobs()->with('job:id,category_id')->get()->pluck('job.category_id')->filter()->unique()->all();

        return Job::with(['company', 'category', 'location', 'skills'])
            ->withCount(['skills as matching_skills_count' => fn ($query) => $query->whereIn('skills.id', $skillIds)])
            ->public()
            ->whereNotIn('id', $appliedJobIds)
            ->get()
            ->map(function (Job $job) use ($profile, $savedCategoryIds) {
                $score = 0;
                $reasons = [];
                $score += ($job->matching_skills_count ?? 0) * 12;
                if (($job->matching_skills_count ?? 0) > 0) {
                    $reasons[] = $job->matching_skills_count.' matching skills';
                }
                if (in_array($job->category_id, $savedCategoryIds, true)) {
                    $score += 8;
                    $reasons[] = 'Category matches saved jobs';
                }
                if ($profile && $job->salary_min && $profile->expected_salary && $job->salary_min >= ($profile->expected_salary * 0.8)) {
                    $score += 5;
                    $reasons[] = 'Salary is near your expectation';
                }
                $experienceScore = match ($job->experience_level) {
                    'entry' => ($profile?->experience_years ?? 0) <= 2 ? 5 : 1,
                    'mid' => ($profile?->experience_years ?? 0) >= 2 && ($profile?->experience_years ?? 0) <= 7 ? 5 : 1,
                    'senior' => ($profile?->experience_years ?? 0) >= 6 ? 5 : 1,
                    default => 0,
                };
                $score += $experienceScore;
                if ($experienceScore >= 5) {
                    $reasons[] = 'Experience level fits';
                }
                $job->match_score = $score;
                $job->match_reasons = $reasons;

                return $job;
            })
            ->sortByDesc('match_score')
            ->take(6)
            ->values();
    }

    private function profileCompleteness($profile): array
    {
        $fields = [
            'headline' => 'Add a headline',
            'summary' => 'Add a professional summary',
            'phone' => 'Add a phone number',
            'address' => 'Add your location',
            'education' => 'Add education details',
            'expected_salary' => 'Add expected salary',
            'cv_file' => 'Upload a CV',
        ];

        $missing = collect($fields)->filter(fn ($label, $field) => blank($profile?->{$field}))->values()->all();
        $score = $profile ? (int) round(((count($fields) - count($missing)) / count($fields)) * 100) : 0;

        return ['score' => $score, 'missing' => $missing];
    }
}
