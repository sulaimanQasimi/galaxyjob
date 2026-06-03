<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Category;
use App\Models\Company;
use App\Models\ContactMessage;
use App\Models\EmployerPackage;
use App\Models\Job;
use App\Models\Location;
use App\Models\Payment;
use App\Models\User;
use App\Support\Slugs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function users(Request $request) { return Inertia::render('admin/users/index', ['users' => User::query()->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"))->latest()->paginate(15)->withQueryString(), 'filters' => $request->only('search')]); }
    public function companies() { return Inertia::render('admin/companies/index', ['companies' => Company::with('user')->withCount('jobs')->latest()->paginate(15)]); }
    public function jobs() { return Inertia::render('admin/jobs/index', ['jobs' => Job::with(['company', 'category', 'location'])->withCount('applications')->latest()->paginate(15)]); }
    public function applications() { return Inertia::render('admin/applications/index', ['applications' => Application::with(['user', 'job.company'])->latest()->paginate(15)]); }
    public function packages() { return Inertia::render('admin/packages/index', ['packages' => EmployerPackage::latest()->paginate(15)]); }
    public function payments() { return Inertia::render('admin/payments/index', ['payments' => Payment::with(['user', 'package'])->latest()->paginate(15)]); }

    public function contactMessages() { return Inertia::render('admin/contact-messages/index', ['messages' => ContactMessage::latest()->paginate(15)]); }

    public function categories()
    {
        return Inertia::render('admin/categories/index', ['categories' => Category::withCount('jobs')->orderBy('name')->paginate(20)]);
    }

    public function storeCategory(Request $request)
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:255'], 'description' => ['nullable', 'string'], 'is_active' => ['nullable', 'boolean']]);
        Category::create($data + ['slug' => Slugs::unique(Category::class, $data['name']), 'is_active' => $request->boolean('is_active', true)]);
        return back()->with('success', 'Category created.');
    }

    public function updateCategory(Request $request, Category $category)
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:255'], 'description' => ['nullable', 'string'], 'is_active' => ['nullable', 'boolean']]);
        $category->update($data + ['slug' => Slugs::unique(Category::class, $data['name'], $category->id), 'is_active' => $request->boolean('is_active')]);
        return back()->with('success', 'Category updated.');
    }

    public function locations()
    {
        return Inertia::render('admin/locations/index', ['locations' => Location::withCount('jobs')->orderBy('name')->paginate(20)]);
    }

    public function storeLocation(Request $request)
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:255'], 'country' => ['nullable', 'string', 'max:255'], 'is_active' => ['nullable', 'boolean']]);
        Location::create($data + ['slug' => Slugs::unique(Location::class, $data['name']), 'country' => $data['country'] ?? 'Afghanistan', 'is_active' => $request->boolean('is_active', true)]);
        return back()->with('success', 'Location created.');
    }

    public function updateLocation(Request $request, Location $location)
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:255'], 'country' => ['nullable', 'string', 'max:255'], 'is_active' => ['nullable', 'boolean']]);
        $location->update($data + ['slug' => Slugs::unique(Location::class, $data['name'], $location->id), 'country' => $data['country'] ?? 'Afghanistan', 'is_active' => $request->boolean('is_active')]);
        return back()->with('success', 'Location updated.');
    }

    public function updateUser(Request $request, User $user)
    {
        $user->update($request->validate(['status' => ['required', 'in:active,inactive'], 'role' => ['required', 'in:admin,employee,employer']]));
        return back()->with('success', 'User updated.');
    }

    public function updateCompany(Request $request, Company $company)
    {
        $company->update($request->validate(['verification_status' => ['required', 'in:pending,approved,rejected'], 'is_active' => ['required', 'boolean']]));
        return back()->with('success', 'Company updated.');
    }

    public function updateJob(Request $request, Job $job)
    {
        $job->update($request->validate(['status' => ['required', 'in:pending,active,rejected,closed'], 'is_featured' => ['required', 'boolean']]));
        return back()->with('success', 'Job updated.');
    }

    public function updateApplication(Request $request, Application $application)
    {
        $application->update($request->validate(['status' => ['required', 'in:pending,reviewed,shortlisted,rejected,hired']]));
        return back()->with('success', 'Application updated.');
    }

    public function storePackage(Request $request)
    {
        EmployerPackage::create($request->validate(['name' => ['required', 'string', 'max:255'], 'description' => ['nullable', 'string'], 'job_posts' => ['required', 'integer', 'min:1'], 'featured_posts' => ['required', 'integer', 'min:0'], 'price' => ['required', 'integer', 'min:0'], 'currency' => ['required', 'string', 'max:8'], 'duration_days' => ['required', 'integer', 'min:1'], 'is_active' => ['nullable', 'boolean']]));
        return back()->with('success', 'Package created.');
    }

    public function updatePayment(Request $request, Payment $payment)
    {
        $payment->update($request->validate(['status' => ['required', 'in:pending,approved,rejected'], 'reference' => ['nullable', 'string', 'max:255'], 'notes' => ['nullable', 'string']]));
        return back()->with('success', 'Payment updated.');
    }

    public function markContactMessageRead(ContactMessage $contactMessage)
    {
        $contactMessage->update(['is_read' => true]);

        return back()->with('success', 'Contact message marked as read.');
    }

    public function deleteContactMessage(ContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return back()->with('success', 'Contact message deleted.');
    }
}
