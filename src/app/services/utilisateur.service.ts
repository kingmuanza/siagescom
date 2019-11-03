import { Injectable } from '@angular/core';
import { Connexion } from '../models/connexion.model';
import { Utilisateur } from '../models/utilisateur.model';
import { Entreprise } from '../models/entreprise.model';
import { Observable, Subject } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { Autorisation } from '../models/autorisation.model';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  utilisateur: Utilisateur;
  utilisateurSubject = new Subject<Utilisateur>();

  utilisateurs: Utilisateur[];
  utilisateursSubject = new Subject<Utilisateur[]>();

  entreprise: Entreprise;
  entrepriseSubject = new Subject<Entreprise>();

  AUTORISATIONS = [
    Object.assign({}, new Autorisation('VENTE', 'Accès au module de vente')),
    Object.assign({}, new Autorisation('PROMOTION', 'Accès au module de promotion')),
    Object.assign({}, new Autorisation('ACHAT', 'Accès au module d\'achat')),
    Object.assign({}, new Autorisation('ARTICLE', 'Accès au module des articles')),
    Object.assign({}, new Autorisation('UTILISATEURS', 'Accès au module de gestion des utilisateurs'))
  ];

  constructor(public db: AngularFirestore) {
    this.AUTORISATIONS = this.AUTORISATIONS.map((obj) => {
      return Object.assign({}, obj);
    });
  }

  emit() {
    this.emitUtilisateur();
    this.emitEntreprise();
  }
  emitUtilisateur() {
    this.utilisateurSubject.next(this.utilisateur);
  }
  emitUtilisateurs() {
    this.utilisateursSubject.next(this.utilisateurs);
  }
  emitEntreprise() {
    this.entrepriseSubject.next(this.entreprise);
  }

  // Sauvegarder localement les données de l'utilisateur
  saveCredentials(utilisateur: Utilisateur) {
    console.log('saveCredentials');
    localStorage.setItem('SIAGESCOM_USER', JSON.stringify(utilisateur));
  }

  // Récuperer les données locales de l'utilisateur
  getCredentials(): Utilisateur {
    console.log('getCredentials');
    const uString = localStorage.getItem('SIAGESCOM_USER');
    if (uString) {
      return JSON.parse(uString) as Utilisateur;
    }
    return null;
  }

  // Mise à jour du mot de passe
  updatePassword(u: Utilisateur, ancien: string) {
    console.log('updatePassword');
    console.log('utilisateur');
    console.log(u);
    return new Promise((resolve, reject) => {
      // Authentification de l'utilisateur
      console.log('Authentification...');
      firebase.auth().signInWithEmailAndPassword(u.login, ancien).then(() => {
        console.log('Authentification réussie');
        console.log('Mise à jour du mot de passe');
        const user = firebase.auth().currentUser;
        user.updatePassword(u.passe).then(() => {
          // Update successful.
          console.log('Mot de passe mis à jour');
          console.log('Mis à jour des données de l\'utilisateur');
          this.onUpdateUtilisateur(u).then(() => {
            console.log('Données de l\'utilisateur mises à jour');
            console.log('Déconnexion !!!');
            resolve(this.onDeconnexion());
          });
        }, (error) => {
          reject(error);
        });
      }).catch((e) => {
        console.log('Echec authentification');
        reject('L\'ancien mot de passe est incorrect !');
      });
    });
  }

  onSaveEntreprise(entreprise: Entreprise) {
    console.log('onSaveEntreprise');
    return new Promise((resolve, reject) => {
      this.utilisateur.entreprise = Object.assign({}, entreprise);
      this.entreprise = entreprise;
      console.log('Mise à jour de l\'entreprise');
      this.db.collection('entreprises').doc(entreprise.id).set(Object.assign({}, entreprise)).then(() => {
        console.log('Entreprise mise à jour');
        console.log('Mise à jour de l\'utilisateur');
        this.db.collection('utilisateurs').doc(this.utilisateur.id).set(Object.assign({}, this.utilisateur)).then(() => {
          console.log('Utilisateur mis à jour');
          this.emit();
          resolve(this.utilisateur);
        }, (error) => {
          reject(error);
        });
      }, (error) => {
        reject(error);
      });
    });
  }

  getEntreprise(id: string) {
    return this.db.collection('entreprises').doc(id).get().toPromise();
  }

  onDeconnexion() {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut().then(() => {
        resolve(true);
        this.utilisateur = null;
        this.entreprise = null;
        this.emit();
      });
    });
  }

  onConnexion(connexion: Connexion) {
    const that = this;
    return new Promise(
      (resolve, reject) => {
        // Vérification de l'authentification
        console.log('Authentification...');
        firebase.auth().signInWithEmailAndPassword(connexion.login, connexion.passe).then((c) => {
          console.log('Authentification réussie');
          console.log('Recherche de l\'utilisateur dans la base');
          // Recherche de l'utilisateur dans la base de données
          this.db.collection('utilisateurs').doc(c.user.uid).get().toPromise().then((data) => {
            if (data.data()) {
              console.log('Utilisateur trouvé');
              // Si un utilisateur est trouvé
              this.utilisateur = data.data() as Utilisateur;
              if (this.utilisateur.entreprise) {
                console.log('Utilisateur est affilié à une entreprise');
                this.entreprise = this.utilisateur.entreprise;
                console.log('Mise à jour des informations de l\'entreprise');
                this.db.collection('entreprises').doc(this.utilisateur.entreprise.id).get().toPromise().then((entreprise) => {
                  console.log('Informations de l\'entreprise mises à jour');
                  this.entreprise = entreprise.data() as Entreprise;
                  this.utilisateur.entreprise = this.entreprise;
                  this.emit();
                  resolve(this.utilisateur);
                });
              } else {
                this.emit();
                resolve(this.utilisateur);
              }
            } else {
              console.log('Aucun utilisateur trouvé');
              // Si aucun utilisateur n'est trouvé
              const u = new Utilisateur(connexion.login, connexion.login.split('@')[0], connexion.passe, 100, this.AUTORISATIONS);
              u.id = c.user.uid;
              console.log('Création de l\'utilissateur');
              console.log(u);
              this.emit();
              console.log('Sauvegarde de l\'utilissateur');
              const autorisations = u.autorisations.map((obj) => {
                return Object.assign({}, obj);
              });
              u.autorisations = autorisations;
              this.utilisateur = u;
              console.log('u.id');
              console.log(u.id);
              this.db.collection('utilisateurs').doc(u.id).set(Object.assign({}, u)).then(() => {
                resolve(this.utilisateur);
                console.log('Utilissateur sauvegardé');
              }, (error) => {
                reject(error);
              });
            }
          }, (error) => {
            reject(error);
          });
        },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  connexionByID(uid) {
    return new Promise((resolve, reject) => {
      this.db.collection('utilisateurs').doc(uid).get().toPromise().then((data) => {
        if (data.data()) {
          console.log('Utilisateur trouvé');
          // Si un utilisateur est trouvé
          this.utilisateur = data.data() as Utilisateur;
          if (this.utilisateur.entreprise) {
            console.log('Utilisateur est affilié à une entreprise');
            this.entreprise = this.utilisateur.entreprise;
            console.log('Mise à jour des informations de l\'entreprise');
            this.db.collection('entreprises').doc(this.utilisateur.entreprise.id).get().toPromise().then((entreprise) => {
              console.log('Informations de l\'entreprise mises à jour');
              this.entreprise = entreprise.data() as Entreprise;
              this.utilisateur.entreprise = this.entreprise;
              this.emit();
              resolve(this.utilisateur);
            });
          } else {
            this.emit();
            resolve(this.utilisateur);
          }
        } else {
          reject('Cest quel comportement ca !');
        }
      }, (error) => {
        reject(error);
      });
    });

  }

  getCollaborateurs() {
    return this.db
      .collection<Utilisateur>('utilisateurs', ref => ref.where('entreprise.id', '==', this.entreprise.id))
      .valueChanges();
  }

  getUtilisateur(id: string) {
    return this.db.collection('utilisateurs').doc(id).get().toPromise();
  }

  onSaveUtilisateur(utilisateur: Utilisateur) {
    if (utilisateur.id) {

    } else {

    }
  }

  onCreateUtilisateur(u: Utilisateur) {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(u.login, u.passe).then((user) => {
        const id = user.user.uid;
        u.id = id;
        this.db.collection('utilisateurs').doc(u.id).set(Object.assign({}, u)).then(() => {
          resolve(u);
        }).catch((e) => {
          reject(e);
        });
      }).catch((e) => {
        reject(e);
      });
    });

  }

  onUpdateUtilisateur(u: Utilisateur) {
    console.log('u');
    console.log(u);
    return this.db.collection('utilisateurs').doc(u.id).set(Object.assign({}, u));
  }


}
