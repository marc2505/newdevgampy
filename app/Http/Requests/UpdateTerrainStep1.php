<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTerrainStep1 extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required',
            // INFOS GENERALES
            'type_hebergement' => 'required|string',
            'capacite_visiteurs' => 'required|numeric|min:0',
            'surface' => 'required|numeric|min:0',
            'environnement' => 'required|string',
            'equipements' => 'required|string',
            'a_proximite' => 'required|string',
            // DESCRIPTION
            'nom' => 'nullable|string|max:50',
            'desc_generale' => 'nullable|string',
            'desc_cadre' => 'nullable|string',
            'desc_equipement' => 'nullable|string',
            'annulation' => 'nullable|string',
            'heure_arrivee' => 'nullable|string',
            'heure_depart' => 'nullable|string',
            'regles' => 'nullable|string',
            'autres_infos' => 'nullable|string',
            // PHOTOS
            'images_principales' => 'nullable',
            'images_cadres' => 'nullable',
            'images_autres' => 'nullable',
            // ADRESSE
            'adresse' => 'nullable|string|max:255',
            // PRIX
            'prix_nuitee' => 'nullable|numeric|min:0',
            'prix_adulte_supp' => 'nullable|numeric|min:0',
            'prix_ado_supp' => 'nullable|numeric|min:0',
            'prix_taxe_sejour' => 'nullable|numeric|min:0',
            // CALENDRIER
            'indisponibilites' => 'nullable|string',
            'statut_validation' => 'required|string',
        ];
    }
}
