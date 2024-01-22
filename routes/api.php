<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EquipementController;
use App\Http\Controllers\Api\MailController;
use App\Http\Controllers\Api\PrestationController;
use App\Http\Controllers\Api\TerrainController;
use App\Http\Controllers\Api\UserController;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// ROUTE POUR LES VISITEURS DE LA PLATEFORME
// =========================================



Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/loginAdmin', [AuthController::class, 'loginAdmin']);
// GET -> EQUIPEMENTS
Route::get('/equipements', [EquipementController::class, 'index']);

// GET -> GETEQUIPEMENTNOMBYID/{EQUIPID}
Route::get('/getEquipementNomById/{equipId}', [EquipementController::class, 'getEquipementNomById']);

// GET -> USER/{ID}/NAME
Route::get('/user/{id}/name', [UserController::class, 'getNameById']);
// GET -> USER/{ID}/PSEUDO
Route::get('/user/{id}/pseudo', [UserController::class, 'getPseudoById']);

// GET -> TERRAINS
Route::get('/terrains', [TerrainController::class, 'index']);
// GET -> TERRAINS/DISPLAY/{TERRAINID}
Route::get('/terrains/display/{terrainId}', [TerrainController::class, 'getTerrain']);
// GET -> TERRAINS/RECHERCHE (PARAMS : RECHERCHE, DATEDEBUT, DATEFIN, FILTRE)
Route::get('/terrains/recherche', [TerrainController::class, 'recherche']);


// ROUTE POUR LES UTILISATEURS AUTHENTIFIES DE LA PLATEFORME
// =========================================================
Route::middleware('auth:sanctum')->group(function() {
    // ROUTE POUR OBTENIR UN UTILISATEUR
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    // ROUTE POUR LES ACTIONS SUR LA TABLE USERS
    Route::apiResource('/users', UserController::class);
    // ROUTE POUR MODIFIER UN UTILISATEUR (POST CAR PROBLEM AVEC PUT)
    Route::post('/users/{user}/update', [UserController::class, 'updateCustom']);

    // ROUTE POUR LES ACTIONS SUR LA TABLE TERRAINS
    // Route::apiResource('/terrains', TerrainController::class);

    // ROUTE POUR CHERCHER LES EQUIPEMENTS
    // Route::get('/equipements', [EquipementController::class, 'index']);

    // POST -> STORE -> /TERRAINS
    Route::post('/terrains', [TerrainController::class, 'store']);
    // GET -> TERRAINS/{TERRAIN}
    Route::get('/terrains/{terrain}', [TerrainController::class, 'show']);
    // POST -> UPDATECUSTOMSTEP1 -> /TERRAINS/{TERRAIN}
    Route::post('/terrains/step1/{terrain}', [TerrainController::class, 'updateCustomStep1']);
    // POST -> UPDATECUSTOMSTEP2 -> /TERRAINS/{TERRAIN}
    Route::post('/terrains/step2/{terrain}', [TerrainController::class, 'updateCustomStep2']);
    // POST -> UPDATECUSTOMSTEP3 -> /TERRAINS/{TERRAIN}
    Route::post('/terrains/step3/{terrain}', [TerrainController::class, 'updateCustomStep3']);
    // POST -> UPDATECUSTOMSTEP4 -> /TERRAINS/{TERRAIN}
    Route::post('/terrains/step4/{terrain}', [TerrainController::class, 'updateCustomStep4']);
    // POST -> UPDATECUSTOMSTEP5 -> /TERRAINS/{TERRAIN}
    Route::post('/terrains/step5/{terrain}', [TerrainController::class, 'updateCustomStep5']);
    // POST -> UPDATECUSTOMSTEP6 -> /TERRAINS/{TERRAIN}
    Route::post('/terrains/step6/{terrain}', [TerrainController::class, 'updateCustomStep6']);

    // GET -> GETTERRAINBYIDUSER/{IDUSER}
    Route::get('/getTerrainsByIdUser/{idUser}', [TerrainController::class, 'getTerrainsByIdUser']);

    // POST -> CHECKOUT
    Route::post('/checkout', [TerrainController::class, 'checkout'])->name('checkout');
    // GET -> SUCCESS
    Route::get('/success', [TerrainController::class, 'success'])->name('success');
    // GET -> CANCEL
    Route::get('/cancel', [TerrainController::class, 'cancel'])->name('cancel');
    // POST -> VALIDATE_PAIEMENT
    Route::post('/validation_paiement', [TerrainController::class, 'validationPaiement'])->name('validation_paiement');
    // POST -> CANCEL_PAIEMENT
    Route::post('/cancel_paiement', [TerrainController::class, 'cancelPaiement'])->name('cancel_paiement');
    // // POST -> WEBHOOK
    // Route::post('/webhook', [TerrainController::class, 'webhook'])->name('webhook');

    // ROUTE POUR LA DECONNEXION
    Route::post('/logout', [AuthController::class, 'logout']);
});


