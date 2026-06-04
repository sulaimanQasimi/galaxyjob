<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->text('moderation_note')->nullable()->after('verification_status');
            $table->unsignedSmallInteger('company_size')->nullable()->after('industry');
        });

        Schema::table('jobs', function (Blueprint $table) {
            $table->text('moderation_note')->nullable()->after('status');
            $table->unsignedInteger('views_count')->default(0)->after('is_featured');
        });

        Schema::table('job_alerts', function (Blueprint $table) {
            $table->timestamp('last_sent_at')->nullable()->after('is_active');
        });

        Schema::create('application_status_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status');
            $table->text('note')->nullable();
            $table->timestamp('interview_at')->nullable();
            $table->timestamps();
        });

        Schema::create('company_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('rating');
            $table->string('title')->nullable();
            $table->text('body')->nullable();
            $table->boolean('is_approved')->default(true)->index();
            $table->timestamps();
            $table->unique(['company_id', 'user_id']);
        });

        Schema::create('employee_profile_skill', function (Blueprint $table) {
            $table->foreignId('employee_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('skill_id')->constrained()->cascadeOnDelete();
            $table->primary(['employee_profile_id', 'skill_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_profile_skill');
        Schema::dropIfExists('company_reviews');
        Schema::dropIfExists('application_status_updates');

        Schema::table('job_alerts', function (Blueprint $table) {
            $table->dropColumn('last_sent_at');
        });

        Schema::table('jobs', function (Blueprint $table) {
            $table->dropColumn(['moderation_note', 'views_count']);
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['moderation_note', 'company_size']);
        });
    }
};
