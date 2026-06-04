<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->boolean('is_urgent')->default(false)->after('is_featured')->index();
            $table->enum('work_mode', ['on_site', 'hybrid', 'remote'])->default('on_site')->after('job_type')->index();
        });

        Schema::table('employee_profiles', function (Blueprint $table) {
            $table->string('portfolio_url')->nullable()->after('cv_file');
            $table->text('certifications')->nullable()->after('portfolio_url');
            $table->text('languages')->nullable()->after('certifications');
        });

        Schema::create('employer_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employer_package_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->unsignedInteger('job_posts_used')->default(0);
            $table->unsignedInteger('featured_posts_used')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('application_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('body');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        Schema::create('company_verification_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('document_type');
            $table->string('file_path');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->index();
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('saved_searches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->json('filters');
            $table->boolean('email_alerts')->default(false);
            $table->timestamps();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');
            $table->nullableMorphs('auditable');
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('saved_searches');
        Schema::dropIfExists('company_verification_documents');
        Schema::dropIfExists('application_messages');
        Schema::dropIfExists('employer_subscriptions');

        Schema::table('employee_profiles', function (Blueprint $table) {
            $table->dropColumn(['portfolio_url', 'certifications', 'languages']);
        });

        Schema::table('jobs', function (Blueprint $table) {
            $table->dropColumn(['is_urgent', 'work_mode']);
        });
    }
};
