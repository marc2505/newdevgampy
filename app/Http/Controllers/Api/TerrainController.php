<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Terrain;
use App\Http\Requests\StoreTerrainRequest;
use App\Http\Requests\UpdateTerrainRequest;
use App\Http\Requests\UpdateTerrainStep1;
use App\Http\Requests\UpdateTerrainStep2;
use App\Http\Requests\UpdateTerrainStep3;
use App\Http\Requests\UpdateTerrainStep4;
use App\Http\Requests\UpdateTerrainStep5;
use App\Http\Requests\UpdateTerrainStep6;
use App\Http\Resources\TerrainResource;
use App\Models\Prestation;
use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;
use DateTime;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Stripe\Stripe;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class TerrainController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return TerrainResource::collection(
            // Terrain::query()->orderBy('id','desc')->paginate()
            Terrain::query()->orderBy('id', 'desc')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTerrainRequest $request)
    {
        // dd($request);
        $data = $request->validated();
        unset($data['images_principales']);
        unset($data['images_cadres']);
        unset($data['images_autres']);
        // dd($data);
        $terrain = Terrain::create($data);
        return response(new TerrainResource($terrain), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Terrain $terrain)
    {
        return new TerrainResource($terrain);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTerrainRequest $request, Terrain $terrain)
    {
        // (CREER UNE METHODE updateCustom(UpdateTerrainRequest $request, Terrain $terrain) 
        // car la methode put ne fonctionne pas ...)
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Terrain $terrain)
    {
        $terrain->delete();

        return response('', 204);
    }

    public function updateCustomStep1(UpdateTerrainStep1 $request, Terrain $terrain)
    {
        $data = $request->validated();
        unset($data['images_principales']);
        unset($data['images_cadres']);
        unset($data['images_autres']);
        $terrain->update($data);
        return new TerrainResource($terrain);
    }

    public function updateCustomStep2(UpdateTerrainStep2 $request, Terrain $terrain)
    {
        $data = $request->validated();
        unset($data['images_principales']);
        unset($data['images_cadres']);
        unset($data['images_autres']);
        $terrain->update($data);
        return new TerrainResource($terrain);
    }

    public function updateCustomStep3(UpdateTerrainStep3 $request, Terrain $terrain)
    {
        $request->validated();

        $images = [];
        if ($filesPrincipales = $request->file('images_principales')) {
            $filess = $terrain->images_principales;
            if ($filess != '') {
                $list = explode('|', $filess);
                foreach ($list as $file) {
                    $filePath = public_path($file);
                    if (file_exists($filePath)) {
                        unlink($filePath);
                    }
                }
            }
            foreach ($filesPrincipales as $file) {
                $img_name = md5(rand(1000, 10000));
                $ext = strtolower($file->getClientOriginalExtension());
                $img_full_name = $img_name . '.' . $ext;
                $upload_path = 'Terrains/' . $terrain->id . '/ImagesPrincipales/';
                $img_url = $upload_path . $img_full_name;
                $file->move($upload_path, $img_full_name);
                $images[] = $img_url;
            }
            $img_str = implode('|', $images);
            $terrain->images_principales = $img_str;
        }
        $images = [];
        if ($filesCadres = $request->file('images_cadres')) {
            $filess = $terrain->images_cadres;
            if ($filess != '') {
                $list = explode('|', $filess);
                foreach ($list as $file) {
                    $filePath = public_path($file);
                    if (file_exists($filePath)) {
                        unlink($filePath);
                    }
                }
            }
            foreach ($filesCadres as $file) {
                $img_name = md5(rand(1000, 10000));
                $ext = strtolower($file->getClientOriginalExtension());
                $img_full_name = $img_name . '.' . $ext;
                $upload_path = 'Terrains/' . $terrain->id . '/ImagesCadres/';
                $img_url = $upload_path . $img_full_name;
                $file->move($upload_path, $img_full_name);
                $images[] = $img_url;
            }
            $img_str = implode('|', $images);
            $terrain->images_cadres = $img_str;
        }
        $images = [];
        if ($filesAutres = $request->file('images_autres')) {
            $filess = $terrain->images_autres;
            if ($filess != '') {
                $list = explode('|', $filess);
                foreach ($list as $file) {
                    $filePath = public_path($file);
                    if (file_exists($filePath)) {
                        unlink($filePath);
                    }
                }
            }
            foreach ($filesAutres as $file) {
                $img_name = md5(rand(1000, 10000));
                $ext = strtolower($file->getClientOriginalExtension());
                $img_full_name = $img_name . '.' . $ext;
                $upload_path = 'Terrains/' . $terrain->id . '/ImagesAutres/';
                $img_url = $upload_path . $img_full_name;
                $file->move($upload_path, $img_full_name);
                $images[] = $img_url;
            }
            $img_str = implode('|', $images);
            $terrain->images_autres = $img_str;
        }
        $terrain->save();
        return new TerrainResource($terrain);
    }

    public function updateCustomStep4(UpdateTerrainStep4 $request, Terrain $terrain)
    {
        $data = $request->validated();
        unset($data['images_principales']);
        unset($data['images_cadres']);
        unset($data['images_autres']);
        $terrain->update($data);
        return new TerrainResource($terrain);
    }
    public function updateCustomStep5(UpdateTerrainStep5 $request, Terrain $terrain)
    {
        $data = $request->validated();
        // dd($data);
        if (isset($data['lstPrestations'])) {
            // dd($data['lstPrestations'][0]['terrain_id']);
            foreach ($data['lstPrestations'] as $presta) {
                // $terrain->prestations()->updateOrCreate(

                // );
                $prestation = Prestation::firstOrCreate(
                    [
                        'terrain_id' => $presta['terrain_id'],
                        'nom' => $presta['nom'],
                        'prix' => $presta['prix'],
                        'description' => $presta['description']
                    ],
                    [
                        'terrain_id' => $presta['terrain_id'],
                        'nom' => $presta['nom'],
                        'prix' => $presta['prix'],
                        'description' => $presta['description']
                    ]
                );
            }
        }
        unset($data['images_principales']);
        unset($data['images_cadres']);
        unset($data['images_autres']);
        $terrain->update($data);
        return new TerrainResource($terrain);
    }
    public function updateCustomStep6(UpdateTerrainStep6 $request, Terrain $terrain)
    {
        $data = $request->validated();
        unset($data['images_principales']);
        unset($data['images_cadres']);
        unset($data['images_autres']);
        $terrain->update($data);
        return new TerrainResource($terrain);
    }

    public function updateCustom(UpdateTerrainRequest $request, Terrain $terrain)
    {
        dd($request);
    }

    public function recherche(Request $request)
    {
        $recherche = $request->query('recherche');
        $dateDebut = $request->query('dateDebut');
        $dateFin = $request->query('dateFin');
        $filtre = json_decode($request->query('filtre'), true);
        $prix = null;
        $environnement = null;
        $equipements = null;
        $prestations = null;

        // dd([
        //     'RECHERCHE => ' . $recherche,
        //     'DATEDEBUT => ' . $dateDebut,
        //     'DATEFIN => ' . $dateFin,
        //     'FILTRE => ' . json_encode($filtre),
        // ]);

        $tousLesTerrains = DB::table('terrains')->get();
        // dd($tousLesTerrains);
        $terrainAAfficher = [];
        $terrainsDispos = [];
        if ($recherche != 'vide') {

            foreach ($tousLesTerrains as $terrain) {
                $adresseSplit = explode(', ', $terrain->adresse);
                if ($recherche == $adresseSplit[2]) {

                    // VERIFIER LES DATES
                    $indispos = explode('|', $terrain->indisponibilites);
                    $terrainDispo = true;
                    $toutelesdates = [];
                    foreach ($indispos as $indispo) {
                        $tabIndispo = explode('->', $indispo);
                        $dateD = DateTime::createFromFormat('d/M/Y', $tabIndispo[0]);
                        $dateF = DateTime::createFromFormat('d/M/Y', $tabIndispo[1]);
                        $dateDebutRecherche = DateTime::createFromFormat('d M Y', $dateDebut);
                        $dateFinRecherche = DateTime::createFromFormat('d M Y', $dateFin);

                        if (($dateDebutRecherche >= $dateD && $dateDebutRecherche <= $dateF) || ($dateFinRecherche >= $dateD && $dateFinRecherche <= $dateF)) {
                            $terrainDispo = false;
                            break;
                        }
                    }
                    if ($terrainDispo) {
                        $terrainsDispos[] = $terrain;
                        $terrainAAjouter = true;
                        if ($filtre != null) {
                            if ($filtre['prix'] != 0) {
                                if ($terrain->prix_nuitee > $filtre['prix']) {
                                    $terrainAAjouter = false;
                                }
                            }
                            if ($terrainAAjouter && $filtre['environnement'] != '') {
                                $terrainAAjouter = false;
                                // dd($filtre['environnement']);
                                switch ($filtre['environnement']) {
                                    case 'Bord de mer':
                                        if (strpos($terrain->environnement, 'Bdm') !== false) {
                                            $terrainAAjouter = true;
                                        }
                                        break;
                                    case 'Montagne':
                                        if (strpos($terrain->environnement, 'Montagne') !== false) {
                                            $terrainAAjouter = true;
                                        }
                                        break;
                                    case 'Campagne':
                                        if (strpos($terrain->environnement, 'Campagne') !== false) {
                                            $terrainAAjouter = true;
                                        }
                                        break;
                                    case 'Forêt':
                                        if (strpos($terrain->environnement, 'Foret') !== false) {
                                            $terrainAAjouter = true;
                                        }
                                        break;
                                    case 'Agglomération':
                                        if (strpos($terrain->environnement, 'Agglo') !== false) {
                                            $terrainAAjouter = true;
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            } elseif ($terrainAAjouter && $filtre['environnement'] == '') {
                                $terrainAAjouter = true;
                            }
                            if ($terrainAAjouter) {
                                $terrainAAfficher[] = $terrain;
                            }
                        }
                    }
                }
            }
            // dd($terrainAAfficher);
        } else {
            // dd('RECHERCHE VIDE ...');
            foreach ($tousLesTerrains as $terrain) {

                // VERIFIER LES DATES
                $indispos = explode('|', $terrain->indisponibilites);
                $terrainDispo = true;
                $toutelesdates = [];
                foreach ($indispos as $indispo) {
                    $tabIndispo = explode('->', $indispo);
                    $dateD = DateTime::createFromFormat('d/M/Y', $tabIndispo[0]);
                    $dateF = DateTime::createFromFormat('d/M/Y', $tabIndispo[1]);
                    $dateDebutRecherche = DateTime::createFromFormat('d M Y', $dateDebut);
                    $dateFinRecherche = DateTime::createFromFormat('d M Y', $dateFin);

                    if (($dateDebutRecherche >= $dateD && $dateDebutRecherche <= $dateF) || ($dateFinRecherche >= $dateD && $dateFinRecherche <= $dateF)) {
                        $terrainDispo = false;
                        break;
                    }
                }
                if ($terrainDispo) {
                    $terrainsDispos[] = $terrain;
                }
                // }
            }
            return response([
                'message' => 'Liste des terrains dispo du ' . $dateDebut . ' jusqu\'à ' . $dateFin,
                'tousLesTerrains' => $terrainsDispos,
                'touusLesTerrains' => $tousLesTerrains
            ]);
        }
        return response([
            'message' => 'Liste des terrains dispo du ' . $dateDebut . ' jusqu\'à ' . $dateFin,
            'tousLesTerrains' => $terrainAAfficher
        ]);

        // if ($dateDebut != null && $dateFin != null) {
        // $dateDebutTimestamp = strtotime(DateTime::createFromFormat('d M Y',$dateDebut)->format('Y-m-d'));
        // $dateFinTimestamp = strtotime(DateTime::createFromFormat('d M Y',$dateFin)->format('Y-m-d'));
        // dd([$dateDebut, $dateFin]);

        // } else {
        //     dd('DATE DEBUT ET DATE FIN NULLES ...');
        // }


        // if ($filtre['prix'] != 0) {
        //     $prix = $filtre['prix'];
        //     $terainsPrix = Terrain::where('prix_nuitee', '<=', $prix)->get();
        //     if (count($terainsPrix) > 0) {
        //         dd($terainsPrix);
        //     } else {
        //         dd('PAS DE TERRAINS AVEC CE PRIX ...');
        //     }
        // }
        // if (count($filtre['equipements']) > 0) {
        //     // dd($filtre['equipements']);
        //     $equipements = $filtre['equipements'];
        // }
        // if ($filtre['environnement'] != '') {
        //     $environnement = $filtre['environnement'];
        //     switch($environnement) {
        //         case 'Bord de mer':
        //             $terrainsEnvironnement = Terrain::where('environnement', 'LIKE', '%Bdm')->get();
        //             break;
        //         case 'Montagne':
        //             $terrainsEnvironnement = Terrain::where('environnement', 'LIKE', '%Montagne')->get();
        //             break;
        //         case 'Campagne':
        //             $terrainsEnvironnement = Terrain::where('environnement', 'LIKE', '%Campagne')->get();
        //             break;
        //         case 'Forêt':
        //             $terrainsEnvironnement = Terrain::where('environnement', 'LIKE', '%Foret')->get();
        //             break;
        //         case 'Agglomération':
        //             $terrainsEnvironnement = Terrain::where('environnement', 'LIKE', '%Agglo')->get();
        //             break;
        //         default:
        //             $terrainsEnvironnement = Terrain::all();
        //             break;
        //     }
        //     if (count($terrainsEnvironnement) > 0) {
        //         dd($terrainsEnvironnement);
        //     } else {
        //         dd('PAS DE TERRAINS AVEC CET ENVIRONNEMENT ...');
        //     }
        // }


        // DEBUT DE LA PARTIE RECHERCHE LIEU

        // RECHERCHE != NULL && DATEDEBUT == NULL && DATEFIN == NULL && FILTRE == NULL
        // UNIQUEMENT LE LIEU
        // if ($recherche != 'vide' && $dateDebut == 'null' && $dateFin == 'null' && $filtre == 'null') {
        //     $terrains = DB::table('terrains')->where('adresse', 'like', '%'.$recherche.'%')->get();
        //     foreach ($tousLesTerrains as $terrain) {
        //         $adresseSplit = explode(', ', $terrain->adresse);
        //         if ($recherche == $adresseSplit[2]) {
        //             $terrainAAfficher[] = $terrain;
        //         }
        //     }
        //     if (count($terrainAAfficher) > 0) {
        //         return response([
        //             'message' => 'Liste des terrains pour le lieu '.$recherche,
        //             'terrains' => $terrainAAfficher
        //         ]);   
        //     } else {
        //         return response([
        //             'message' => 'Pas de terrains pour le lieu '.$recherche,
        //             'tousLesTerrains' => $tousLesTerrains
        //         ]);
        //     }
        //     // RECHERCHE != NULL && DATEDEBUT != NULL && DATEFIN != NULL && FILTRE == NULL
        //     // TOUT SAUF FILTRE
        // } else if ($recherche != 'vide' && $dateDebut != 'null' && $dateFin != 'null' && $filtre == 'null') {
        //     foreach ($tousLesTerrains as $terrain) {
        //         $adresseSplit = explode(', ', $terrain->adresse);
        //         if ($recherche == $adresseSplit[2]) {
        //             $terrainAAfficher[] = $terrain;
        //         }
        //     }
        //     $dateDebutTimestamp = strtotime(DateTime::createFromFormat('d M Y',$dateDebut)->format('Y-m-d'));
        //     $dateFinTimestamp = strtotime(DateTime::createFromFormat('d M Y',$dateFin)->format('Y-m-d'));
        //     $terrainsDispos = [];
        //     foreach ($terrainAAfficher as $terrain) {
        //         $indispos = explode('|', $terrain->indisponibilites);
        //         $terrainDispo = true;
        //         foreach ($indispos as $indispo) {
        //             $tabIndispo = explode('->', $indispo);
        //             $dateDTimestamp = strtotime(DateTime::createFromFormat('d/M/Y', $tabIndispo[0])->format('Y-m-d'));
        //             $dateFTimestamp = strtotime(DateTime::createFromFormat('d/M/Y', $tabIndispo[1])->format('Y-m-d'));
        //             if (($dateDebutTimestamp >= $dateDTimestamp && $dateDebutTimestamp <= $dateFTimestamp) || ($dateFinTimestamp >= $dateDTimestamp && $dateFinTimestamp <= $dateFTimestamp)) {
        //                 $terrainDispo = false;
        //                 break;
        //             }
        //         }
        //         if ($terrainDispo) {
        //             $terrainsDispos[] = $terrain;
        //         }
        //     }
        //     if (count($terrainsDispos) > 0) {
        //         return response([
        //             'message' => 'Liste des terrains dispo du '.$dateDebut.' au '.$dateFin.' pour le lieu '.$recherche,
        //             'terrains' => $terrainsDispos,
        //         ]);
        //     } else {
        //         return response([
        //             'message' => 'Pas de terrains dispo du '.$dateDebut.' au '.$dateFin.' pour le lieu '.$recherche,
        //             'tousLesTerrains' => $tousLesTerrains
        //         ]);
        //     }
        //     // RECHERCHE == NULL && DATEDEBUT == NULL && DATEFIN == NULL && FILTRE == NULL
        //     // AUNCUN CHAMP
        // } else if ($recherche == 'vide' && $dateDebut == 'null' && $dateFin == 'null' && $filtre == 'null') {
        //     return response([
        //         'message' => 'Liste de TOUS les terrains',
        //         'tousLesTerrains' => $tousLesTerrains
        //     ]);   
        // }
        // FIN DE LA PARTIE RECHERCHE LIEU

        // DEBUT DE LA PARTIE RECHERCHE DISPONIBILITES
        // else if ($recherche == 'vide' && $dateDebut != 'null' && $dateFin != 'null' && $filtre == 'null') {
        //     $dateDebutTimestamp = strtotime(DateTime::createFromFormat('d M Y',$dateDebut)->format('Y-m-d'));
        //     $dateFinTimestamp = strtotime(DateTime::createFromFormat('d M Y',$dateFin)->format('Y-m-d'));
        //     $terrainsDispos = [];
        //     // Tourner dans la liste de $tousLesTerrains et 
        //     // retourner tous les terrains dont les indisponibilités
        //     // depuis $dateDebut jusqu'à $dateFin ne se trouvent pas dans 
        //     // leur attribut 'indisponibilites'
        //     foreach ($tousLesTerrains as $terrain) {
        //         $indispos = explode('|', $terrain->indisponibilites);
        //         $terrainDispo = true;

        //         foreach ($indispos as $indispo) {
        //             $tabIndispo = explode('->', $indispo);
        //             $dateDTimestamp = strtotime(DateTime::createFromFormat('d/M/Y', $tabIndispo[0])->format('Y-m-d'));
        //             $dateFTimestamp = strtotime(DateTime::createFromFormat('d/M/Y', $tabIndispo[1])->format('Y-m-d'));
        //             if (($dateDebutTimestamp >= $dateDTimestamp && $dateDebutTimestamp <= $dateFTimestamp) || ($dateFinTimestamp >= $dateDTimestamp && $dateFinTimestamp <= $dateFTimestamp)) {
        //                 $terrainDispo = false;
        //                 break;
        //             }
        //         }

        //         if ($terrainDispo) {
        //             $terrainsDispos[] = $terrain;
        //         }
        //     }
        //     if (count($terrainsDispos) > 0) {
        //         return response([
        //             'message' => 'Liste des terrains dispo du '.$dateDebut.' jusqu\'à '.$dateFin,
        //             'terrains' => $terrainsDispos,
        //         ]);
        //     } else {
        //         return response([
        //             'message' => 'Pas de terrains dispo du '.$dateDebut.' jusqu\'à '.$dateFin,
        //             'tousLesTerrains' => $tousLesTerrains
        //         ]);
        //     }
        // }

        // FIN DE LA PARTIE RECHERCHE DISPONIBILITES
    }

    public function getTerrain($terrainId)
    {
        $terrain = Terrain::findOrFail($terrainId);
        // dd($terrain);
        return new TerrainResource($terrain);
    }

    public function getTerrainNomById($terrainId)
    {
        $terrain = Terrain::find($terrainId);
        return response($terrain->nom);
    }

    public function getTerrainsByIdUser($idUser)
    {
        $terrains = Terrain::where('user_id', $idUser)->get();
        if ($terrains->count() > 0) {
            return response([
                'message' => 'Liste des terrains de l\'utilisateur n°' . $idUser,
                'terrains' => $terrains,
            ]);
        } else {
            return response([
                'message' => 'L\'utilisateur n°' . $idUser . ' n\'a pas de terrain ...',
                'terrains' => $terrains,
            ]);
        }
    }

    public function checkout(Request $request)
    {
        $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET_KEY'));
        $item = $request->all();
        $status = 'unpaid';
        $totalPrice = 0;
        $lineItems = [
            [
                'price_data' => [
                    'currency' => $item['currency'],
                    'product_data' => [
                        'name' => $item['name'] . ', pour ' . $item['duree'] . ' nuit(s).',
                        'description' => $item['desc_generale']
                    ],
                    'unit_amount' => $item['unit_amount'] * 100,
                ],
                'quantity' => $item['quantity'],
            ],
        ];
        $checkout_session = $stripe->checkout->sessions->create([
            'line_items' => $lineItems,
            'mode' => 'payment',
            // 'success_url' => route('success', [], true)."?session_id={CHECKOUT_SESSION_ID}",
            // 'cancel_url' => route('cancel', [], true),
            // 'success_url' => route('success', ['user' => $user->id, 'token' => $token], true)."?session_id={CHECKOUT_SESSION_ID}",
            // 'cancel_url' => route('cancel', ['user' => $user->id, 'token' => $token], true),
            'success_url' => 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => 'http://localhost:3000/cancel',
            // 'success_url' => 'https://gampy.ch/success?session_id={CHECKOUT_SESSION_ID}',
            // 'cancel_url' => 'https://gampy.ch/cancel',
        ]);

        $reservation = new Reservation();
        $reservation->statut = 'unpaid';
        $reservation->prix = $item['unit_amount'];
        $reservation->terrain_id = $item['terrainId'];
        $reservation->date_debut = $item['date_debut'];
        $reservation->date_fin = $item['date_fin'];
        $sessionId = $checkout_session->id;
        $reservation->session_id = $sessionId;
        $reservation->save();

        return response([
            'id' => $sessionId
        ]);

        // header('Location: '.$stripe->url);
        // return redirect($checkout_session->url);
    }

    public function success(Request $request)
    {
        // $userId = $request->get('user');
        // Auth::loginUsingId($userId);
        // dd($request);
        $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET_KEY'));
        try {
            $session = $stripe->checkout->sessions->retrieve($request->get('session_id'));
            if (!$session) {
                throw new NotFoundHttpException();
            }
            // $customer = $stripe->customers->retrieve($session->customer);
            $reservation = Reservation::where('session_id', $session->id)->first();
            // dd($reservation);  
            // redirect('/');
            return response([
                'id' => 'Retour depuis la fonction success de TerrainController',
                // 'reservation' => $reservation
                // 'user' => $customer
            ]);
        } catch (Error $e) {
            // echo $e->getMessage();
            throw new NotFoundHttpException();
        }
    }

    public function cancelPaiement(Request $request)
    {
        $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET_KEY'));
        try {
            $session = $stripe->checkout->sessions->retrieve($request->get('session_id'));
            if (!$session) {
                throw new NotFoundHttpException();
            }
            // $customer = $stripe->customers->retrieve($session->customer);
            $reservation = Reservation::where('session_id', $session->id)->first();
            dd($reservation);
            // redirect('/');
            return response([
                'id' => 'Retour depuis la fonction success de TerrainController',
                // 'user' => $customer
            ]);
        } catch (Error $e) {
            // echo $e->getMessage();
            throw new NotFoundHttpException();
        }
    }

    public function cancel(Request $request)
    {
        // $userId = $request->get('user');
        // Auth::loginUsingId($userId);
        $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET_KEY'));
        // return response([
        //     'id' => 'Retour depuis la fonction cancel de TerrainController'
        // ]);
        try {
            $session = $stripe->checkout->sessions->retrieve($request->get('session_id'));
            if (!$session) {
                throw new NotFoundHttpException();
            }
            // $customer = $stripe->customers->retrieve($session->customer);
            $reservation = Reservation::where('session_id', $session->id)->first();
            dd($reservation);
            // redirect('/');
            return response([
                'id' => 'Retour depuis la fonction success de TerrainController',
                // 'user' => $customer
            ]);
        } catch (Error $e) {
            // echo $e->getMessage();
            throw new NotFoundHttpException();
        }
    }

    public function validationPaiement(Request $request)
    {
        $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET_KEY'));
        try {
            $session = $stripe->checkout->sessions->retrieve($request->get('session_id'));
            // dd($session->customer_details);
            $emailGampeur = $session->customer_details->email;
            $nomGampeur = $session->customer_details->name;
            if (!$session) {
                throw new NotFoundHttpException();
            }
            // $customer = $stripe->customers->retrieve($session->customer);
            $reservation = Reservation::where('session_id', $session->id)->first();
            if (!$reservation) {
                throw new NotFoundHttpException();
            }
            if ($reservation->statut == 'unpaid') {
                $reservation->statut = 'paid';
                $reservation->save();
            }
            // dd($reservation);  
            $terrainId = $reservation->terrain_id;
            $terrain = Terrain::where('id', $terrainId)->first();
            $hoteId = $terrain->user_id;
            $hote = User::where('id', $hoteId)->first();
            return response([
                'id' => 'Retour depuis la fonction success de TerrainController',
                'reservation' => $reservation,
                'nomGampeur' => $nomGampeur,
                'emailGampeur' => $emailGampeur,
                'hote' => $hote
            ]);
        } catch (Error $e) {
            // echo $e->getMessage();
            throw new NotFoundHttpException();
        }
    }

    public function webhook()
    {
        // The library needs to be configured with your account's secret key.
        // Ensure the key is kept out of any version control system you might be using.
        $stripe = new \Stripe\StripeClient('sk_test_...');

        // This is your Stripe CLI webhook secret for testing your endpoint locally.
        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET_KEY');

        $payload = @file_get_contents('php://input');
        $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
        $event = null;

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sig_header,
                $endpoint_secret
            );
        } catch (\UnexpectedValueException $e) {
            // Invalid payload
            // http_response_code(400);
            // exit();
            return response('', 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            // Invalid signature
            // http_response_code(400);
            // exit();
            return response('', 400);
        }

        // Handle the event
        switch ($event->type) {
                // case 'payment_intent.succeeded':
                //     $paymentIntent = $event->data->object;
            case 'checkout.session.completed':
                $session = $event->data->object;
                $sessionId = $session->id;
                $reservation = Reservation::where('session_id', $session->id)->first();
                if ($reservation && $reservation->statut == 'unpaid') {
                    $reservation->statut = 'paid';
                    $reservation->save();
                    // ENVOYER UN EMAIL DE CONFIRMATION PAR EXEMPLE !

                }
                // ... handle other event types
            default:
                echo 'Received unknown event type ' . $event->type;
        }

        // http_response_code(200);
        return response('');
    }

    public function getPrestations($terrain)
    {
        // dd($terrain);
        $t = Terrain::with('prestations')->find($terrain);
        $prestations = $t->prestations;

        return response([
            'prestations' => $prestations
        ]);
    }
}
