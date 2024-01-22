<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TerrainResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'nom' => $this->nom,
            'adresse' => $this->adresse,
            'prix_nuitee' => $this->prix_nuitee,
            'prix_adulte_supp' => $this->prix_adulte_supp,
            'prix_ado_supp' => $this->prix_ado_supp,
            'prix_taxe_sejour' => $this->prix_taxe_sejour,
            'images_principales' => $this->images_principales,
            'images_cadres' => $this->images_cadres,
            'images_autres' => $this->images_autres,
            'surface' => $this->surface,
            'capacite_visiteurs' => $this->capacite_visiteurs,
            'desc_generale' => $this->desc_generale,
            'desc_cadre' => $this->desc_cadre,
            'desc_equipement' => $this->desc_equipement,
            'annulation' => $this->annulation,
            'heure_arrivee' => $this->heure_arrivee,
            'heure_depart' => $this->heure_depart,
            'regles' => $this->regles,
            'autres_infos' => $this->autres_infos,
            'statut_validation' => $this->statut_validation,
            'type_hebergement' => $this->type_hebergement,
            'environnement' => $this->environnement,
            'equipements' => $this->equipements,
            'a_proximite' => $this->a_proximite,
            'prestations' => $this->prestations,
            'indisponibilites' => $this->indisponibilites,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s')
        ];
    }
}
