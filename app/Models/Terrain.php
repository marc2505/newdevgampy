<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Terrain extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nom',
        'adresse',
        'prix_nuitee',
        'prix_adulte_supp',
        'prix_ado_supp',
        'prix_taxe_sejour',
        'images_principales',
        'images_cadres',
        'images_autres',
        'surface',
        'capacite_visiteurs',
        'desc_generale',
        'desc_cadre',
        'desc_equipement',
        'annulation',
        'heure_arrivee',
        'heure_depart',
        'regles',
        'autres_infos',
        'statut_validation',
        'type_hebergement',
        'environnement',
        'equipements',
        'a_proximite',
        'indisponibilites'
    ];

    public function prestations() {
        return $this->hasMany(Prestation::class);
    }
}
