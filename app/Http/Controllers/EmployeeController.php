<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeProfileRequest;
use App\Models\Category;
use App\Models\JobAlert;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function profile()
    {
        return Inertia::render('employee/profile/edit', ['profile' => request()->user()->employeeProfile]);
    }

    public function updateProfile(EmployeeProfileRequest $request)
    {
        $data = $request->validated();
        if ($request->hasFile('cv_file')) {
            $data['cv_file'] = $request->file('cv_file')->store('cvs', 'public');
        }
        $request->user()->employeeProfile()->updateOrCreate(['user_id' => $request->user()->id], $data);

        return back()->with('success', 'Profile saved.');
    }

    public function applications()
    {
        return Inertia::render('employee/applications/index', ['applications' => request()->user()->applications()->with(['job.company', 'job.category', 'job.location'])->latest()->paginate(15)]);
    }

    public function savedJobs()
    {
        return Inertia::render('employee/saved-jobs/index', ['savedJobs' => request()->user()->savedJobs()->with(['job.company', 'job.category', 'job.location'])->latest()->paginate(15)]);
    }

    public function alerts()
    {
        return Inertia::render('employee/job-alerts/index', [
            'alerts' => request()->user()->jobAlerts()->with(['category', 'location'])->latest()->paginate(15),
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
}