/*
ADMINMIDDLEWARE
===============
// CHECK AUTHENTIFICATION
if (Auth::check()) {
    // CHECK ADMIN ROLE
    if (Auth::user()->role == 'admin') {
        return $next($request);
    } else {
        return response([
            'redirect' => 'http://localhost:3000', 
            'message' => 'You need to be admin before accessing ...'
        ], 403);
    }
} 
*/
Route::prefix('admin')->middleware(['auth:sanctum', 'isAdmin'])->group(function () {
    // APIRESOURCE -> EQUIPEMENTS
    Route::apiResource('/equipements', EquipementController::class);
    // POST -> UPDATECUSTOM -> /EQUIPEMENTS/{EQUIPEMENT} 
    Route::post('/equipements/{equipement}', [EquipementController::class, 'updateCustom']);
    // APIRESOURCE -> PRESTATIONS
    Route::apiResource('/prestations', PrestationController::class);
    // POST -> UPDATECUSTOM -> /PRESTATIONS/{PRESTATION}
    Route::post('/prestations/{prestation}', [PrestationController::class, 'updateCustom']);
    // APIRESOURCE -> TERRAINS
    Route::apiResource('/terrains', TerrainController::class);
    // GET -> /GETTERRAINNOMBYID/{TERRAINID}
    Route::get('/getTerrainNomById/{terrainId}', [TerrainController::class, 'getTerrainNomById']);
    // GET -> /TERRAINS/{TERRAIN}/GETPRESTATIONS
    Route::get('/terrains/{terrain}/getPrestations', [TerrainController::class, 'getPrestations']);
    // POST -> UPDATECUSTOM -> /TERRAINS/{TERRAIN}
    Route::post('/terrains/{terrain}', [TerrainController::class, 'updateCustom']);
    // POST -> UPDATECUSTOMSTEP1 -> /TERRAINS/{TERRAIN}
    Route::post('/terrains/step1/{terrain}', [TerrainController::class, 'updateCustomStep1']);
    // POST -> UPDATECUSTOMSTEP2 -> /TERRAINS/{TERRAIN}
    Route::post('/terrains/step2/{terrain}', [TerrainController::class, 'updateCustomStep2']);
    // POST -> UPDATECUSTOMSTEP3 -> /TERRAINS/{TERRAIN}
    Route::post('/terrains/step3/{terrain}', [TerrainController::class, 'updateCustomStep3']);
    // POST -> UPDATECUSTOMSTEP4 -> /TERRAINS/{TERRAIN}
    Route::post('/terrains/step4/{terrain}', [TerrainController::class, 'updateCustomStep4']);
    // POST -> UPDATECUSTOMSTEP5 -> /TERRAINS/{TERRAIN}
    Route::post('/terrains/step5/{terrain}', [TerrainController::class, 'updateCustomStep5']);
    // POST -> UPDATECUSTOMSTEP6 -> /TERRAINS/{TERRAIN}
    Route::post('/terrains/step6/{terrain}', [TerrainController::class, 'updateCustomStep6']);

    // GET -> /RESERVATIONS
    Route::get('/reservations', function() {
        $reservations = DB::table('reservations')->get();
        return response($reservations);
    });
});

Route::post('/sendMail', [MailController::class, 'sendMail']);

Route::post('/chat', [AuthController::class, 'chat']);

// POST -> WEBHOOK
Route::post('/webhook', [TerrainController::class, 'webhook'])->name('webhook');
