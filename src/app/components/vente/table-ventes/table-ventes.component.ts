import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Vente } from 'src/app/models/vente.model';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { VenteArticle } from 'src/app/models/vente.articles.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-ventes',
  templateUrl: './table-ventes.component.html',
  styleUrls: ['./table-ventes.component.scss']
})

export class TableVentesComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  @Input() ventes = new Array<Vente>();
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
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
  mobile = false;
  nombreDeChangement = 0;
  triggerHasBeenCalled = false;

  addClassTime = false;

  constructor(private router: Router) {
    console.log('Muanza Kangudie');
    console.log(this.ventes);
  }

  ngOnInit() {
    this.dtTrigger.subscribe(() => {
      console.log('le trigger a été appelé');
      this.triggerHasBeenCalled = true;
      this.addClassTime = true;
    });
    if (window.screen.width < 500) { // 768px portrait
      this.mobile = true;
      this.dtOptions.lengthChange = false;
    }
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('Muanza Kangudie');
    // console.log(this.ventes);
    // this.dtTrigger.next();
    if (!this.triggerHasBeenCalled) {
      this.dtTrigger.next();
    } else {
      // this.rerender();
    }
    // this.rerender();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy(false);
      this.dtTrigger.next();
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

  viewVente(v: Vente) {
    this.router.navigate(['ventes', 'view', v.id]);
  }

}
