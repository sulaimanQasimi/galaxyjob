<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->index(['status', 'deadline'], 'jobs_status_deadline_index');
            $table->index(['status', 'category_id'], 'jobs_status_category_index');
            $table->index(['status', 'location_id'], 'jobs_status_location_index');
        });

        Schema::table('applications', function (Blueprint $table) {
            $table->index('job_id', 'applications_job_id_index');
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->index(['verification_status', 'is_active'], 'companies_status_active_index');
        });
    }

    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropIndex('jobs_status_deadline_index');
            $table->dropIndex('jobs_status_category_index');
            $table->dropIndex('jobs_status_location_index');
        });

        Schema::table('applications', function (Blueprint $table) {
            $table->dropIndex('applications_job_id_index');
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->dropIndex('companies_status_active_index');
        });
    }
};
