<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('display_name')->nullable()->after('name');
            $table->string('phone', 20)->nullable()->after('display_name');
            $table->enum('preferred_language', ['sq', 'en'])->default('sq')->after('phone');
            $table->boolean('is_active')->default(true)->after('preferred_language');
            $table->timestamp('last_login_at')->nullable()->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'display_name', 'phone', 'preferred_language',
                'is_active', 'last_login_at'
            ]);
        });
    }
};