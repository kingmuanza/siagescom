import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { Vente } from 'src/app/models/vente.model';
import { Subscription, Subject } from 'rxjs';
import { VenteService } from 'src/app/services/vente.service';
import { DATATABLE_OPTIONS } from 'src/app/models/datatable.options';
import { VenteArticle } from 'src/app/models/vente.articles.model';

@Component({
  selector: 'app-view-utilisateur',
  templateUrl: './view-utilisateur.component.html',
  styleUrls: ['./view-utilisateur.component.scss']
})
export class ViewUtilisateurComponent implements OnInit, OnDestroy {

  utilisateur: Utilisateur;
  ventes: Vente[];
  ventesSubscription: Subscription;
  dtOptions: DataTables.Settings = DATATABLE_OPTIONS;
  dtTrigger = new Subject();


  // tslint:disable-next-line:max-line-length
  constructor(private venteService: VenteService, private router: Router, private route: ActivatedRoute, private utilisateurService: UtilisateurService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(ParamsAsMap => {
      const id = ParamsAsMap.get('id');
      this.utilisateurService.getUtilisateur(id).then((utilisateur) => {
        this.utilisateur = utilisateur.data() as Utilisateur;
        this.ventesSubscription = this.venteService.getAllVentesUtilisateur(this.utilisateur).subscribe((ventes) => {
          this.ventes = ventes;
          this.dtTrigger.next();
          console.log('this.ventes');
          console.log(this.ventes);
        });
      });
    });
  }

  edit(utilisateur: Utilisateur) {
    this.router.navigate(['utilisateurs', 'edit', utilisateur.id]);
  }

  prix(va: VenteArticle) {
    return va.entree.prixVenteUnitaire * va.quantite;
  }

  total(ventesArticles: VenteArticle[]) {
    let somme = 0;
    for (let i = 0; i < ventesArticles.length; i++) {
      somme += this.prix(ventesArticles[i]);
    }
    return somme;
  }

  remise(vente: Vente) {
    return vente.remise;
  }


  viewVente(v: Vente) {
    this.router.navigate(['ventes', 'view', v.id]);
  }

  ngOnDestroy() {
    this.ventesSubscription.unsubscribe();
  }

}
