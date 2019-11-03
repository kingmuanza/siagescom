import { Component, OnInit, OnDestroy } from '@angular/core';
import { Entreprise } from './models/entreprise.model';
import { Utilisateur } from './models/utilisateur.model';
import { UtilisateurService } from './services/utilisateur.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { faChartBar, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faPeopleCarry, faBars, faCog, faSignOutAlt, faComment } from '@fortawesome/free-solid-svg-icons';
import { faHistory, faUsersCog, faCalendar, faUser, faPlus, faMoneyBill } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  entreprise: Entreprise;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  entrepriseSubscription: Subscription;

  faChartBar = faChartBar;
  faComment = faComment;
  faFile = faFile;
  faCog = faCog;
  faUsersCog = faUsersCog;
  faShoppingCart = faShoppingCart;
  faUsers = faUsers;
  faPlus = faPlus;
  faBars = faBars;
  faSignOutAlt = faSignOutAlt;
  faMoneyBill = faMoneyBill;
  faMoneyBillWave = faMoneyBillWave;
  faUser = faUser;
  faPeopleCarry = faPeopleCarry;
  faHistory = faHistory;
  faCalendar = faCalendar;

  constructor(private utilisateurService: UtilisateurService, private router: Router) {

  }

  profil() {
    this.router.navigate(['profil', this.utilisateur.id]);
  }

  menu() {
    this.router.navigate(['parametres']);
  }

  hasAutorisation(codeAutorisation: string) {
    for (let i = 0; i < this.utilisateur.autorisations.length; i++) {
      if (this.utilisateur.autorisations[i].code === codeAutorisation) {
        return true;
      }
    }
    return false;
  }

  ngOnInit(): void {
    this.utilisateurSubscription = this.utilisateurService.utilisateurSubject.subscribe((utilisateur: Utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.entrepriseSubscription = this.utilisateurService.entrepriseSubject.subscribe((entreprise: Entreprise) => {
      this.entreprise = entreprise;
    });
    this.utilisateurService.emitUtilisateur();
    this.utilisateurService.emitEntreprise();
  }

  ngOnDestroy(): void {

  }

  deconnexion() {
    this.utilisateurService.onDeconnexion().then(() => {
      this.router.navigate(['connexion']);
    });
  }

  nouvelleVente() {
    this.router.navigate(['ventes', 'edit']);
  }
  nouveauClient() {
    this.router.navigate(['clients', 'edit']);
  }
  nouvelleSuggestion() {
    this.router.navigate(['suggestions', 'edit']);
  }

}
