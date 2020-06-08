import { Component, OnInit, OnDestroy } from '@angular/core';
import { DATATABLE_OPTIONS } from 'src/app/models/datatable.options';
import { Subject, Subscription } from 'rxjs';
import { Entree } from 'src/app/models/entree.model';
import { AchatService } from 'src/app/services/achat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-entree',
  templateUrl: './list-entree.component.html',
  styleUrls: ['./list-entree.component.scss']
})
export class ListEntreeComponent implements OnInit, OnDestroy {

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

  achats: Entree[];
  achatsSubscription: Subscription;

  constructor(private achatService: AchatService, private router: Router) {

  }

  getDate(achat: Entree) {
    const x = achat['date'] as any;
    if (x.sconds) {
      return new Date(x);
    } else {
      return new Date(x);
    }
  }

  ngOnInit() {
    this.achatsSubscription = this.achatService.getAllEntrees().subscribe((achats) => {
      this.achats = achats;
      this.dtTrigger.next();
      console.log('this.achats');
      console.log(this.achats);
    });
  }

  viewEntree(a: Entree) {
    this.router.navigate(['achats', 'view', a.id]);
  }

  ngOnDestroy() {
    this.achatsSubscription.unsubscribe();
  }


  showDate(date) {
    if (date.seconds) {
      return new Date(date.seconds * 1000);
    } else {
      return new Date(date);
    }
  }


}
