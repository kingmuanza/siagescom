import { Component, OnInit, OnDestroy } from '@angular/core';
import { VenteService } from 'src/app/services/vente.service';
import { AchatService } from 'src/app/services/achat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Entree } from 'src/app/models/entree.model';
import { DATATABLE_OPTIONS } from 'src/app/models/datatable.options';
import { Subject, Subscription } from 'rxjs';
import { Vente } from 'src/app/models/vente.model';
import { VenteArticle } from 'src/app/models/vente.articles.model';

@Component({
  selector: 'app-view-entree',
  templateUrl: './view-entree.component.html',
  styleUrls: ['./view-entree.component.scss']
})
export class ViewEntreeComponent implements OnInit, OnDestroy {

  achat: Entree;
  dtOptions: DataTables.Settings = DATATABLE_OPTIONS;
  dtTrigger = new Subject();

  ventes: Vente[];
  ventesSubscription: Subscription;

  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private router: Router, private achatService: AchatService, private venteService: VenteService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(ParamsAsMap => {
      const id = ParamsAsMap.get('id');
      if (id) {
        this.achatService.getEntree(id).then((achat) => {
          console.log(achat.data());
          this.achat = achat.data() as Entree;
          console.log('this.achat');
          console.log(this.achat);
          this.ventesSubscription = this.venteService.getAllVentesOfEntree(this.achat).subscribe((ventes) => {
            this.ventes = ventes;
            this.dtTrigger.next();
            console.log('this.ventes');
            console.log(this.ventes);
            this.setQuantiteActuelle();
          });
        });
      }
    });
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

  timestampToDate(date) {
    if (date.toDate()) {
      return date.toDate();
    } else {
      return date;
    }
  }

  showDate(date) {
    console.log('fvgkbhljmk,ùml;');
    console.log(date);
    if (date.seconds) {
      return new Date(date.seconds * 1000);
    } else {
      return new Date(date);
    }
  }

  gainDeLentreeSurVente(achat: Entree, vente: Vente) {
    const pourcentageRemise = this.remise(vente) / this.total(vente.ventesArticles);
    let quantiteDeLAchat = 0;
    for (let i = 0; i < vente.ventesArticles.length; i++) {
      const va = vente.ventesArticles[i];
      if (va.entree.id === achat.id) {
        quantiteDeLAchat = va.quantite;
      }
    }
    return quantiteDeLAchat * achat.prixVenteUnitaire * (1 - pourcentageRemise);
  }


  viewVente(v: Vente) {
    this.router.navigate(['ventes', 'view', v.id]);
  }

  ngOnDestroy() {
    this.ventesSubscription.unsubscribe();
  }

  getQuantiteActuelle() {
    console.log('getQuantiteActuelle');
    let qte = 0;
    console.log('this.ventes.length');
    console.log(this.ventes.length);
    for (let i = 0; i < this.ventes.length; i++) {
      const vente = this.ventes[i];
      for (let j = 0; j < vente.ventesArticles.length; j++) {
        const va = vente.ventesArticles[j];
        console.log('va');
        console.log(va);
        if (va.entree.id === this.achat.id) {
          qte += va.quantite;
          console.log('qte');
          console.log(qte);
        }
      }
    }
    console.log('qte');
    console.log(qte);
    return qte;
  }

  setQuantiteActuelle() {
    console.log('setQuantiteActuelle');
    this.achat.quantiteActuelle = this.achat.quantite - this.getQuantiteActuelle();
    this.achatService.saveEntree(this.achat);
  }

}
