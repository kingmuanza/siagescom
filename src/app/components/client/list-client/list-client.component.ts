import { Component, OnInit, OnDestroy } from '@angular/core';
import { DATATABLE_OPTIONS } from 'src/app/models/datatable.options';
import { Subject, Subscription } from 'rxjs';
import { Client } from 'src/app/models/client.model';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { faUser, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.scss']
})
export class ListClientComponent implements OnInit, OnDestroy {

  faUser = faUser;
  faPlus = faPlus;

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

  clients: Client[];
  clientsSubscription: Subscription;

  constructor(private clientService: ClientService, private router: Router) {

  }

  ngOnInit() {
    this.clientsSubscription = this.clientService.getAllClients().subscribe((clients) => {
      this.clients = clients;
      this.dtTrigger.next();
      console.log('this.clients');
      console.log(this.clients);
    });
  }

  viewClient(a: Client) {
    this.router.navigate(['clients', 'view', a.id]);
  }

  ngOnDestroy() {
    this.clientsSubscription.unsubscribe();
  }
}
