import { Injectable } from '@angular/core';
import { Suggestion } from '../models/suggestion.model';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilisateurService } from './utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  suggestions: Suggestion[];
  suggestionsSubject = new Subject<Suggestion[]>();

  constructor(public db: AngularFirestore, private uService: UtilisateurService) { }

  emitSuggestions() {
    this.suggestionsSubject.next(this.suggestions);
  }

  getAllSuggestions() {
    return this.db
      .collection<Suggestion>('suggestions', ref => ref.where('entreprise.id', '==', this.uService.entreprise.id))
      .valueChanges();
  }

  getSuggestion(id: string) {
    return this.db.collection('suggestions').doc(id).get().toPromise();
  }

  saveSuggestion(suggestion: Suggestion) {
    return this.db.collection('suggestions').doc(suggestion.id).set(Object.assign({}, suggestion));
  }

  deleteSuggestion(suggestion: Suggestion) {
    return this.db.collection('suggestions').doc(suggestion.id).delete();
  }


}
