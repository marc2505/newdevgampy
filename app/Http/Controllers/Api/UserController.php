<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserMarcRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return UserResource::collection(
            // User::query()->orderBy('id','desc')->paginate(10)
            User::query()->orderBy('id','asc')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        // var_dump($request);
        // return response($request->hasFile('image'),200);
        $data = $request->validated();
        $lastId = User::max('id');
        $newId = $lastId + 1;
        $data['password'] = bcrypt($data['password']);
        $data['phone_number'] = $request['phone_number'];
        $data['address'] = $request['address'];
        $data['biographie'] = $request['biographie'];
        if ($request->hasFile('image')) {
            $img_name = md5(rand(1000,10000));
            $ext = strtolower($request->file('image')->getClientOriginalExtension());
            $img_fullname = $img_name.'.'.$ext;
            $upload_path = 'users/'.$newId.'/';
            $img_url = $upload_path.$img_fullname;
            $request->file('image')->move($upload_path, $img_fullname);
            $data['image'] = $img_url;
        } else {
            $data['image'] = null;
        }
        $user = User::create($data);
        return response(new UserResource($user), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        // dd($user);
        // dd($request->all());
        $data = $request->validated();
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);    
        }
        // $data['phone_number'] = $request['phone_number'];
        // $data['address'] = $request['address'];
        // $data['biographie'] = $request['biographie'];
        // $data['image'] = $request['image'];
        // $data['role'] = $request['role'];
        // dd($data);
        $user->update($data);
        return new UserResource($user);
    }

    public function updateCustom(UpdateUserMarcRequest $request, User $user) {
        // var_dump($request->all());
        // var_dump($user);
        // dd($user->only('id', 'name', 'pseudo', 'email', 'phone_number', 'address', 'image', 'biographie', 'role'));
        // dd($user->image);
        // dd($user);
        // dd($request);
        // dd($request->all());

        $request->validated();
        
        $user->name = strtoupper($request->nom) . ' ' . ucfirst(strtolower($request->prenom));
        $user->pseudo = $request->pseudo;
        $user->email = $request->email;
        $user->address = $request->address;
        $user->biographie = $request->biographie;
        $user->role = $request->role;
        $user->updated_at = $request->updated_at;
        $user->phone_number = $request->phone_number;

        // if ($user->image != $request->image) {

        // }

        if ($file = $request->file('image')) {
            if ($user->image != '') {
                $filee = public_path($user->image);
                if (file_exists($filee)) {
                    unlink($filee);
                }
            }
            $img_name = md5(rand(1000,10000));
            $ext = strtolower($file->getClientOriginalExtension());
            $img_full_name = $img_name.'.'.$ext;
            $upload_path = 'users/'.$user->id.'/';
            $img_url = $upload_path.$img_full_name;
            $file->move($upload_path,$img_full_name);
            // dd($img_url);
            $user->image = $img_url;
        }

        if ($request->password != '') {
            $user->password = bcrypt($request->password);
        }

        $user->save();

        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response('', 204);
    }

    public function getNameById($id) {
        $user = User::find($id);
        if ($user) {
            return response([
                $user->name
            ]);
        } else {
            return response([
                'Utilisateur '+$id+' non trouvé ...'
            ], 404);
        }
    }

    public function getPseudoById($id) {
        $user = User::find($id);
        if ($user) {
            return response([
                $user->pseudo
            ]);
        } else {
            return response([
                'Utilisateur '+$id+' non trouvé ...'
            ], 404);
        }
    }
}
