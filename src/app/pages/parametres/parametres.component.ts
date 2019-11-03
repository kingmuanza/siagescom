import { Component, OnInit } from '@angular/core';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { Entreprise } from 'src/app/models/entreprise.model';
import { Subscription } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { faFile, faUsersCog, faChevronRight, faChartBar, faShoppingCart, faCalendar, faUsers, faPeopleCarry, faSignOutAlt, faUser, faStamp, faMoneyBill, faComment } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.scss']
})
export class ParametresComponent implements OnInit {

  entreprise: Entreprise;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  entrepriseSubscription: Subscription;

  faFile = faFile;
  faComment = faComment;
  faUsersCog = faUsersCog;
  faChevronRight = faChevronRight;
  faChartBar = faChartBar;
  faShoppingCart = faShoppingCart;
  faCalendar = faCalendar;
  faUser = faUser;
  faStamp = faStamp;
  faUsers = faUsers;
  faPeopleCarry = faPeopleCarry;
  faSignOutAlt = faSignOutAlt;
  faMoneyBill = faMoneyBill;

  constructor(private utilisateurService: UtilisateurService, private router: Router) { }

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

  hasAutorisation(codeAutorisation: string) {
    for (let i = 0; i < this.utilisateur.autorisations.length; i++) {
      if (this.utilisateur.autorisations[i].code === codeAutorisation) {
        return true;
      }
    }
    return false;
  }

  profil() {
    this.router.navigate(['profil', this.utilisateur.id]);
  }

  deconnexion() {
    this.utilisateurService.onDeconnexion().then(() => {
      this.router.navigate(['connexion']);
    });
  }

}
