<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Telefon',        'name_en' => 'Phone',     'icon' => '📱'],
            ['name' => 'Çelësa',         'name_en' => 'Keys',      'icon' => '🔑'],
            ['name' => 'Dokumente',      'name_en' => 'Documents', 'icon' => '📄'],
            ['name' => 'Kuletë',         'name_en' => 'Wallet',    'icon' => '👜'],
            ['name' => 'Çantë',          'name_en' => 'Bag',       'icon' => '🎒'],
            ['name' => 'Rrobë',          'name_en' => 'Clothing',  'icon' => '👕'],
            ['name' => 'Kafshë shtëpie', 'name_en' => 'Pet',       'icon' => '🐾'],
            ['name' => 'Tjera',          'name_en' => 'Other',     'icon' => '📦'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['name' => $cat['name']], $cat);
        }
    }
}