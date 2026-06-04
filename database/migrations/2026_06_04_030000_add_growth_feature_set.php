<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scholarship_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::table('scholarships', function (Blueprint $table) {
            $table->foreignId('scholarship_category_id')->nullable()->after('id')->constrained()->nullOnDelete();
            $table->string('language', 8)->default('en')->after('funding_type')->index();
        });

        Schema::create('scholarship_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('scholarship_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('keyword')->nullable();
            $table->string('country')->nullable();
            $table->string('study_level')->nullable();
            $table->string('funding_type')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamp('last_sent_at')->nullable();
            $table->timestamps();
        });

        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->default('Career Advice')->index();
            $table->string('language', 8)->default('en')->index();
            $table->string('summary')->nullable();
            $table->longText('body');
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_published')->default(true)->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();
        });

        Schema::table('employee_profiles', function (Blueprint $table) {
            $table->string('public_slug')->nullable()->unique()->after('user_id');
            $table->boolean('is_public')->default(false)->after('public_slug')->index();
            $table->json('parsed_cv_data')->nullable()->after('cv_file');
        });

        Schema::create('candidate_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('note');
            $table->timestamps();
        });

        Schema::create('email_templates', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('name');
            $table->string('subject');
            $table->longText('body');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('company_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('email');
            $table->string('role')->default('member');
            $table->enum('status', ['invited', 'active'])->default('invited')->index();
            $table->timestamps();
            $table->unique(['company_id', 'email']);
        });

        Schema::create('saved_companies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['company_id', 'user_id']);
        });

        Schema::table('jobs', function (Blueprint $table) {
            $table->string('language', 8)->default('en')->after('work_mode')->index();
        });

        DB::table('scholarship_categories')->insert([
            ['name' => 'Undergraduate', 'slug' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Master\'s', 'slug' => 'masters', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'PhD', 'slug' => 'phd', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Fully Funded', 'slug' => 'fully-funded', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Exchange Program', 'slug' => 'exchange-program', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Online Course', 'slug' => 'online-course', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropColumn('language');
        });

        Schema::dropIfExists('saved_companies');
        Schema::dropIfExists('company_members');
        Schema::dropIfExists('email_templates');
        Schema::dropIfExists('candidate_notes');

        Schema::table('employee_profiles', function (Blueprint $table) {
            $table->dropColumn(['public_slug', 'is_public', 'parsed_cv_data']);
        });

        Schema::dropIfExists('blog_posts');
        Schema::dropIfExists('scholarship_alerts');

        Schema::table('scholarships', function (Blueprint $table) {
            $table->dropConstrainedForeignId('scholarship_category_id');
            $table->dropColumn('language');
        });

        Schema::dropIfExists('scholarship_categories');
    }
};
