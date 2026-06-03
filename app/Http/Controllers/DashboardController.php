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
            'stats' => [
                'jobs' => $company?->jobs()->count() ?? 0,
                'activeJobs' => $company?->jobs()->where('status', 'active')->count() ?? 0,
                'pendingJobs' => $company?->jobs()->where('status', 'pending')->count() ?? 0,
                'applications' => $company?->jobs()->withCount('applications')->get()->sum('applications_count') ?? 0,
            ],
            'recentJobs' => $company?->jobs()->with(['category', 'location'])->withCount('applications')->latest()->take(6)->get() ?? [],
        ]);
    }

    public function employee()
    {
        $user = request()->user();

        return Inertia::render('employee/dashboard', [
            'profile' => $user->employeeProfile,
            'stats' => [
                'applications' => $user->applications()->count(),
                'savedJobs' => $user->savedJobs()->count(),
                'alerts' => $user->jobAlerts()->count(),
            ],
            'applications' => $user->applications()->with(['job.company', 'job.category', 'job.location'])->latest()->take(6)->get(),
            'recommendedJobs' => Job::with(['company', 'category', 'location'])->public()->latest()->take(6)->get(),
        ]);
    }
}
