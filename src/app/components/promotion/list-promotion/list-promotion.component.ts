import { Component, OnInit, OnDestroy } from '@angular/core';
import { DATATABLE_OPTIONS } from 'src/app/models/datatable.options';
import { Subject, Subscription } from 'rxjs';
import { VenteService } from 'src/app/services/vente.service';
import { Promotion } from 'src/app/models/promotion.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-promotion',
  templateUrl: './list-promotion.component.html',
  styleUrls: ['./list-promotion.component.scss']
})
export class ListPromotionComponent implements OnInit, OnDestroy {

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

  promotions: Promotion[];
  promotionsSubscription: Subscription;

  constructor(private promotionService: VenteService, private router: Router) {

  }

  ngOnInit() {
    this.promotionsSubscription = this.promotionService.getAllPromotions().subscribe((promotions) => {
      this.promotions = promotions as Promotion[];
      this.dtTrigger.next();
      console.log('this.promotions');
      console.log(this.promotions);
    });
  }

  viewPromotion(a: Promotion) {
    this.router.navigate(['promotions', 'edit', a.id]);
  }

  ngOnDestroy() {
    this.promotionsSubscription.unsubscribe();
  }
}
