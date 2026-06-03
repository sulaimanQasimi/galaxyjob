<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmployerController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/jobs', [PublicController::class, 'jobs'])->name('jobs.index');
Route::get('/jobs/{job:slug}', [PublicController::class, 'showJob'])->name('jobs.show');
Route::get('/companies', [PublicController::class, 'companies'])->name('companies.index');
Route::get('/companies/{company:slug}', [PublicController::class, 'showCompany'])->name('companies.show');

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
        Route::get('jobs/{job}/applicants', [EmployerController::class, 'applicants'])->name('jobs.applicants');
        Route::patch('applications/{application}', [EmployerController::class, 'updateApplicant'])->name('applications.update');
    });

    Route::prefix('employee')->name('employee.')->middleware('role:employee')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'employee'])->name('dashboard');
        Route::get('profile/edit', [EmployeeController::class, 'profile'])->name('profile.edit');
        Route::post('profile', [EmployeeController::class, 'updateProfile'])->name('profile.update');
        Route::get('applications', [EmployeeController::class, 'applications'])->name('applications.index');
        Route::get('saved-jobs', [EmployeeController::class, 'savedJobs'])->name('saved-jobs.index');
        Route::get('job-alerts', [EmployeeController::class, 'alerts'])->name('job-alerts.index');
        Route::post('job-alerts', [EmployeeController::class, 'storeAlert'])->name('job-alerts.store');
        Route::delete('job-alerts/{jobAlert}', [EmployeeController::class, 'destroyAlert'])->name('job-alerts.destroy');
    });
});

require __DIR__.'/settings.php';
