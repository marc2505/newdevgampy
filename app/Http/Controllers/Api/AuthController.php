<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginAdminRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    public function signup(SignupRequest $request) {
        $data = $request->validated();
        $name = $data['nom'].' '.$data['prenom'];
        $user = User::create([
            'name'=>$name,
            'pseudo'=>$data['pseudo'],
            'email'=>$data['email'],
            'password'=>$data['password'], 
            'role'=>$data['role'],
        ]);
        $token = $user->createToken('main')->plainTextToken;
        return response([
            'user'=>$user,
            'token'=>$token
        ]);
    }

    public function login(LoginRequest $request) {
        $credentials = $request->validated();
        $nbAdultes = $request->input('nbAdultes');
        $nbAdo = $request->input('nbAdo');
        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'email or password incorrect ...'
            ], 422);
        }
        /**@var User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
        if ($request->from == 'devenirhote') {
            return response()->json([
                'redirect_to' => '/annonce',
                'user' => $user,
                'token' => $token
            ]);
        } else if (strpos($request->from,'terrain') !== false) {
            $terrainId = str_replace('terrain','',$request->from);
            return response()->json([
                'redirect_to' => "/terrain/$terrainId/login",
                'user' => $user,
                'token' => $token,
                'nbAdultes' => $nbAdultes,
                'nbAdo' => $nbAdo,
            ]);
        }
        return response(compact('user', 'token'));
    }

    public function loginAdmin(LoginAdminRequest $request) {
        $credentials = $request->validated();
        $u = User::where('email',$credentials['email'])->get()->first();
        if ($u) {
            $role = $u->role;
            $credentials['role'] = $role;
        }
        if (!Auth::attempt(($credentials))) {
            return response([
                'message' => 'Email ou mot de passe incorrect ...'
            ], 422);
        }
        if (!isset($credentials['role']) || $credentials['role'] != 'admin') {
            return response([
                'message' => 'Vous n\'êtes pas autorisé à vous connecter ici ...'
            ], 404);
        }
        /**@var User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
        $user = $user->only(['id','name','pseudo','email','role']);
        return response(compact('user', 'token'));
    }

    public function logout(Request $request) {
        /**@var User $user */
        $user = $request->user();
        $user->tokens()->where('id',$user->currentAccessToken()->id)->delete();
        return response('', 204);
    }

    public function chat(Request $request) {
        $search = $request->question;
        $response = Http::withOptions(['verify' => false])
        ->withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer '.env('OPEN_API_KEY')
        ])
        ->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'Tu es un assistant spécialisé uniquement dans le camping. Ne réponds qu\'aux questions strictement liées au camping et ignore tout ce qui est hors sujet.'
                ],
                [
                    'role' => 'user',
                    'content' => $search
                ]
            ],
            'temperature' => 0.5,
            'max_tokens' => 250
        ])->json();
        return response()->json($response['choices'][0]['message'],200,array(),JSON_PRETTY_PRINT);
    }
}
