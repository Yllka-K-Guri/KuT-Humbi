<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lost_post_id')
                  ->constrained('item_posts')
                  ->onDelete('cascade');
            $table->foreignId('found_post_id')
                  ->constrained('item_posts')
                  ->onDelete('cascade');
            $table->decimal('match_score', 5, 2);
            $table->enum('status', ['PENDING', 'CONFIRMED', 'REJECTED'])
                  ->default('PENDING');
            $table->timestamps();

            $table->unique(['lost_post_id', 'found_post_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_matches');
    }
};