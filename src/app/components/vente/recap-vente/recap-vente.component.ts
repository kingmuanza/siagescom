import { Component, OnInit, Input } from '@angular/core';
import { Vente } from 'src/app/models/vente.model';
import { VenteArticle } from 'src/app/models/vente.articles.model';
import { VenteRecap } from 'src/app/models/vente.articles.recap.model';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { Entreprise } from 'src/app/models/entreprise.model';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import * as writtenNumber from 'written-number';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-recap-vente',
  templateUrl: './recap-vente.component.html',
  styleUrls: ['./recap-vente.component.scss']
})
export class RecapVenteComponent implements OnInit {

  @Input() vente: Vente;
  venteRecap: VenteRecap;
  entreprise: Entreprise;
  utilisateur: Utilisateur;
  paiementForm: FormGroup;

  constructor(private router: Router, private uS: UtilisateurService) {
    this.entreprise = this.uS.entreprise;
    this.utilisateur = this.uS.utilisateur;
    writtenNumber.defaults.lang = 'fr';
  }

  ngOnInit() {
    this.venteRecap = new VenteRecap(this.vente);
    console.log('this.venteRecap');
    console.log(this.venteRecap);
  }

  getDate(vente: Vente) {
    const x = vente['date'] as any;
    return new Date(x.seconds * 1000);
  }

  viewVente(v: Vente) {
    this.router.navigate(['ventes', 'view', v.id]);
  }

  prix(va: VenteArticle) {
    return va.entree.prixVenteUnitaire * va.quantite;
  }

  remise() {
    return this.vente.remise;
  }

  totalEnLettres(nombre) {
    return writtenNumber(nombre, { lang: 'fr' });
  }

  total(ventesArticles: VenteArticle[]) {
    let somme = 0;
    for (let i = 0; i < ventesArticles.length; i++) {
      somme += this.prix(ventesArticles[i]);
    }
    return somme;
  }

  toImage() {
    console.log('toImage()');
    console.log(document.querySelector('#capture'));
    html2canvas(document.querySelector('#capture')).then(canvas => {
      console.log(canvas);
      canvas.toBlob((blob) => {
        // To download directly on browser default 'downloads' location
        const link = document.createElement('a');
        link.download = 'image.png';
        link.href = URL.createObjectURL(blob);
        console.log('blob');
        console.log(blob);
        link.click();

        // To save manually somewhere in file explorer
        window.open('image.png');

      }, 'image/png');
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      console.log('FINALLY');
    });
  }

}
