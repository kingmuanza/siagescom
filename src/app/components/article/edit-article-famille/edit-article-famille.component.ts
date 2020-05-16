import { Component, OnInit, OnDestroy } from '@angular/core';
import { StockService } from 'src/app/services/stock.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { ArticleFamille } from 'src/app/models/article.famille.model';
import * as uuid from 'uuid';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/models/article.model';

@Component({
  selector: 'app-edit-article-famille',
  templateUrl: './edit-article-famille.component.html',
  styleUrls: ['./edit-article-famille.component.scss']
})
export class EditArticleFamilleComponent implements OnInit, OnDestroy {

  famille: ArticleFamille;
  familleForm: FormGroup;
  familles = [];
  famillessSubscription: Subscription;
  inactif = false;
  articles: Article[];
  articlesSubscription: Subscription;

  // tslint:disable-next-line:max-line-length
  constructor(private us: UtilisateurService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private articleService: StockService) { }

  ngOnInit() {
    this.initForm();
    this.route.paramMap.subscribe(ParamsAsMap => {
      const id = ParamsAsMap.get('id');
      if (id) {
        this.articleService.getFamille(id).then((famille) => {
          this.famille = famille.data() as ArticleFamille;
          this.initForm();
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
            console.log('this.articles');
            console.log(this.articles);
          });
          this.articleService.emitArticles();
        });
      }
    });
    this.famillessSubscription = this.articleService.getAllFamilles().subscribe((familles) => {
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
  }

  initForm() {
    this.familleForm = this.formBuilder.group({
      ref: [this.famille ? this.famille.ref : '', []],
      libelle: [this.famille ? this.famille.libelle : '', [Validators.required]],
      parent: [this.famille ? this.famille.parent : '', []]
    });
  }

  onSubmitForm() {
    this.inactif = true;
    const formValue = this.familleForm.value;
    const ref = formValue['ref'] ? formValue['ref'] : uuid.v4().split('-')[0];
    let famille: ArticleFamille;
    if (this.famille) {
      famille = this.famille;
      famille.libelle = formValue.ref;
      famille.ref = formValue.libelle;
      famille.parent = formValue.parent;

    } else {
      famille = new ArticleFamille(
        ref,
        formValue.libelle
      );
      famille.parent = formValue.parent;
    }

    famille.entreprise = this.us.entreprise;
    famille.utilisateur = this.us.utilisateur;

    console.log(famille);
    this.articleService.saveFamille(famille).then((a) => {
      this.inactif = false;
      this.router.navigate(['familles', 'view', famille.id]);
    });
  }

  supprimerFamille(famille) {
    const oui = confirm('Etes-vous sûr de supprimer la famille d\'article ?');
    if (oui) {
      if (this.articles.length > 0) {
        // tslint:disable-next-line:max-line-length
        alert('Impossible de supprimer la famille d\'articles vu qu\'elle contient des articles. Veuillez supprimer ses articles au préalable !');
      } else {
        this.articleService.deleteFamille(famille).then((a) => {
          this.router.navigate(['familles']);
        });
      }
    }
  }

  ngOnDestroy() {
    this.famillessSubscription.unsubscribe();
  }
}

