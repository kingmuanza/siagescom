import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticleFamille } from 'src/app/models/article.famille.model';
import { Router, ActivatedRoute } from '@angular/router';
import { StockService } from 'src/app/services/stock.service';
import { Article } from 'src/app/models/article.model';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import * as uuid from 'uuid';
import { Entree } from 'src/app/models/entree.model';
import { AchatService } from 'src/app/services/achat.service';

@Component({
  selector: 'app-view-article-famille',
  templateUrl: './view-article-famille.component.html',
  styleUrls: ['./view-article-famille.component.scss']
})
export class ViewArticleFamilleComponent implements OnInit, OnDestroy {

  famille: ArticleFamille;
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

  articles: Article[];
  articlesSubscription: Subscription;

  inactif = false;
  article: Article;
  articleForm: FormGroup;

  sousFamilleForm: FormGroup;

  sousFamilles = new Array<ArticleFamille>();

  constructor(
    private us: UtilisateurService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private achatService: AchatService,
    private articleService: StockService) { }

  ngOnInit() {
    this.initArticleForm();
    this.initSousFamilleForm();
    this.route.paramMap.subscribe(ParamsAsMap => {
      const id = ParamsAsMap.get('id');
      this.articleService.getFamille(id).then((famille) => {
        this.famille = famille.data() as ArticleFamille;
        this.initArticleForm();
        this.initSousFamilleForm();
        this.articlesSubscription = this.articleService.getAllArticles().subscribe((articles) => {
          this.articles = articles.filter((article) => {
            if (article.famille) {
              if (article.famille.id === famille.id) {
                return article.famille.id === famille.id;
              } else {
                if (article.famille.parent) {
                  return article.famille.parent.id === famille.id;
                }
              }
            }
            return false;
          });
          this.dtTrigger.next();
          console.log('this.articles');
          console.log(this.articles);
        });
        this.articleService.getAllFamilles().subscribe(familles => {
          this.sousFamilles = familles.filter((f) => {
            if (f.parent) {
              return f.parent.id === this.famille.id;
            }
            return false;
          });
        });
        this.articleService.emitArticles();
      });
    });
  }

  ouvrirSousFamille(sf: ArticleFamille) {
    this.router.navigate(['familles', 'view', sf.id]);
  }

  edit(famille: ArticleFamille) {
    this.router.navigate(['familles', 'edit', famille.id]);
  }

  viewArticle(a: Article) {
    this.router.navigate(['articles', 'view', a.id]);
  }

  modifier(a: Article) {
    this.router.navigate(['articles', 'edit', a.id]);
  }

  supprimerArticle(article: Article) {
    const oui = confirm('Etes-vous sûr de supprimer l\'article ?');
    if (oui) {
      this.articleService.deleteArticle(article).then((a) => {
        this.router.navigate(['familles', 'view', this.famille.id]);
      });
    }
  }

  initSousFamilleForm() {
    this.sousFamilleForm = this.formBuilder.group({
      ref: ['', []],
      libelle: ['', [Validators.required]],
      parent: [this.famille ? this.famille : '', []]
    });
  }

  onSousFamilleSubmitForm() {
    this.inactif = true;
    const formValue = this.sousFamilleForm.value;
    const ref = formValue['ref'] ? formValue['ref'] : uuid.v4().split('-')[0];
    let sousfamille: ArticleFamille;

    sousfamille = new ArticleFamille(ref, formValue.libelle);
    sousfamille.parent = formValue.parent;
    sousfamille.entreprise = this.us.entreprise;
    sousfamille.utilisateur = this.us.utilisateur;

    console.log(sousfamille);
    this.articleService.saveFamille(sousfamille).then((a) => {
      this.initSousFamilleForm();
      this.inactif = false;
      const modal = $('#sousFamilleModal') as any;
      modal.modal('hide');
      this.router.navigate(['familles', 'view', this.famille.id]);

    });
  }

  initArticleForm() {
    this.articleForm = this.formBuilder.group({
      ref: [this.article ? this.article.ref : '', []],
      qte: [0, []],
      prixAchat: [0, []],
      prixVente: [0, []],
      libelle: [this.article ? this.article.libelle : '', [Validators.required]],
      description: [this.article ? this.article.description : '', []],
      famille: [this.famille ? this.famille : '', []]
    });
  }

  onSubmitArticleForm() {
    this.inactif = true;
    const formValue = this.articleForm.value;
    const ref = formValue['ref'] ? formValue['ref'] : uuid.v4().split('-')[0];
    let article: Article;
    article = new Article(
      ref,
      formValue['libelle'],
      formValue['description'],
      formValue['famille']
    );
    let achat: Entree;
    achat = new Entree(article, formValue.prixAchat, formValue.prixVente, formValue.qte, new Date());
    achat.entreprise = this.us.entreprise;
    article.entreprise = this.us.entreprise;
    this.articleService.saveArticle(article).then((a) => {
      this.initArticleForm();
      this.inactif = false;
      const modal = $('#articleModal') as any;
      modal.modal('hide');

      achat = JSON.parse(JSON.stringify(achat));
      this.achatService.saveEntree(achat).then(() => {
        console.log('achat skskkss');
        console.log(achat);
        this.router.navigate(['familles', 'view', this.famille.id]);
      });
    }).catch((e) => {
      console.log(e);
    });
  }


  ngOnDestroy() {
    this.articlesSubscription.unsubscribe();
  }


}
