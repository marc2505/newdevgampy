<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('terrains', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->string('nom')->nullable();
            $table->string('adresse')->nullable();
            $table->decimal('prix_nuitee',8,2)->nullable();
            $table->decimal('prix_adulte_supp',8,2)->nullable();
            $table->decimal('prix_ado_supp',8,2)->nullable();
            $table->decimal('prix_taxe_sejour',8,2)->nullable();
            $table->string('images_principales')->nullable();
            $table->string('images_cadres')->nullable();
            $table->string('images_autres')->nullable();
            $table->integer('surface')->nullable();
            $table->integer('capacite_visiteurs')->nullable();
            $table->longText('desc_generale')->nullable();
            $table->longText('desc_cadre')->nullable();
            $table->longText('desc_equipement')->nullable();
            $table->string('annulation')->nullable();
            $table->time('heure_arrivee')->nullable();
            $table->time('heure_depart')->nullable();
            $table->longText('regles')->nullable();
            $table->longText('autres_infos')->nullable();
            $table->string('statut_validation')->nullable();
            $table->string('type_hebergement')->nullable();
            $table->string('environnement')->nullable();
            $table->string('equipements')->nullable();
            $table->string('a_proximite')->nullable();
            $table->string('indisponibilites')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('terrains');
    }
};
