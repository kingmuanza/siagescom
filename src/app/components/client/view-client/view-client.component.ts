import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faPen, faList } from '@fortawesome/free-solid-svg-icons';
import { Vente } from 'src/app/models/vente.model';
import { Subscription, Subject } from 'rxjs';
import { DATATABLE_OPTIONS } from 'src/app/models/datatable.options';
import { VenteService } from 'src/app/services/vente.service';
import { VenteArticle } from 'src/app/models/vente.articles.model';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss']
})
export class ViewClientComponent implements OnInit {

  faPen = faPen;
  faList = faList;
  client: Client;
  ventes: Vente[];
  ventesSubscription: Subscription;
  dtOptions: DataTables.Settings = DATATABLE_OPTIONS;
  dtTrigger = new Subject();

  // tslint:disable-next-line:max-line-length
  constructor(private venteService: VenteService, private router: Router, private route: ActivatedRoute, private clientService: ClientService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(ParamsAsMap => {
      const id = ParamsAsMap.get('id');
      this.clientService.getClient(id).then((client) => {
        this.client = client.data() as Client;
        this.ventesSubscription = this.venteService.getAllVentesClient(this.client).subscribe((ventes) => {
          this.ventes = ventes;
          this.dtTrigger.next();
          console.log('this.ventes');
          console.log(this.ventes);
        });
      });
    });
  }


  viewVente(v: Vente) {
    this.router.navigate(['ventes', 'view', v.id]);
  }


  edit(client: Client) {
    this.router.navigate(['clients', 'edit', client.id]);
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

}
