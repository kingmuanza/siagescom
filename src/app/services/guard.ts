import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { UtilisateurService } from './utilisateur.service';
import { Utilisateur } from '../models/utilisateur.model';

@Injectable()
export class Guard implements CanActivate {

  constructor(private router: Router, private utilisateurService: UtilisateurService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.utilisateurService.utilisateur && this.utilisateurService.entreprise) {
      return true;
    }
    if (this.utilisateurService.utilisateur && !this.utilisateurService.entreprise) {
      this.router.navigate(['/entreprise']);
    }
    if (!this.utilisateurService.utilisateur) {
      this.router.navigate(['/connexion']);
    }
  }
}
