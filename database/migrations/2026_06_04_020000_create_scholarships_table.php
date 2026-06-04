<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scholarships', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('provider')->nullable();
            $table->string('country')->nullable();
            $table->string('study_level')->nullable();
            $table->string('funding_type')->nullable();
            $table->date('deadline')->nullable()->index();
            $table->text('summary')->nullable();
            $table->longText('description');
            $table->longText('eligibility')->nullable();
            $table->longText('benefits')->nullable();
            $table->string('official_url')->nullable();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_published')->default(true)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scholarships');
    }
};
