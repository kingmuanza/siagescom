import { Component, OnInit, OnDestroy } from '@angular/core';
import { faShoppingCart, faUsers, faPlus, faRedo } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Vente } from 'src/app/models/vente.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { VenteService } from 'src/app/services/vente.service';
import { VenteArticle } from 'src/app/models/vente.articles.model';
@Component({
  selector: 'app-avances',
  templateUrl: './avances.component.html',
  styleUrls: ['./avances.component.scss']
})
export class AvancesComponent implements OnInit, OnDestroy {


  faShoppingCart = faShoppingCart;
  faUsers = faUsers;
  faPlus = faPlus;
  faRedo = faRedo;

  rechercheForm: FormGroup;

  ventes: Vente[];
  VENTES: Vente[];
  ventesSubscription: Subscription;
  ventesSubscription2: Subscription;
  mobile = false;

  constructor(private formBuilder: FormBuilder, private venteService: VenteService, private router: Router) {

  }

  ngOnInit() {
    if (window.screen.width < 500) { // 768px portrait
      this.mobile = true;
    }
    this.initForm();
    this.ventes = [];
    this.ventesSubscription = this.venteService.getAllCreances().subscribe((ventes) => {
      for (let i = 0; i < ventes.length; i++) {
        const vente = ventes[i];
        if (this.sommePercue(vente) < this.total(vente.ventesArticles) - this.remise(vente)) {
          this.ventes.push(vente);
        }
      }
      this.VENTES = this.ventes;

      console.log('this.ventes');
      console.log(this.ventes);
    });
  }

  initForm() {
    this.rechercheForm = this.formBuilder.group({
      debut: [new Date().toISOString().split('T')[0], [Validators.required]],
      fin: [new Date().toISOString().split('T')[0], [Validators.required]]
    });
  }

  onSubmitForm() {
    const formValue = this.rechercheForm.value;
    const d = formValue.debut;
    const debut = new Date(d + ' 00:00:00');
    const f = formValue.fin;
    const fin = new Date(f + ' 23:59:59');
    /* console.log('debut');
    console.log(debut);
    console.log('fin');
    console.log(fin); */

    this.VENTES = this.ventesEntreDeuxDates(this.ventes, debut, fin);
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


  getTotal(ventes: Array<Vente>) {
    let total = 0;
    for (let i = 0; i < ventes.length; i++) {
      const vente = ventes[i];
      total += this.total(vente.ventesArticles) - vente.remise;
    }
    return total;
  }
  getTotalArticles(ventes: Array<Vente>) {
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
    let total = 0;
    for (let i = 0; i < ventes.length; i++) {
      const vente = ventes[i];
      total += this.total(vente.ventesArticles) - this.remise(vente) - this.sommePercue(vente);
    }
    return total;
  }

  getRemises(ventes: Array<Vente>) {

    let total = 0;
    for (let i = 0; i < ventes.length; i++) {
      const vente = ventes[i];
      total += vente.remise;
    }
    return total;

  }



  reinit() {
    this.VENTES = this.ventes;
  }

  ventesEntreDeuxDates(ventes: Vente[], debut: Date, fin: Date) {
    console.log('ventesEntreDeuxDates');
    console.log('debut');
    console.log(debut);
    console.log('fin');
    console.log(fin);
    const VENTES = new Array<Vente>();
    for (let i = 0; i < ventes.length; i++) {
      const vente = ventes[i];
      console.log('vente.date');
      console.log(vente.date);
      const date = vente.date as any;
      console.log('date.toDate()');
      console.log(date.toDate());
      if (date.toDate() > debut && date.toDate() < fin) {
        VENTES.push(vente);
      }
    }
    return VENTES;
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
