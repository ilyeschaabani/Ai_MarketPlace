/**
 * Classe Voiture
 * Représente un véhicule avec ses attributs
 */
class Voiture {
  constructor(matricule, marque, modele, annee, puissance, cylindres, carburant, transmission, traction, prix) {
    this.matricule = matricule;
    this.marque = marque;
    this.modele = modele;
    this.annee = annee;
    this.puissance = puissance;
    this.cylindres = cylindres;
    this.carburant = carburant;
    this.transmission = transmission;
    this.traction = traction;
    this.prix = prix;
  }

  /**
   * Convertit l'objet Voiture en JSON
   */
  toJSON() {
    return {
      matricule: this.matricule,
      marque: this.marque,
      modele: this.modele,
      annee: this.annee,
      puissance: this.puissance,
      cylindres: this.cylindres,
      carburant: this.carburant,
      transmission: this.transmission,
      traction: this.traction,
      prix: this.prix
    };
  }
}

module.exports = Voiture;
