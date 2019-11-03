import { Component, OnInit } from '@angular/core';
import { VenteArticle } from 'src/app/models/vente.articles.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Vente } from 'src/app/models/vente.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AchatService } from 'src/app/services/achat.service';
import { Entree } from 'src/app/models/entree.model';
import * as uuid from 'uuid';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { VenteService } from 'src/app/services/vente.service';
import { Promotion } from 'src/app/models/promotion.model';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { faShoppingCart, faSearch, faPlus, faRedo } from '@fortawesome/free-solid-svg-icons';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-edit-vente',
  templateUrl: './edit-vente.component.html',
  styleUrls: ['./edit-vente.component.scss']
})
export class EditVenteComponent implements OnInit {

  faPlus = faPlus;
  faSearch = faSearch;
  faRedo = faRedo;

  venteArticles: VenteArticle;
  ventesArticles = new Array<VenteArticle>();
  entrees: Entree[];
  ENTREES: Entree[];

  vente: Vente;
  vaForm: FormGroup;
  remiseForm: FormGroup;
  remise = 0;
  net = 0;
  percu = 0;
  promotions: Promotion[];
  promotion: Promotion;

  clients: Client[];
  client: Client;

  showClientForm = false;
  rechercherNom;

  clientForm: FormGroup;

  utilisateur: Utilisateur;

  mobile = false;
  quantiteRaisonnable = false;

