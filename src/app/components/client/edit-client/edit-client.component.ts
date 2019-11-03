import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent implements OnInit {

  client: Client;
  clientForm: FormGroup;
  familles = [];

  // tslint:disable-next-line:max-line-length
  constructor(private us: UtilisateurService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private clientService: ClientService) { }

  ngOnInit() {
    this.initForm();
    this.route.paramMap.subscribe(ParamsAsMap => {
      const id = ParamsAsMap.get('id');
      if (id) {
        this.clientService.getClient(id).then((client) => {
          this.client = client.data() as Client;
          this.initForm();
        });
      }
    });
  }

  initForm() {
    this.clientForm = this.formBuilder.group({
      nomComplet: [this.client ? this.client.nomComplet : '', []],
      code: [this.client ? this.client.code : '', []],
      tel: [this.client ? this.client.tel : '', [Validators.required]],
      mail: [this.client ? this.client.mail : '', [Validators.email]]
    });
  }

  onSubmitForm() {
    const formValue = this.clientForm.value;
    let client: Client;
    if (this.client) {
      client = this.client;
      client.nomComplet = formValue['nomComplet'];
      client.code = formValue['code'];
      client.tel = formValue['tel'];
      client.mail = formValue['mail'];

    } else {
      client = new Client(
        formValue['nomComplet'],
        formValue['tel'],
        formValue['mail']
      );
    }

    client.entreprise = this.us.entreprise;
    client.utilisateur = this.us.utilisateur;
    this.clientService.saveClient(client).then((a) => {
      this.router.navigate(['clients', 'view', client.id]);
    });
  }
}
