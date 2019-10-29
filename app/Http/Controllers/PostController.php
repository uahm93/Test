<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class PostController extends Controller
{

    public function InsertarNuevo(Request $request)
    {
        $categoria = $request->categoria;
        $titulo    = $request->titulo;
        $descripcion = $request->descripcion;
        $id_usuario = auth()->user()->id;

        try {
            $registro = DB::table('Post')->insert([
                ['categoria' => $categoria, 'titulo' => $titulo, 'descripcion' => $descripcion, 'user_id' => $id_usuario, 'created_at' => now(), 'updated_at' => now()]
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'estado' => '500',
                'mensaje' => 'Algo salio mal con su consulta'
            ]);
        }


        if ($registro) {
            return response()->json([
                'estado' => '200',
                'mensaje' => 'Registro agregado correctamente'
            ]);
        } else {
            return response()->json([
                'estado' => '500',
                'mensaje' => 'No se pudo persistir el registro'
            ]);
        }
    }

    public function obtenerPosts()
    {
        $id_usuario = auth()->user()->id;
        return DB::table('Post')->select('*')->where('user_id', $id_usuario)->get();
    }
}
