<?php

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::view('/', 'welcome')->name('home');
Route::get('/summoner/{summonerName}', [Controller::class, 'getSummoner']);
Route::get('/summoner/{summonerName}/{matchId}', [Controller::class, 'getSummonerMatch']);
Route::get('/get_items', [Controller::class, 'allItems']);


Route::get('scrap', [Controller::class, 'scrapLolFandom']);

Route::get('/update', [Controller::class, 'loadItems']);
