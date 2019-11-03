import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VenteService } from 'src/app/services/vente.service';
import { Vente } from 'src/app/models/vente.model';

@Component({
  selector: 'app-view-facture',
  templateUrl: './view-facture.component.html',
  styleUrls: ['./view-facture.component.scss']
})
export class ViewFactureComponent implements OnInit {

  vente: Vente;

  constructor(private route: ActivatedRoute, private venteService: VenteService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(ParamsAsMap => {
      const id = ParamsAsMap.get('id');
      this.venteService.getVente(id).then((vente) => {
        this.vente = vente.data() as Vente;
      });
    });
  }

  getDate(vente: Vente) {
    const x = vente['date'] as any;
    return new Date(x.seconds);
  }
}
