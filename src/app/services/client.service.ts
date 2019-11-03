import { Injectable } from '@angular/core';
import { Client } from '../models/client.model';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilisateurService } from './utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  clients: Client[];
  clientsSubject = new Subject<Client[]>();

  constructor(public db: AngularFirestore, private uService: UtilisateurService) { }

  emitClients() {
    this.clientsSubject.next(this.clients);
  }

  getAllClients() {
    return this.db
      .collection<Client>('clients', ref => ref.where('entreprise.id', '==', this.uService.entreprise.id))
      .valueChanges();
  }

  getClient(id: string) {
    return this.db.collection('clients').doc(id).get().toPromise();
  }

  saveClient(client: Client) {
    return this.db.collection('clients').doc(client.id).set(Object.assign({}, client));
  }

  deleteClient(client: Client) {
    return this.db.collection('clients').doc(client.id).delete();
  }


}
