<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Category;
use App\Models\Company;
use App\Models\EmployeeProfile;
use App\Models\EmployerPackage;
use App\Models\Job;
use App\Models\JobAlert;
use App\Models\Location;
use App\Models\Payment;
use App\Models\SavedJob;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Portal Admin',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'password' => Hash::make('password'),
        ]);

        $categoryNames = ['Accounting', 'Administration', 'Customer Support', 'Design', 'Education', 'Engineering', 'Finance', 'Healthcare', 'Marketing', 'Technology'];
        $categories = collect($categoryNames)->map(fn ($name) => Category::create([
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => "Open {$name} roles across Afghanistan.",
        ]));

        $locationNames = ['Kabul', 'Herat', 'Mazar-i-Sharif', 'Kandahar', 'Nangarhar', 'Bamyan', 'Kunduz', 'Ghazni', 'Badakhshan', 'Remote'];
        $locations = collect($locationNames)->map(fn ($name) => Location::create([
            'name' => $name,
            'slug' => Str::slug($name),
        ]));

        $skills = collect(['Laravel', 'React', 'TypeScript', 'Project Management', 'English', 'Dari', 'Pashto', 'Excel', 'Sales', 'Accounting', 'Design', 'Data Analysis', 'Communication', 'SQL', 'Customer Service'])
            ->map(fn ($name) => Skill::create(['name' => $name, 'slug' => Str::slug($name)]));

        EmployerPackage::insert([
            ['name' => 'Starter', 'description' => 'Manual approval package for small teams.', 'job_posts' => 3, 'featured_posts' => 0, 'price' => 1500, 'currency' => 'AFN', 'duration_days' => 30, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Growth', 'description' => 'More jobs and featured visibility.', 'job_posts' => 10, 'featured_posts' => 2, 'price' => 4500, 'currency' => 'AFN', 'duration_days' => 60, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Enterprise', 'description' => 'High-volume hiring for larger employers.', 'job_posts' => 30, 'featured_posts' => 8, 'price' => 12000, 'currency' => 'AFN', 'duration_days' => 90, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        $employers = collect();
        for ($i = 1; $i <= 5; $i++) {
            $employers->push(User::factory()->create([
                'name' => $i === 1 ? 'Sample Employer' : fake()->name(),
                'email' => $i === 1 ? 'employer@example.com' : "employer{$i}@example.com",
                'role' => 'employer',
                'password' => Hash::make('password'),
            ]));
        }

        $companies = $employers->map(function (User $user, int $index) {
            $name = ['Kabul Tech Solutions', 'Ariana Health Group', 'Pamír Logistics', 'Herat Creative Studio', 'Safi Finance'][($index % 5)];

            return Company::create([
                'user_id' => $user->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'industry' => ['Technology', 'Healthcare', 'Logistics', 'Design', 'Finance'][($index % 5)],
                'website' => 'https://example.com',
                'phone' => '+93 700 000 00'.$index,
                'email' => "hr{$index}@example.com",
                'address' => fake()->streetAddress(),
                'description' => fake()->paragraphs(2, true),
                'verification_status' => $index < 4 ? 'approved' : 'pending',
                'is_active' => true,
            ]);
        });

        $employees = collect();
        for ($i = 1; $i <= 20; $i++) {
            $employee = User::factory()->create([
                'name' => $i === 1 ? 'Sample Employee' : fake()->name(),
                'email' => $i === 1 ? 'employee@example.com' : "employee{$i}@example.com",
                'role' => 'employee',
                'password' => Hash::make('password'),
            ]);
            EmployeeProfile::create([
                'user_id' => $employee->id,
                'headline' => fake()->jobTitle(),
                'summary' => fake()->paragraph(),
                'phone' => $employee->phone,
                'address' => fake()->address(),
                'experience_years' => fake()->numberBetween(0, 12),
                'education' => fake()->sentence(),
                'expected_salary' => fake()->numberBetween(25000, 120000),
            ]);
            $employees->push($employee);
        }

        for ($i = 1; $i <= 50; $i++) {
            $title = fake()->jobTitle();
            $job = Job::create([
                'company_id' => $companies->random()->id,
                'category_id' => $categories->random()->id,
                'location_id' => $locations->random()->id,
                'title' => $title,
                'slug' => Str::slug($title).'-'.$i,
                'description' => fake()->paragraphs(4, true),
                'responsibilities' => fake()->paragraphs(2, true),
                'requirements' => fake()->paragraphs(2, true),
                'benefits' => fake()->paragraphs(2, true),
                'salary_min' => fake()->numberBetween(20000, 60000),
                'salary_max' => fake()->numberBetween(70000, 180000),
                'salary_currency' => 'AFN',
                'job_type' => fake()->randomElement(['full_time', 'part_time', 'contract', 'internship', 'remote']),
                'experience_level' => fake()->randomElement(['entry', 'mid', 'senior']),
                'deadline' => now()->addDays(fake()->numberBetween(7, 60))->toDateString(),
                'status' => $i <= 40 ? 'active' : fake()->randomElement(['pending', 'rejected', 'closed']),
                'is_featured' => $i <= 8,
            ]);
            $job->skills()->sync($skills->random(fake()->numberBetween(2, 5))->pluck('id'));
        }

        Job::where('status', 'active')->take(18)->get()->each(function (Job $job) use ($employees) {
            $employees->random(fake()->numberBetween(1, 4))->each(function (User $employee) use ($job) {
                Application::firstOrCreate(
                    ['job_id' => $job->id, 'user_id' => $employee->id],
                    ['cover_letter' => fake()->paragraph(), 'status' => fake()->randomElement(['pending', 'reviewed', 'shortlisted', 'rejected'])]
                );
            });
        });

        $sampleEmployee = User::where('email', 'employee@example.com')->first();
        Job::public()->take(5)->get()->each(fn (Job $job) => SavedJob::firstOrCreate(['job_id' => $job->id, 'user_id' => $sampleEmployee->id]));
        JobAlert::create(['user_id' => $sampleEmployee->id, 'keyword' => 'Laravel', 'category_id' => $categories->first()->id, 'location_id' => $locations->first()->id]);

        Payment::create([
            'user_id' => $employers->first()->id,
            'employer_package_id' => EmployerPackage::first()->id,
            'amount' => 1500,
            'currency' => 'AFN',
            'status' => 'pending',
            'reference' => 'MANUAL-001',
            'notes' => 'Seeded manual payment for review.',
        ]);
    }
}
