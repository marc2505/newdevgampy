<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prestation;
use App\Http\Requests\StorePrestationRequest;
use App\Http\Requests\UpdatePrestationRequest;
use App\Http\Resources\PrestationResource;

class PrestationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PrestationResource::collection(
            Prestation::query()->orderBy('id', 'desc')->paginate(10)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePrestationRequest $request)
    {
        $prestation = new Prestation();
        $lastId = Prestation::max('id');
        $newId = $lastId + 1;
        $prestation->id = $newId;
        $prestation->terrain_id = (int)$request->terrain_id;
        $prestation->nom = $request->nom;
        $prestation->description = $request->description;
        $prestation->prix = (float)$request->prix;
        $images = [];
        if ($files = $request->file('images')) {
            foreach ($files as $file) {
                $img_name = md5(rand(1000,10000));
                $ext = strtolower($file->getClientOriginalExtension());
                $img_full_name = $img_name.'.'.$ext;
                $upload_path = 'Prestations/'.($newId).'/';
                $img_url = $upload_path.$img_full_name;
                $file->move($upload_path, $img_full_name);
                $images[] = $img_url;
            }
            $img_str = implode('|', $images);
            $prestation->images = $img_str;
        }
        $prestation->save();

        return response([
            'message' => 'Prestation créé avec succès',
            'prestation' => $prestation
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Prestation $prestation)
    {
        return new PrestationResource($prestation);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePrestationRequest $request, Prestation $prestation)
    {
        // (CREER UNE METHODE updateCustom(UpdatePrestationRequest $request, Prestation $prestation) 
        // car la methode put ne fonctionne pas ...)
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Prestation $prestation)
    {
        $img_path = public_path('Prestations/'.$prestation->id);
        $files = $prestation->images;
        if ($files != '') {
            $list = explode('|', $files);
            foreach ($list as $file) {
                @unlink($file);
            }
            rmdir($img_path);
        }
        $prestation->delete();
        return response('', 204);
    }

    public function updateCustom(UpdatePrestationRequest $request, Prestation $prestation) {
        $request->validated();

        $prestation->nom = $request->nom;
        $prestation->description = $request->description;
        $prestation->prix = $request->prix;
        
        $images = [];

        if ($files = $request->file('images')) {
            $filess = $prestation->images;
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
                $upload_path = 'Prestations/'.$prestation->id.'/';
                $img_url = $upload_path.$img_full_name;
                $file->move($upload_path, $img_full_name);
                $images[] = $img_url;
            }
            $img_str = implode('|', $images);
            $prestation->images = $img_str;
        }

        $prestation->updated_at = $request->updated_at;
        $prestation->save();

        return new PrestationResource($prestation);

    }
}
