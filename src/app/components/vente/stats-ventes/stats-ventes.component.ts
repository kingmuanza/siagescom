import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Vente } from 'src/app/models/vente.model';
import { VenteArticle } from 'src/app/models/vente.articles.model';

@Component({
  selector: 'app-stats-ventes',
  templateUrl: './stats-ventes.component.html',
  styleUrls: ['./stats-ventes.component.scss']
})
export class StatsVentesComponent implements OnInit, OnChanges {

  @Input() ventes = new Array<Vente>();

  TOTAL = 0;
  TOTAL_ARTICLES = 0;
  RESTE_A_PAYER = 0;
  REMISES = 0;

  constructor() {
    console.log('this.ventes');
    console.log(this.ventes);
  }

  ngOnInit() {
    this.update();
  }

  ngOnChanges(changes: SimpleChanges) {

    this.update();

  }

  getTotal(ventes: Array<Vente>) {
    if (!ventes) {
      return 0;
    }
    let total = 0;
    for (let i = 0; i < ventes.length; i++) {
      const vente = ventes[i];
      total += this.total(vente.ventesArticles) - vente.remise;
    }
    return total;
  }

  getTotalArticles(ventes: Array<Vente>) {
    if (!ventes) {
      return 0;
    }
    let total = 0;
    for (let i = 0; i < ventes.length; i++) {
      const vente = ventes[i];
      for (let j = 0; j < vente.ventesArticles.length; j++) {
        const venteArticle = vente.ventesArticles[j];
        total += venteArticle.quantite;
      }
    }
    return total;
  }
  getResteAPayer(ventes: Array<Vente>) {
    if (!ventes) {
      return 0;
    }
    let total = 0;
    for (let i = 0; i < ventes.length; i++) {
      const vente = ventes[i];
      total += this.total(vente.ventesArticles) - this.remise(vente) - this.sommePercue(vente);
    }
    return total;
  }

  getRemises(ventes: Array<Vente>) {
    if (!ventes) {
      return 0;
    }

    let total = 0;
    for (let i = 0; i < ventes.length; i++) {
      const vente = ventes[i];
      total += vente.remise;
    }
    return total;

  }



  update() {
    this.TOTAL = this.getTotal(this.ventes);
    this.TOTAL_ARTICLES = this.getTotalArticles(this.ventes);
    this.RESTE_A_PAYER = this.getResteAPayer(this.ventes);
    this.REMISES = this.getRemises(this.ventes);
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

  sommePercue(vente: Vente) {
    let somme = 0;
    if (vente.montantPercu) {
      for (let i = 0; i < vente.montantPercu.length; i++) {
        somme += vente.montantPercu[i].montant;
      }
      return somme;
    } else {
      return this.total(vente.ventesArticles) - this.remise(vente);
    }
  }

}
