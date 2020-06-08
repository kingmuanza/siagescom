import { Injectable } from '@angular/core';
import { Vente } from '../models/vente.model';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilisateurService } from './utilisateur.service';
import { Utilisateur } from '../models/utilisateur.model';
import { Promotion } from '../models/promotion.model';
import { Entree } from '../models/entree.model';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class VenteService {

  ventes: Vente[];
  ventesSubject = new Subject<Vente[]>();
  promotions: Promotion[];
  promotionsSubject = new Subject<Promotion[]>();

  constructor(public db: AngularFirestore, private uService: UtilisateurService) { }

  emitVentes() {
    this.ventesSubject.next(this.ventes);
  }
  emitPromotions() {
    this.promotionsSubject.next(this.promotions);
  }

  getAllVentes() {
    return this.db
      .collection<Vente>('ventes', ref => ref.where('entreprise.id', '==', this.uService.entreprise.id))
      .valueChanges();
  }
  getAllCreances() {
    return this.db
      .collection<Vente>('ventes', ref => ref.where('entreprise.id', '==', this.uService.entreprise.id))
      .valueChanges();
  }

  getAllVentesEntreDeuxDates(debut: Date, fin: Date) {
    console.log('getAllVentesEntreDeuxDates');
    return this.db
      .collection<Vente>('ventes',
        ref => ref.where('entreprise.id', '==', this.uService.entreprise.id)
          .where('date', '>', debut)
          .where('date', '<', fin))
      .valueChanges();
  }
  getAllVentesOfEntree(entree: Entree) {
    console.log('getAllVentesOfEntree');
    return this.db
      .collection<Vente>('ventes',
        ref => ref.where('entreprise.id', '==', this.uService.entreprise.id)
          .where('idEntrees', 'array-contains', entree.id)
      ).valueChanges();
  }
  getAllPromotions() {
    return this.db
      .collection<Promotion>('promotions', ref => ref.where('entreprise.id', '==', this.uService.entreprise.id))
      .valueChanges();
  }
  getAllVentesUtilisateur(utilisateur: Utilisateur) {
    return this.db
      .collection<Vente>('ventes',
        ref => ref.where('entreprise.id', '==', this.uService.entreprise.id)
          .where('utilisateur.id', '==', utilisateur.id)
      ).valueChanges();
  }
  getAllVentesClient(client: Client) {
    return this.db
      .collection<Vente>('ventes',
        ref => ref.where('entreprise.id', '==', this.uService.entreprise.id)
          .where('client.id', '==', client.id)
      ).valueChanges();
  }

  getVentesDuJour(ventes: Array<Vente>, jour: Date): Array<Vente> {
    console.log('getVentesDuJour');
    const returnVentes = new Array<Vente>();
    if (ventes) {
      for (let i = 0; i < ventes.length; i++) {
        // console.log(i);
        const vente = ventes[i];
        // console.log(vente);
        const date = new Date(vente.date['seconds'] * 1000);
        // console.log('date');
        // console.log(date);
        if (date.toISOString().split('T')[0] === jour.toISOString().split('T')[0]) {
          returnVentes.push(vente);
        }
      }
    }
    console.log(returnVentes);
    return returnVentes;
  }

  getNDerniersJours(nombre?: number): Array<Date> {
    if (nombre) {

    } else {
      nombre = 7;
    }


    const aujoudhui = new Date();
    const tableau = [];

    for (let i = nombre - 1; i >= 0; i--) {
      tableau.push(new Date(aujoudhui.getTime() - i * (24 * 60 * 60 * 1000)));
    }

    console.log(tableau);
    return tableau;
  }

  getVente(id: string) {
    return this.db.collection('ventes').doc(id).get().toPromise();
  }
  getPromotion(id: string) {
    return this.db.collection('promotions').doc(id).get().toPromise();
  }

  savePromotion(promotion: Promotion) {
    return this.db.collection('promotions').doc(promotion.id).set(Object.assign({}, promotion));
  }

  async saveVente(vente: Vente) {
    console.log('save vente');
    for (let i = 0; i < vente.ventesArticles.length; i++) {
      const entree = vente.ventesArticles[i].entree;
      console.log('entree');
      /*if (entree.quantiteActuelle) {
        entree.quantiteActuelle -= vente.ventesArticles[i].quantite;
      } else {
        entree['quantiteActuelle'] = entree.quantite - vente.ventesArticles[i].quantite;
      }*/
      await this.db.collection('entrees').doc(entree.id).set(Object.assign({}, entree));
      console.log(entree);
    }
    return this.db.collection('ventes').doc(vente.id).set(Object.assign({}, vente));
  }

  deleteVente(vente: Vente) {
    return this.db.collection('ventes').doc(vente.id).delete();
  }
  deletePromotion(promotion: Promotion) {
    return this.db.collection('promotions').doc(promotion.id).delete();
  }

  getPromotionEnCours(promotions: Promotion[]) {
    console.log('Promotions en cours');
    for (let i = 0; i < promotions.length; i++) {
      const promotion = promotions[i];
      console.log('Promotion');
      console.log(promotion);
      console.log(new Date(promotion.dateDebut));
      console.log(new Date(promotion.dateFin));
      if (new Date().getTime() > new Date(promotion.dateDebut).getTime() && new Date().getTime() < new Date(promotion.dateFin).getTime()) {
        return promotion;
      }
    }
  }

}
