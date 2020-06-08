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
import { Article } from 'src/app/models/article.model';
import { StockService } from 'src/app/services/stock.service';
import { ArticleFamille } from 'src/app/models/article.famille.model';
import { Subscription } from 'rxjs';

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
  entreesLoaded = false;

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

  openAlert = true;

  familles: ArticleFamille[];
  famillesSubscription: Subscription;

  articleReady = '-1';


  // tslint:disable-next-line:max-line-length
  constructor(
    private clientService: ClientService,
    private venteService: VenteService,
    private uS: UtilisateurService,
    private achatService: AchatService,
    private router: Router,
    private articleService: StockService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  rechercherClient() {

  }

  fermerAlert() {
    this.openAlert = false;
  }

  ngOnInit() {
    if (window.screen.width < 500) { // 768px portrait
      this.mobile = true;
    }

    this.famillesSubscription = this.articleService.getAllFamilles().subscribe((familles) => {
      this.familles = new Array<ArticleFamille>();
      console.log('this.familles');
      console.log(this.familles);
      const parents = familles.filter((famille) => {
        return famille.parent ? false : true;
      });
      parents.forEach((parent) => {
        this.familles.push(parent);
        familles.forEach((famille) => {
          if (famille.parent && famille.parent.id === parent.id) {
            this.familles.push(famille);
          }
        });
      });
    });

    this.utilisateur = this.uS.utilisateur;
    this.initForm();

    this.initRemiseForm();
    this.initClientForm();

    this.getAll();

    this.venteService.getAllPromotions().subscribe((promotions: Promotion[]) => {
      this.promotions = promotions;
      this.promotion = this.venteService.getPromotionEnCours(this.promotions);
      console.log('this.promotions');
      console.log(this.promotions);
      console.log('this.promotion');
      console.log(this.promotion);
    });

    this.clientService.getAllClients().subscribe((clients: Client[]) => {
      console.log('this.clients');
      console.log(this.clients);
      this.clients = clients;
    });
  }

  setLibelleToNLength(libelle: string) {
    return libelle.toUpperCase();
  }

  getAll() {
    this.achatService.getAllEntrees().subscribe((entrees: Entree[]) => {
      this.entrees = entrees;
      this.ENTREES = entrees;
      this.entreesLoaded = true;
      console.log('Les entrées ont été sauvegardées !!!');
    });
  }

  initForm() {
    this.vaForm = this.formBuilder.group({
      rechercher: ['', []],
      famille: ['', []],
      article: [this.venteArticles ? this.venteArticles.entree : '', [Validators.required]],
      quantite: [this.venteArticles ? this.venteArticles.quantite : '', [Validators.required]]
    });
    this.vaForm.get('famille').valueChanges.subscribe((val: ArticleFamille) => {
      console.log('famille val');
      console.log(val);
      if (val && val.id) {
        this.entrees = this.entrees.filter((entree) => {
          return entree.article.famille.id === val.id;
        });
        this.ENTREES = this.entrees;
      } else {
        this.getAll();
      }
    });
    this.vaForm.get('rechercher').valueChanges.subscribe((val2) => {
      this.entrees = this.ENTREES;
      console.log('val2 : ' + val2);
      if (val2) {
        this.entrees = this.entrees.filter((entree) => {
          return entree.article.libelle.toLowerCase().indexOf(val2) !== -1;
        });
        if (this.entrees.length > 0) {
          this.vaForm.get('article').setValue(this.entrees[0]);
        }
      }
    });
    this.vaForm.valueChanges.subscribe(() => {
      if (this.vaForm.value.article.quantite >= this.vaForm.value.quantite) {
        if (this.vaForm.value.quantite > 0) {
          this.quantiteRaisonnable = true;
        }
      } else {
        this.quantiteRaisonnable = false;
      }
    });
  }

  selectionner(i) {
    this.vaForm.get('article').setValue(this.entrees[i]);
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
    this.retrancherQuantite(formValue.article, formValue.quantite);
    const ligne = new VenteArticle(formValue.article, formValue.quantite);
    console.log('ligne');
    console.log(ligne);
    this.ventesArticles.push(ligne);
    this.initForm();
    this.initRemiseForm();
    this.calcul();
  }

  isPresent(entree: Entree) {
    for (let i = 0; i < this.ventesArticles.length; i++) {
      const va = this.ventesArticles[i];
      if (va.entree.id === entree.id) {
        return true;
      }
    }
    return false;
  }

  isReady(entree: Entree) {
    if (this.vaForm.value.article.id === entree.id) {
      return true;
    } else {
      return false;
    }
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

  articleEstDansLaFamilleDePromotion(article: Article, promotion: Promotion) {
    if (promotion.familles) {
      for (let i = 0; i < promotion.familles.length; i++) {
        const famille = promotion.familles[i];
        if (article.famille) {
          if (famille.id === article.famille.id) {
            return true;
          }
        } else {
          return false;
        }
      }
      return false;
    }
    return true;
  }

  montantRemiseMax(ventesArticles: VenteArticle[]) {
    console.log('montantRemiseMax');
    const pourcentage = this.uS.utilisateur.pourcentageRemise;
    if (this.promotion) {
      console.log('promotion');
      if (this.promotion.familles) {
        console.log('la promotion a des familles');
        const ventesArticles2 = [];
        console.log(ventesArticles);
        for (let i = 0; i < ventesArticles.length; i++) {
          const va = ventesArticles[i];
          console.log('va.entree.article');
          console.log(va.entree.article);
          if (this.articleEstDansLaFamilleDePromotion(va.entree.article, this.promotion)) {
            console.log('L\'article est dans famille');
            ventesArticles2.push(va);
            console.log('ventesArticles2');
            console.log(ventesArticles2);
          }
        }
        return (this.promotion.pourcentageRemise) * 0.01 * this.total(ventesArticles2);
      } else {
        return (this.promotion.pourcentageRemise) * 0.01 * this.total(ventesArticles);
      }

    } else {
      // console.log('Aucune promotion');
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

  showDate(date) {
    if (date.seconds) {
      return new Date(date.seconds * 1000);
    } else {
      return new Date(date);
    }
  }

}
