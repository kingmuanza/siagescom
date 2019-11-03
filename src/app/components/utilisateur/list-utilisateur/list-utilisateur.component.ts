import { Component, OnInit, OnDestroy } from '@angular/core';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { Subscription, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DATATABLE_OPTIONS } from 'src/app/models/datatable.options';

@Component({
  selector: 'app-list-utilisateur',
  templateUrl: './list-utilisateur.component.html',
  styleUrls: ['./list-utilisateur.component.scss']
})
export class ListUtilisateurComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {
    order: [[0, 'desc']],
    info: false,
    lengthChange: true,
    language: {
      emptyTable: '',
      search: 'Rechercher : ',
      lengthMenu: 'Afficher _MENU_ lignes'
    }
  };
  dtTrigger = new Subject();

  utilisateurs: Utilisateur[];
  utilisateursSubscription: Subscription;

  constructor(private utilisateurService: UtilisateurService, private router: Router) { }

  ngOnInit() {
    this.utilisateursSubscription = this.utilisateurService.getCollaborateurs().subscribe((utilisateurs) => {
      this.utilisateurs = utilisateurs;
      this.dtTrigger.next();
      console.log(utilisateurs);
    });
  }

  viewUtilisateur(utilisateur: Utilisateur) {
    this.router.navigate(['utilisateurs', 'view', utilisateur.id]);
  }


  ngOnDestroy(): void {
    this.utilisateursSubscription.unsubscribe();
  }

}
