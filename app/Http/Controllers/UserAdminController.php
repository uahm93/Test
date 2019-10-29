<?php

namespace App\Http\Controllers;

use App\Exceptions\Handler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class UserAdminController extends Controller
{

    public function obtenerUsuarios()
    {
        $usuario = auth()->user()->tipo_user;
        if ($usuario == 1) { //Si es usuario admin puede ver todo

            return DB::table('users')->select('id', 'name', 'email', 'tipo_user', 'alta_por', 'created_at')->get();
        } else {

            return DB::table('users')->select('id', 'name', 'email', 'tipo_user', 'alta_por', 'created_at')->where('acceso', '!=', '1')->get();
        }
    }
    public function obtenerUser($id)
    {
        $usuario = auth()->user()->tipo_user;
        if ($usuario == 1) { //Si es usuario admin puede ver todo

            $consulta =  DB::table('users')->select('id', 'name', 'email', 'tipo_user', 'alta_por', 'created_at')->where('id', $id)->get();
            return response()->json([
                'id' => $consulta[0]->id,
                'name' => $consulta[0]->name,
                'email' => $consulta[0]->email,
                'tipo_user' => $consulta[0]->tipo_user
            ]);
        } else {

            return DB::table('users')->select('id', 'name', 'email', 'tipo_user', 'alta_por', 'created_at')->where([['acceso', '!=', '1'], ['id', $id]])->get();
        }
    }
    public function InsertarNuevoUser(Request $request)
    {
        $name = $request->name;
        $email    = $request->email;
        $pw = substr(md5(microtime()), 1, 12);
        $password = Hash::make($pw);
        $tipo_user = $request->tipo_user;
        $alta_por = auth()->user()->name;
        $tipo =  auth()->user()->tipo_user;

        if ($tipo == 1) { //Si es usuario admin puede agregar nuevos
            try {
                $registro = DB::table('users')->insert([
                    ['name' => $name, 'email' => $email, 'password' => $password, 'tipo_user' => $tipo_user, 'alta_por' => $alta_por, 'created_at' => now()]
                ]);
            } catch (\Exception $exception) {
                return response()->json([
                    'estado' => '500',
                    'mensaje' => 'Correo registrado anteriormente'
                ]);
            }


            if ($registro) {
                return response()->json([
                    'estado' => '200',
                    'password' => $pw,
                    'mensaje' => 'Registro agregado correctamente'
                ]);
            } else {
                return response()->json([
                    'estado' => '500',
                    'mensaje' => 'No se pudo persistir el registro'
                ]);
            }
        } else {
            return response()->json([
                'estado' => '500',
                'mensaje' => 'No tiene permisos para agregar usuarios'
            ]);
        }
    }

    public function ActualizarUser(Request $request)
    {
        $id = $request->id;
        $name = $request->name;
        $email    = $request->email;
        $tipo_user = $request->tipo_user;
        $tipo = auth()->user()->tipo_user;
        if ($tipo == 1) { //Si es usuario admin puede agregar nuevos
            try {
                $actualizar = DB::table('users')->select('*')
                    ->where('id', '=', $id)
                    ->update(['name' => $name, 'email' => $email, 'tipo_user' => $tipo_user, 'updated_at' => now()]);
            } catch (\Exception $exception) {
                return response()->json([
                    'estado' => '500',
                    'mensaje' => 'Intente con diferentes parametros'
                ]);
            }

            if ($actualizar) {
                return response()->json([
                    'estado' => '200',
                    'mensaje' => 'Registro actualizado correctamente'
                ]);
            } else {
                return response()->json([
                    'estado' => '500',
                    'mensaje' => 'No se pudo persistir el registro'
                ]);
            }
        } else {
            return response()->json([
                'estado' => '500',
                'mensaje' => 'No tiene permisos para agregar usuarios'
            ]);
        }
    }
    public function ActualizarPW($id)
    {
        $pw = substr(md5(microtime()), 1, 12);
        $password = Hash::make($pw);
        $tipo = auth()->user()->tipo_user;
        if ($tipo == 1) { //Si es usuario admin puede agregar nuevos
            try {
                $actualizar = DB::table('users')->select('*')
                    ->where('id', '=', $id)
                    ->update(['password' => $password]);
            } catch (\Exception $exception) {
                return response()->json([
                    'estado' => '500',
                    'mensaje' => 'Intente con diferentes parametros'
                ]);
            }

            if ($actualizar) {
                return response()->json([
                    'estado' => '200',
                    'password' => $pw,
                    'mensaje' => 'Contrasena actualizada correctamente'
                ]);
            } else {
                return response()->json([
                    'estado' => '500',
                    'mensaje' => 'No se pudo persistir el registro'
                ]);
            }
        } else {
            return response()->json([
                'estado' => '500',
                'mensaje' => 'No tiene permisos para agregar usuarios'
            ]);
        }
    }
}
