<?php

namespace App\Http\Controllers;

use App\Exceptions\Handler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class GetMenuController extends Controller
{

    public function obtenerMenu()
    {
        $usuario = auth()->user()->tipo_user;
        if ($usuario == 1) { //Si es usuario admin puede ver todo

            return $consulta = DB::table('menu')->select('titulo', 'descripcion')->get();
        } else {

            return $consulta = DB::table('menu')->select('titulo', 'descripcion')->where('acceso', '!=', '1')->get();
        }
    }
}
