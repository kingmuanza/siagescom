import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DATATABLE_OPTIONS } from 'src/app/models/datatable.options';
import { Subject, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Vente } from 'src/app/models/vente.model';
import { Router } from '@angular/router';
import { VenteService } from 'src/app/services/vente.service';
import { VenteArticle } from 'src/app/models/vente.articles.model';
import { DataTableDirective } from 'angular-datatables';
import { BaseChartDirective } from 'ng2-charts';
import { Promotion } from 'src/app/models/promotion.model';
import { faShoppingCart, faUsers, faPlus, faRedo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  @ViewChild(BaseChartDirective, { static: false })
  public chart: BaseChartDirective;

  faShoppingCart = faShoppingCart;
  faUsers = faUsers;
  faPlus = faPlus;
  faRedo = faRedo;

  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    { data: [0, 0, 0, 0, 0, 0, 0], label: 'Montant perçu' }
  ];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  dtOptions: DataTables.Settings = DATATABLE_OPTIONS;
  dtTrigger = new Subject();
  rechercheForm: FormGroup;

  ventes: Vente[];
  VENTES: Vente[];

  TOTAL = 0;
  TOTAL_ARTICLES = 0;
  RESTE_A_PAYER = 0;
  REMISES = 0;

  DERNIERS_JOURS = 30;

  ventesSubscription: Subscription;
  ventesSubscription2: Subscription;

  promotion: Promotion;
  promotions: Promotion[];

  constructor(private formBuilder: FormBuilder, private venteService: VenteService, private router: Router) {
    this.venteService.getNDerniersJours();
  }


  toLabels(dates: Array<Date>) {
    const labels = [];
    for (let i = 0; i < dates.length; i++) {
      labels.push(dates[i].toISOString().split('T')[0].substring(5, 10).replace('-', '/'));
    }
    console.log(labels);
    return labels;
  }

  getData(ventes: Array<Vente>, dates: Array<Date>) {
    const data = [];
    for (let i = 0; i < dates.length; i++) {
      const ventesDuJour = this.venteService.getVentesDuJour(ventes, dates[i]);
      console.log('ventesDuJour');
      console.log(ventesDuJour);
      data.push(this.getTotal(ventesDuJour));
    }
    console.log('data');
    console.log(data);
    return data;
  }

  ngOnInit() {

    this.venteService.getAllPromotions().subscribe((promotions: Promotion[]) => {
      this.promotions = promotions;
      this.promotion = this.venteService.getPromotionEnCours(this.promotions);
      console.log('this.promotions');
      console.log(this.promotions);
      console.log('this.promotion');
      console.log(this.promotion);
    });
    this.venteService.emitPromotions();

    this.initForm();
    this.rechercheForm.valueChanges.pipe().subscribe((value) => {
      console.log('value');
      console.log(value);
      this.onSubmitForm();
    });
    this.ventesSubscription = this.venteService.getAllVentes().subscribe((ventes) => {
      this.ventes = ventes;

      this.VENTES = ventes;
      this.dtTrigger.next();
      console.log('this.ventes');
      console.log(this.ventes);
      this.barChartLabels = this.toLabels(this.venteService.getNDerniersJours(this.DERNIERS_JOURS));
      console.log('this.venteService.getNDerniersJours()');
      console.log(this.venteService.getNDerniersJours());
      console.log('this.barChartData');
      console.log(this.barChartData);
      this.chart.chart.data.datasets[0].data = this.getData(ventes, this.venteService.getNDerniersJours(this.DERNIERS_JOURS));
      this.update();
      this.chart.chart.update();
    });
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
    return 0;
  }

  getRemises(ventes: Array<Vente>) {

    let total = 0;
    for (let i = 0; i < ventes.length; i++) {
      const vente = ventes[i];
      total += vente.remise;
    }
    return total;

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
    const f = formValue.fin;

    let debut = new Date('2019-01-01');
    let fin = new Date();
    if (d) {
      debut = new Date(d + ' 00:00:00');
    }
    if (f) {
      fin = new Date(f + ' 23:59:59');
    }
    console.log('debut');
    console.log(debut);
    console.log('fin');
    console.log(fin);

    this.VENTES = this.ventesEntreDeuxDates(this.ventes, debut, fin);
  }

  update() {
    this.TOTAL = this.getTotal(this.VENTES);
    this.TOTAL_ARTICLES = this.getTotalArticles(this.VENTES);
    this.RESTE_A_PAYER = this.getResteAPayer(this.VENTES);
    this.REMISES = this.getRemises(this.VENTES);
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
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
