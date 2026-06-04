<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\AuditLog;
use App\Models\Category;
use App\Models\Company;
use App\Models\ContactMessage;
use App\Models\EmployerPackage;
use App\Models\EmployerSubscription;
use App\Models\Job;
use App\Models\Location;
use App\Models\Payment;
use App\Models\User;
use App\Support\Audits;
use App\Support\Slugs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function users(Request $request)
    {
        return Inertia::render('admin/users/index', ['users' => User::query()->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"))->latest()->paginate(15)->withQueryString(), 'filters' => $request->only('search')]);
    }

    public function companies()
    {
        return Inertia::render('admin/companies/index', ['companies' => Company::with(['user', 'verificationDocuments'])->withCount('jobs')->latest()->paginate(15)]);
    }

    public function jobs()
    {
        return Inertia::render('admin/jobs/index', ['jobs' => Job::with(['company', 'category', 'location'])->withCount('applications')->latest()->paginate(15)]);
    }

    public function applications()
    {
        return Inertia::render('admin/applications/index', ['applications' => Application::with(['user', 'job.company'])->latest()->paginate(15)]);
    }

    public function packages()
    {
        return Inertia::render('admin/packages/index', ['packages' => EmployerPackage::latest()->paginate(15)]);
    }

    public function payments()
    {
        return Inertia::render('admin/payments/index', ['payments' => Payment::with(['user', 'package', 'subscription'])->latest()->paginate(15)]);
    }

    public function auditLogs()
    {
        return Inertia::render('admin/audit-logs/index', ['logs' => AuditLog::with('user')->latest()->paginate(20)]);
    }

    public function contactMessages()
    {
        return Inertia::render('admin/contact-messages/index', ['messages' => ContactMessage::latest()->paginate(15)]);
    }

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
        $old = $user->only(['status', 'role']);
        $user->update($request->validate(['status' => ['required', 'in:active,inactive'], 'role' => ['required', 'in:admin,employee,employer']]));
        Audits::record('admin.user_updated', $user, $old, $user->only(['status', 'role']));

        return back()->with('success', 'User updated.');
    }

    public function updateCompany(Request $request, Company $company)
    {
        $old = $company->only(['verification_status', 'is_active', 'moderation_note']);
        $company->update($request->validate(['verification_status' => ['required', 'in:pending,approved,rejected'], 'is_active' => ['required', 'boolean'], 'moderation_note' => ['nullable', 'string', 'max:2000']]));
        $company->verificationDocuments()->where('status', 'pending')->update(['status' => $company->verification_status]);
        Audits::record('admin.company_moderated', $company, $old, $company->only(['verification_status', 'is_active', 'moderation_note']));

        return back()->with('success', 'Company updated.');
    }

    public function updateJob(Request $request, Job $job)
    {
        $old = $job->only(['status', 'is_featured', 'moderation_note']);
        $job->update($request->validate(['status' => ['required', 'in:pending,active,rejected,closed'], 'is_featured' => ['required', 'boolean'], 'moderation_note' => ['nullable', 'string', 'max:2000']]));
        Audits::record('admin.job_moderated', $job, $old, $job->only(['status', 'is_featured', 'moderation_note']));

        return back()->with('success', 'Job updated.');
    }

    public function updateApplication(Request $request, Application $application)
    {
        $data = $request->validate(['status' => ['required', 'in:pending,reviewed,shortlisted,rejected,hired'], 'note' => ['nullable', 'string', 'max:2000'], 'interview_at' => ['nullable', 'date']]);
        $application->update(['status' => $data['status']]);
        $application->statusUpdates()->create(['user_id' => $request->user()->id, 'status' => $data['status'], 'note' => $data['note'] ?? null, 'interview_at' => $data['interview_at'] ?? null]);
        Audits::record('admin.application_updated', $application, [], $data);

        return back()->with('success', 'Application updated.');
    }

    public function moderation()
    {
        return Inertia::render('admin/moderation/index', [
            'jobs' => Job::with(['company', 'category', 'location'])->where('status', 'pending')->latest()->paginate(10, ['*'], 'jobs_page'),
            'companies' => Company::with(['user', 'verificationDocuments'])->where('verification_status', 'pending')->latest()->paginate(10, ['*'], 'companies_page'),
        ]);
    }

    public function export(string $type)
    {
        $rows = match ($type) {
            'users' => User::latest()->get()->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'created_at' => $user->created_at,
            ]),
            'jobs' => Job::with('company:id,name')->latest()->get()->map(fn ($job) => [
                'id' => $job->id,
                'title' => $job->title,
                'company' => $job->company?->name,
                'status' => $job->status,
                'views_count' => $job->views_count,
                'created_at' => $job->created_at,
            ]),
            'applications' => Application::with(['user:id,name,email', 'job:id,title'])->latest()->get()->map(fn ($application) => [
                'id' => $application->id,
                'candidate' => $application->user?->name,
                'email' => $application->user?->email,
                'job' => $application->job?->title,
                'status' => $application->status,
                'created_at' => $application->created_at,
            ]),
            'payments' => Payment::with('user:id,name,email')->latest()->get()->map(fn ($payment) => [
                'id' => $payment->id,
                'user' => $payment->user?->name,
                'email' => $payment->user?->email,
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'status' => $payment->status,
                'reference' => $payment->reference,
                'created_at' => $payment->created_at,
            ]),
            default => abort(404),
        };

        $csv = fopen('php://temp', 'w+');
        $first = $rows->first();
        if ($first) {
            fputcsv($csv, array_keys((array) $first));
            $rows->each(fn ($row) => fputcsv($csv, (array) $row));
        }
        rewind($csv);

        return Response::make(stream_get_contents($csv), 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$type}.csv",
        ]);
    }

    public function storePackage(Request $request)
    {
        EmployerPackage::create($request->validate(['name' => ['required', 'string', 'max:255'], 'description' => ['nullable', 'string'], 'job_posts' => ['required', 'integer', 'min:1'], 'featured_posts' => ['required', 'integer', 'min:0'], 'price' => ['required', 'integer', 'min:0'], 'currency' => ['required', 'string', 'max:8'], 'duration_days' => ['required', 'integer', 'min:1'], 'is_active' => ['nullable', 'boolean']]));

        return back()->with('success', 'Package created.');
    }

    public function updatePayment(Request $request, Payment $payment)
    {
        $old = $payment->only(['status', 'reference', 'notes']);
        $payment->update($request->validate(['status' => ['required', 'in:pending,approved,rejected'], 'reference' => ['nullable', 'string', 'max:255'], 'notes' => ['nullable', 'string']]));
        if ($payment->status === 'approved' && $payment->employer_package_id && ! $payment->subscription) {
            $package = $payment->package;
            EmployerSubscription::create([
                'user_id' => $payment->user_id,
                'employer_package_id' => $payment->employer_package_id,
                'payment_id' => $payment->id,
                'starts_at' => now(),
                'ends_at' => now()->addDays($package->duration_days),
                'is_active' => true,
            ]);
        }
        Audits::record('admin.payment_updated', $payment, $old, $payment->only(['status', 'reference', 'notes']));

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
