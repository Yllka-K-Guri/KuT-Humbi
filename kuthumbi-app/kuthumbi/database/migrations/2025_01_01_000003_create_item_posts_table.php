<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('item_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('post_type', ['LOST', 'FOUND']);
            $table->foreignId('category_id')->constrained('categories')->onDelete('restrict');
            $table->foreignId('location_id')->constrained('locations')->onDelete('restrict');
            $table->string('title');
            $table->text('description');
            $table->date('incident_date');
            $table->enum('status', ['ACTIVE', 'RESOLVED', 'CLOSED'])->default('ACTIVE');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_posts');
    }
};