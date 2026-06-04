<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeProfileRequest;
use App\Models\Application;
use App\Models\Category;
use App\Models\JobAlert;
use App\Models\Location;
use App\Models\Skill;
use Illuminate\Http\Request;
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
        }
        $profile = $request->user()->employeeProfile()->updateOrCreate(['user_id' => $request->user()->id], $data);
        $profile->skills()->sync($skills);

        return back()->with('success', 'Profile saved.');
    }

    public function applications()
    {
        return Inertia::render('employee/applications/index', ['applications' => request()->user()->applications()->with(['job.company', 'job.category', 'job.location', 'statusUpdates.user'])->latest()->paginate(15)]);
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
