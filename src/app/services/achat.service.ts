import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { Entree } from '../models/entree.model';
import { UtilisateurService } from './utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class AchatService {

  entrees: Entree[];
  entreesSubject = new Subject<Entree[]>();

  constructor(public db: AngularFirestore, private uService: UtilisateurService) { }

  emitEntrees() {
    this.entreesSubject.next(this.entrees);
  }

  getAllEntrees() {
    return this.db
      .collection<Entree>('entrees', ref => ref.where('entreprise.id', '==', this.uService.entreprise.id))
      .valueChanges();
  }
  getAllFamilles() {
    return this.db
      .collection<Entree>('familles', ref => ref.where('entreprise.id', '==', this.uService.entreprise.id))
      .valueChanges();
  }

  getEntree(id: string) {
    return this.db.collection('entrees').doc(id).get().toPromise();
  }
  getFamille(id: string) {
    return this.db.collection('familles').doc(id).get().toPromise();
  }

  saveEntree(entree: Entree) {
    return this.db.collection('entrees').doc(entree.id).set(Object.assign({}, entree));
  }

  deleteEntree(entree: Entree) {
    return this.db.collection('entrees').doc(entree.id).delete();
  }


}
