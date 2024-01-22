<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipement;
use App\Http\Requests\StoreEquipementRequest;
use App\Http\Requests\UpdateEquipementRequest;
use App\Http\Resources\EquipementResource;

class EquipementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return EquipementResource::collection(
            // Equipement::query()->orderBy('id', 'desc')->paginate(10)
            Equipement::query()->orderBy('id', 'desc')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEquipementRequest $request)
    {
        // dd($request);
        $equipement = new Equipement();
        // Equipement::query()->truncate();
        // die();
        $lastId = Equipement::max('id');
        $equipement->id = $lastId + 1;
        $equipement->nom = $request->nom;
        $images = [];
        if ($files = $request->file('images')) {
            foreach ($files as $file) {
                $img_name = md5(rand(1000,10000));
                $ext = strtolower($file->getClientOriginalExtension());
                $img_full_name = $img_name.'.'.$ext;
                $upload_path = 'Equipements/'.($lastId+1).'/';
                $img_url = $upload_path.$img_full_name;
                $file->move($upload_path, $img_full_name);
                $images[] = $img_url;
            }
            $img_str = implode('|', $images);
            $equipement->images = $img_str;
        }
        // $equipement->created_at = $request->created_at;
        $equipement->save();

        return response([
            'message' => 'Equipement créé avec succès',
            'equipement' => $equipement
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Equipement $equipement)
    {
        return new EquipementResource($equipement);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEquipementRequest $request, Equipement $equipement)
    {
        // (CREER UNE METHODE updateCustom(UpdateEquipementRequest $request, Equipement $equipement) 
        // car la methode put ne fonctionne pas ...)
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Equipement $equipement)
    {
        $img_path = public_path('Equipements/'.$equipement->id);
        $files = $equipement->images;
        if ($files != '') {
            $list = explode('|', $files);
            foreach ($list as $file) {
                @unlink($file);
            }
            rmdir($img_path);
        }
        $equipement->delete();
        return response('', 204);
    }

    public function updateCustom(UpdateEquipementRequest $request, Equipement $equipement) {
        $request->validated();

        $equipement->nom = $request->nom;

        $images = [];

        if ($files = $request->file('images')) {
            $filess = $equipement->images;
            if ($filess != '') {
                $list = explode('|', $filess);
                foreach($list as $file) {
                    $filePath = public_path($file);
                    if (file_exists($filePath)) {
                        unlink($filePath);
                    }
                }
            }
            foreach($files as $file) {
                $img_name = md5(rand(1000,10000));
                $ext = strtolower($file->getClientOriginalExtension());
                $img_full_name = $img_name.'.'.$ext;
                $upload_path = 'Equipements/'.$equipement->id.'/';
                $img_url = $upload_path.$img_full_name;
                $file->move($upload_path, $img_full_name);
                $images[] = $img_url;
            }
            $img_str = implode('|', $images);
            $equipement->images = $img_str;
        }

        $equipement->updated_at = $request->updated_at;
        $equipement->save();

        return new EquipementResource($equipement);

    }

    public function getEquipementNomById($equipId) {
        $equip = Equipement::where('id', $equipId)->first();
        return response([
            'equip' => $equip,
            'nom' => $equip->nom
        ], 200);
    }
}
