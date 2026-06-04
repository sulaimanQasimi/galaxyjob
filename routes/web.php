<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmployerController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/api/homepage/live', [PublicController::class, 'live'])->name('homepage.live');
Route::get('/sitemap.xml', [PublicController::class, 'sitemap'])->name('sitemap');
Route::get('/robots.txt', [PublicController::class, 'robots'])->name('robots');
Route::get('/about', [PublicController::class, 'about'])->name('about');
Route::get('/contact', [PublicController::class, 'contact'])->name('contact');
Route::post('/contact', [PublicController::class, 'storeContact'])->name('contact.store');
Route::get('/jobs', [PublicController::class, 'jobs'])->name('jobs.index');
Route::get('/jobs/{job:slug}', [PublicController::class, 'showJob'])->name('jobs.show');
Route::get('/scholarships', [PublicController::class, 'scholarships'])->name('scholarships.index');
Route::get('/scholarships/{scholarship:slug}', [PublicController::class, 'showScholarship'])->name('scholarships.show');
Route::get('/blog', [PublicController::class, 'blog'])->name('blog.index');
Route::get('/blog/{blogPost:slug}', [PublicController::class, 'showBlogPost'])->name('blog.show');
Route::get('/companies', [PublicController::class, 'companies'])->name('companies.index');
Route::get('/companies/{company:slug}', [PublicController::class, 'showCompany'])->name('companies.show');
Route::get('/candidates/{employeeProfile:public_slug}', [PublicController::class, 'showCandidate'])->name('candidates.show');
Route::get('/feeds/jobs.xml', [PublicController::class, 'jobsFeed'])->name('feeds.jobs');
Route::get('/feeds/scholarships.xml', [PublicController::class, 'scholarshipsFeed'])->name('feeds.scholarships');
Route::get('/api/public/jobs', [PublicController::class, 'jobsApi'])->name('api.public.jobs');
Route::get('/api/public/scholarships', [PublicController::class, 'scholarshipsApi'])->name('api.public.scholarships');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::post('/jobs/{job}/apply', [PublicController::class, 'apply'])->middleware('role:employee')->name('jobs.apply');
    Route::post('/jobs/{job}/save', [PublicController::class, 'toggleSave'])->middleware('role:employee')->name('jobs.save');

    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'admin'])->name('dashboard');
        Route::get('users', [AdminController::class, 'users'])->name('users.index');
        Route::patch('users/{user}', [AdminController::class, 'updateUser'])->name('users.update');
        Route::get('companies', [AdminController::class, 'companies'])->name('companies.index');
        Route::patch('companies/{company}', [AdminController::class, 'updateCompany'])->name('companies.update');
        Route::get('jobs', [AdminController::class, 'jobs'])->name('jobs.index');
        Route::patch('jobs/{job}', [AdminController::class, 'updateJob'])->name('jobs.update');
        Route::get('scholarships', [AdminController::class, 'scholarships'])->name('scholarships.index');
        Route::post('scholarships', [AdminController::class, 'storeScholarship'])->name('scholarships.store');
        Route::patch('scholarships/{scholarship}', [AdminController::class, 'updateScholarship'])->name('scholarships.update');
        Route::post('scholarship-categories', [AdminController::class, 'storeScholarshipCategory'])->name('scholarship-categories.store');
        Route::get('blog', [AdminController::class, 'blogPosts'])->name('blog.index');
        Route::post('blog', [AdminController::class, 'storeBlogPost'])->name('blog.store');
        Route::patch('blog/{blogPost}', [AdminController::class, 'updateBlogPost'])->name('blog.update');
        Route::get('email-templates', [AdminController::class, 'emailTemplates'])->name('email-templates.index');
        Route::post('email-templates', [AdminController::class, 'storeEmailTemplate'])->name('email-templates.store');
        Route::patch('email-templates/{emailTemplate}', [AdminController::class, 'updateEmailTemplate'])->name('email-templates.update');
        Route::get('reports', [AdminController::class, 'reports'])->name('reports.index');
        Route::post('bulk-actions', [AdminController::class, 'bulkAction'])->name('bulk-actions.store');
        Route::get('categories', [AdminController::class, 'categories'])->name('categories.index');
        Route::post('categories', [AdminController::class, 'storeCategory'])->name('categories.store');
        Route::patch('categories/{category}', [AdminController::class, 'updateCategory'])->name('categories.update');
        Route::get('locations', [AdminController::class, 'locations'])->name('locations.index');
        Route::post('locations', [AdminController::class, 'storeLocation'])->name('locations.store');
        Route::patch('locations/{location}', [AdminController::class, 'updateLocation'])->name('locations.update');
        Route::get('applications', [AdminController::class, 'applications'])->name('applications.index');
        Route::patch('applications/{application}', [AdminController::class, 'updateApplication'])->name('applications.update');
        Route::get('packages', [AdminController::class, 'packages'])->name('packages.index');
        Route::post('packages', [AdminController::class, 'storePackage'])->name('packages.store');
        Route::get('payments', [AdminController::class, 'payments'])->name('payments.index');
        Route::patch('payments/{payment}', [AdminController::class, 'updatePayment'])->name('payments.update');
        Route::get('audit-logs', [AdminController::class, 'auditLogs'])->name('audit-logs.index');
        Route::get('moderation', [AdminController::class, 'moderation'])->name('moderation.index');
        Route::get('exports/{type}', [AdminController::class, 'export'])->name('exports.show');
        Route::get('contact-messages', [AdminController::class, 'contactMessages'])->name('contact-messages.index');
        Route::patch('contact-messages/{contactMessage}/read', [AdminController::class, 'markContactMessageRead'])->name('contact-messages.read');
        Route::delete('contact-messages/{contactMessage}', [AdminController::class, 'deleteContactMessage'])->name('contact-messages.destroy');
    });

    Route::prefix('employer')->name('employer.')->middleware('role:employer')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'employer'])->name('dashboard');
        Route::get('company/edit', [EmployerController::class, 'company'])->name('company.edit');
        Route::post('company', [EmployerController::class, 'updateCompany'])->name('company.update');
        Route::get('jobs', [EmployerController::class, 'jobs'])->name('jobs.index');
        Route::get('jobs/create', [EmployerController::class, 'createJob'])->name('jobs.create');
        Route::post('jobs', [EmployerController::class, 'storeJob'])->name('jobs.store');
        Route::get('jobs/{job}/edit', [EmployerController::class, 'editJob'])->name('jobs.edit');
        Route::patch('jobs/{job}', [EmployerController::class, 'updateJob'])->name('jobs.update');
        Route::delete('jobs/{job}', [EmployerController::class, 'destroyJob'])->name('jobs.destroy');
        Route::patch('jobs/{job}/close', [EmployerController::class, 'closeJob'])->name('jobs.close');
        Route::get('jobs/{job}/applicants', [EmployerController::class, 'applicants'])->name('jobs.applicants');
        Route::patch('applications/{application}', [EmployerController::class, 'updateApplicant'])->name('applications.update');
        Route::post('applications/{application}/messages', [EmployerController::class, 'storeApplicationMessage'])->name('applications.messages.store');
        Route::post('candidates/{user}/notes', [EmployerController::class, 'storeCandidateNote'])->name('candidates.notes.store');
        Route::get('candidates', [EmployerController::class, 'candidates'])->name('candidates.index');
        Route::get('calendar', [EmployerController::class, 'calendar'])->name('calendar.index');
        Route::get('team', [EmployerController::class, 'team'])->name('team.index');
        Route::post('team', [EmployerController::class, 'inviteTeamMember'])->name('team.store');
        Route::get('packages', [EmployerController::class, 'packages'])->name('packages.index');
        Route::post('payments', [EmployerController::class, 'storePayment'])->name('payments.store');
    });

    Route::prefix('employee')->name('employee.')->middleware('role:employee')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'employee'])->name('dashboard');
        Route::get('profile/edit', [EmployeeController::class, 'profile'])->name('profile.edit');
        Route::post('profile', [EmployeeController::class, 'updateProfile'])->name('profile.update');
        Route::get('profile/cv.pdf', [EmployeeController::class, 'downloadCv'])->name('profile.cv');
        Route::get('applications', [EmployeeController::class, 'applications'])->name('applications.index');
        Route::post('applications/{application}/messages', [EmployeeController::class, 'storeApplicationMessage'])->name('applications.messages.store');
        Route::delete('applications/{application}', [EmployeeController::class, 'withdrawApplication'])->name('applications.destroy');
        Route::get('saved-jobs', [EmployeeController::class, 'savedJobs'])->name('saved-jobs.index');
        Route::get('saved-companies', [EmployeeController::class, 'savedCompanies'])->name('saved-companies.index');
        Route::get('job-alerts', [EmployeeController::class, 'alerts'])->name('job-alerts.index');
        Route::post('job-alerts', [EmployeeController::class, 'storeAlert'])->name('job-alerts.store');
        Route::delete('job-alerts/{jobAlert}', [EmployeeController::class, 'destroyAlert'])->name('job-alerts.destroy');
        Route::post('scholarship-alerts', [EmployeeController::class, 'storeScholarshipAlert'])->name('scholarship-alerts.store');
        Route::delete('scholarship-alerts/{scholarshipAlert}', [EmployeeController::class, 'destroyScholarshipAlert'])->name('scholarship-alerts.destroy');
        Route::get('calendar', [EmployeeController::class, 'calendar'])->name('calendar.index');
    });
});

Route::middleware(['auth', 'verified', 'role:employee'])->group(function () {
    Route::post('/companies/{company}/reviews', [PublicController::class, 'storeCompanyReview'])->name('companies.reviews.store');
    Route::post('/companies/{company}/save', [PublicController::class, 'toggleCompanySave'])->name('companies.save');
    Route::post('/jobs/searches', [PublicController::class, 'saveSearch'])->name('jobs.searches.store');
});

require __DIR__.'/settings.php';
