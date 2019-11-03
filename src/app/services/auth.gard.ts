import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { UtilisateurService } from './utilisateur.service';
import { Utilisateur } from '../models/utilisateur.model';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private utilisateurService: UtilisateurService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.utilisateurService.utilisateur) {
      return true;
    } else {
      const utilisateur = firebase.auth().currentUser;
      if (utilisateur) {
        // this.utilisateurService.getUtilisateur(utilisateur.uid).then((u) => {
          // this.utilisateurService.utilisateur = u.data() as Utilisateur;
        // });
        return true;
      } else {
        this.router.navigate(['/connexion']);
      }
    }
  }
}
