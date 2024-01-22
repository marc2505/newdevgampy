FICHIER QUI CONTIEND LES REQUETES POUR TRAVAILLER AVEC LES DONNES 
=================================================================

USERS TABLE :
-------------
drop table users;
delete from users;
select * from users;
update users set role = 'admin' where id = 3;
update terrains set type_hebergement = 'radioAvecHebergement-Caravanne' where id = 6;
update terrains set equipements = 'equipement-0|equipement-1' where id = 1;
update terrains set images_principales = null where id = 1;
update terrains set images_principales = null, images_cadres = null where id = 1;
update terrains set images_principales = null, images_cadres = null, images_autres = null where id = 1;
update terrains set adresse = 'Rue des Boudines 9, 1217 Meyrin, Genève, Suisse' where id = 13;
update terrains set nom = 'Nouveau terrain' where id = 9;
update terrains set equipements = 'equipement-8|equipement-12|equipement-15' where id = 18;
update terrains set equipements = 'equipement-17|equipement-16|equipement-15' where id = 4;
update terrains set equipements = 'equipement-17|equipement-16|equipement-13' where id = 9;
update terrains set equipements = 'equipement-7|equipement-10|equipement-9|equipement-15' where id = 11;
update terrains set equipements = 'equipement-16|equipement-13|equipement-11|equipement-8|equipement-15' where id = 14;
update terrains set equipements = 'equipement-6|equipement-7|equipement-8' where id = 18;

delete from equipements where id = 4;
delete from prestations where id = 1;
delete from terrains where id = 28;
delete from terrains where id in (24,26);
delete from users where id = 50;



