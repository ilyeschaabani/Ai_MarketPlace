/**
 * Classe Appointment
 * Représente un rendez-vous de vente de voiture
 */
class Appointment {
  constructor(vehicle_id, buyer_name, buyer_phone, appointment_date, status, notes, seller_name, seller_phone, seller_email) {
    this.vehicle_id = vehicle_id;
    this.buyer_name = buyer_name;
    this.buyer_phone = buyer_phone;
    this.appointment_date = appointment_date;
    this.status = status;
    this.notes = notes;
    this.seller_name = seller_name;
    this.seller_phone = seller_phone;
    this.seller_email = seller_email;
  }

  /**
   * Convertit l'objet Appointment en JSON
   */
  toJSON() {
    return {
      vehicle_id: this.vehicle_id,
      buyer_name: this.buyer_name,
      buyer_phone: this.buyer_phone,
      appointment_date: this.appointment_date,
      status: this.status,
      notes: this.notes,
      seller_name: this.seller_name,
      seller_phone: this.seller_phone,
      seller_email: this.seller_email
    };
  }
}

module.exports = Appointment;