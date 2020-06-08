import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VenteService } from 'src/app/services/vente.service';
import { Vente } from 'src/app/models/vente.model';
import { VenteArticle } from 'src/app/models/vente.articles.model';
import { faPlus, faMoneyBill, faList, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as firebase from 'firebase';

@Component({
  selector: 'app-view-vente',
  templateUrl: './view-vente.component.html',
  styleUrls: ['./view-vente.component.scss']
})
export class ViewVenteComponent implements OnInit {

  vente: Vente;
  net = 0;
  percu = 0;
  ventes = [];
  faPlus = faPlus;
  faList = faList;
  faTrash = faTrash;
  faMoneyBill = faMoneyBill;
  paiementForm: FormGroup;
  mobile = false;

  // tslint:disable-next-line:max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private venteService: VenteService) { }

  ngOnInit() {

    if (window.screen.width < 500) { // 768px portrait
      this.mobile = true;
    }
    this.initPaiementForm();
    this.route.paramMap.subscribe(ParamsAsMap => {
      const id = ParamsAsMap.get('id');
      this.venteService.getVente(id).then((vente) => {
        this.vente = vente.data() as Vente;
        this.calcul();
        this.percu = this.sommePercue(this.vente);
        this.ventes.push(this.vente);
        this.initPaiementForm();
      });
    });
  }

  supprimer(vente: Vente) {
    const oui = confirm('Etes-vous sûrs de vouloir supprimer cette vente ?');
    if (oui) {
      this.venteService.deleteVente(vente);
    }
  }

  getDate(vente: Vente) {
    const x = vente['date'] as any;
    return new Date(x.seconds * 1000);
  }

  initPaiementForm() {
    this.paiementForm = this.formBuilder.group({
      montant: [this.net - this.percu, [Validators.required, Validators.max(this.net - this.percu)]]
    });
  }

  dateToFirestoreTimestamp(date: Date) {
    return firebase.firestore.Timestamp.fromDate(date);
  }

  onSubmitPaiementForm() {
    const formValue = this.paiementForm.value;
    if (this.vente.montantPercu) {
    } else {
      this.vente.montantPercu = [];
    }

    this.vente.montantPercu.push({
      date: this.dateToFirestoreTimestamp(new Date()) as unknown as Date,
      montant: formValue.montant
    });
    console.log('vente onject');
    console.log(this.vente);
    this.venteService.saveVente(this.vente).then(() => {
      this.venteService.getVente(this.vente.id).then((v) => {
        this.vente = v.data() as Vente;
        console.log('v.data()');
        console.log(v.data());
        const modal = $('#exampleModal') as any;
        modal.modal('hide');
        this.calcul();
        this.percu = this.sommePercue(this.vente);
        this.ventes = [];
        this.ventes.push(this.vente);
        this.initPaiementForm();
      });
    });
  }

  addPaiment() {

  }

  prix(va: VenteArticle) {
    return va.entree.prixVenteUnitaire * va.quantite;
  }

  calcul() {
    this.net = this.total(this.vente.ventesArticles) - this.vente.remise;
  }

  total(ventesArticles: VenteArticle[]) {
    let somme = 0;
    for (let i = 0; i < ventesArticles.length; i++) {
      somme += this.prix(ventesArticles[i]);
    }
    return somme;
  }

  sommePercue(vente: Vente) {
    let somme = 0;
    if (vente.montantPercu) {
      for (let i = 0; i < vente.montantPercu.length; i++) {
        somme += vente.montantPercu[i].montant;
      }
      return somme;
    } else {
      return this.total(vente.ventesArticles) - vente.remise;
    }
  }

  facture(vente: Vente) {
    this.router.navigate(['factures', 'view', vente.id]);
  }

}
