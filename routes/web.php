<?php

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

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
Route::get('/Configuracion', 'HomeController@index')->name('home');
Route::get('/Registros', 'HomeController@index')->name('home');
Route::get('/Nuevo', 'HomeController@index')->name('home');

Route::get('obtenerMenu/', [
    'uses' => 'GetMenuController@obtenerMenu',
    'as'   => 'obtenerMenu'
])->middleware('auth');

Route::get('logout/', [
    'uses' => 'HomeController@logout',
    'as'   => 'logout'
])->middleware('auth');


//Rutas usuarios
Route::POST('nuevoUser/', [
    'uses' => 'UserAdminController@InsertarNuevoUser',
    'as'   => 'nuevoUser'
])->middleware('auth');

Route::POST('ActualizarUser/', [
    'uses' => 'UserAdminController@ActualizarUser',
    'as'   => 'ActualizarUser'
])->middleware('auth');

Route::GET('obtenerUsuarios/', [
    'uses' => 'UserAdminController@obtenerUsuarios',
    'as'   => 'obtenerUsuarios'
])->middleware('auth');

Route::GET('obtenerUser/{id}', [
    'uses' => 'UserAdminController@obtenerUser',
    'as'   => 'obtenerUser'
])->middleware('auth');

Route::GET('ActualizarPW/{id}', [
    'uses' => 'UserAdminController@ActualizarPW',
    'as'   => 'ActualizarPW'
])->middleware('auth');
// FIN Rutas usuarios

//Rutas registros
Route::GET('obtenerPosts/', [
    'uses' => 'PostController@obtenerPosts',
    'as'   => 'obtenerPosts'
])->middleware('auth');

Route::POST('nuevoPost/', [
    'uses' => 'PostController@InsertarNuevo',
    'as'   => 'nuevoPost'
])->middleware('auth');
//Fin rutas registros