  // tslint:disable-next-line:max-line-length
  constructor(private clientService: ClientService, private venteService: VenteService, private uS: UtilisateurService, private achatService: AchatService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  rechercherClient() {

  }

  ngOnInit() {
    if (window.screen.width < 500) { // 768px portrait
      this.mobile = true;
    }
    this.utilisateur = this.uS.utilisateur;
    this.initForm();
    this.vaForm.valueChanges.pipe().subscribe((value) => {
      console.log('value');
      console.log(value);
      const entrees = new Array<Entree>();
      for (let i = 0; i < this.ENTREES.length; i++) {
        const entree = this.ENTREES[i];
        /*console.log('entree.article.libelle');
        console.log(entree.article.libelle);
        console.log(entree.article.libelle.indexOf(value.rechercher));*/
        if (entree.article.libelle.indexOf(value.rechercher) > -1) {
          entrees.push(entree);
          console.log('entree.quantiteActuelle');
          console.log(entree.quantiteActuelle);
        }
      }
      console.log('value.article.quantiteActuelle');
      console.log(value.article.quantiteActuelle);
      console.log('value.quantite');
      console.log(value.quantite);
      this.entrees = entrees;
      if (value.article.quantiteActuelle && value.quantite) {
        if (value.article.quantiteActuelle < value.quantite) {
          this.quantiteRaisonnable = false;
        }
        if (value.quantite < 1) {
          this.quantiteRaisonnable = false;
        }
        if (value.article.quantiteActuelle >= value.quantite && value.quantite > 0) {
          this.quantiteRaisonnable = true;
        }
      }
    });
    this.initRemiseForm();
    this.initClientForm();
    this.route.paramMap.subscribe(ParamsAsMap => {
      const id = ParamsAsMap.get('id');
      this.achatService.getAllEntrees().subscribe((entrees: Entree[]) => {
        this.entrees = entrees;
        this.ENTREES = entrees;
      });
      this.achatService.emitEntrees();
    });
    this.venteService.getAllPromotions().subscribe((promotions: Promotion[]) => {
      this.promotions = promotions;
      this.promotion = this.venteService.getPromotionEnCours(this.promotions);
      console.log('this.promotions');
      console.log(this.promotions);
      console.log('this.promotion');
      console.log(this.promotion);
    });
    this.venteService.emitPromotions();
    this.clientService.getAllClients().subscribe((clients: Client[]) => {
      console.log('this.clients');
      console.log(this.clients);
      this.clients = clients;
    });
    this.clientService.emitClients();
  }

  setLibelleToNLength(libelle: string) {
    return libelle.toUpperCase();
  }

  initForm() {
    this.vaForm = this.formBuilder.group({
      rechercher: ['', []],
      article: [this.venteArticles ? this.venteArticles.entree : '', [Validators.required]],
      quantite: [this.venteArticles ? this.venteArticles.quantite : '', [Validators.required]]
    });
  }
  initRemiseForm() {
    this.remiseForm = this.formBuilder.group({
      remise: [this.montantRemiseMax(this.ventesArticles), [Validators.required]]
    });
  }
  initClientForm() {
    this.clientForm = this.formBuilder.group({
      nomComplet: ['', []],
      code: ['', []],
      tel: ['', [Validators.required]],
      mail: ['', [Validators.email]]
    });
  }

  retrancherQuantite(entree: Entree, quantite: number) {
    for (let i = 0; i < this.entrees.length; i++) {
      const e = this.entrees[i];
      if (e.id === entree.id) {
        this.entrees[i].quantiteActuelle -= quantite;
      }
    }
  }

  remettreQuantite(entree: Entree, quantite: number) {
    for (let i = 0; i < this.entrees.length; i++) {
      const e = this.entrees[i];
      if (e.id === entree.id) {
        this.entrees[i].quantiteActuelle += quantite;
      }
    }
  }

  onSubmitForm() {
    const formValue = this.vaForm.value;
    const ligne = new VenteArticle(formValue.article, formValue.quantite);
    console.log(ligne);
    this.ventesArticles.push(ligne);
    this.initForm();
    this.initRemiseForm();
    this.calcul();
    this.retrancherQuantite(formValue.article, formValue.quantite);
  }

  retirer(va: VenteArticle) {
    const ventesArticles = new Array<VenteArticle>();
    for (let i = 0; i < this.ventesArticles.length; i++) {
      if (this.ventesArticles[i].id === va.id) {

      } else {
        ventesArticles.push(this.ventesArticles[i]);
      }
    }
    this.ventesArticles = ventesArticles;
    this.initForm();
    this.initRemiseForm();
    this.calcul();
    this.remettreQuantite(va.entree, va.quantite);
  }

  calcul() {
    this.net = this.total(this.ventesArticles) - this.remise;
    this.percu = this.net;
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

  montantRemiseMax(ventesArticles: VenteArticle[]) {
    const pourcentage = this.uS.utilisateur.pourcentageRemise;
    if (this.promotion) {
      return (pourcentage + this.promotion.pourcentageRemise) * 0.01 * this.total(ventesArticles);
    } else {
      return pourcentage * 0.01 * this.total(ventesArticles);
    }

  }

  calculResteAPayer() {
    console.log('Calcul du reste à payer');
  }


  onRemiseForm() {
    console.log('onRemiseForm');
    this.vente = new Vente(uuid.v4().split('-')[0], this.ventesArticles, new Date(), this.remise);
    const ventesArticles = this.vente.ventesArticles.map((obj) => {
      return Object.assign({}, obj);
    });
    this.vente.ventesArticles = ventesArticles;
    this.vente.entreprise = this.uS.entreprise;
    this.vente.utilisateur = this.uS.utilisateur;
    this.vente.syncEntrees();

    this.vente.montantPercu = [];
    this.vente.montantPercu.push({
      date: new Date(),
      montant: this.percu
    });

    if (this.client) {
      console.log('this.client');
      console.log(this.client);
      this.vente.client = Object.assign({}, this.client);
      console.log(Object.assign({}, this.client));
    }

    this.venteService.saveVente(this.vente).then(() => {
      this.router.navigate(['ventes', 'view', this.vente.id]);
    });
  }

  onSubmitClientForm() {
    console.log('onSubmitClientForm');
    const formValue = this.clientForm.value;
    let client: Client;

    client = new Client(
      formValue['nomComplet'],
      formValue['tel'],
      formValue['mail']
    );
    console.log('client');
    console.log(client);

    client.entreprise = this.uS.entreprise;
    client.utilisateur = this.uS.utilisateur;
    this.clientService.saveClient(client).then((a) => {
      console.log('abccccc');
      console.log(a);
      this.clients.push(client);
      this.client = client;
      const modal = $('#exampleModal') as any;
      modal.modal('hide');
    });
  }

}
