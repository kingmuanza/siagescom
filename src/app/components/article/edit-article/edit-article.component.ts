import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article.model';
import { StockService } from 'src/app/services/stock.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as uuid from 'uuid';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { ArticleFamille } from 'src/app/models/article.famille.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements OnInit {

  article: Article;
  articleForm: FormGroup;
  familles: ArticleFamille[];
  famillesSubscription: Subscription;

  // tslint:disable-next-line:max-line-length
  constructor(private us: UtilisateurService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private articleService: StockService) { }

  ngOnInit() {
    this.initForm();
    this.famillesSubscription = this.articleService.getAllFamilles().subscribe((familles) => {
      this.familles = familles;
      console.log('this.familles');
      console.log(this.familles);
    });
    this.route.paramMap.subscribe(ParamsAsMap => {
      const id = ParamsAsMap.get('id');
      this.articleService.getArticle(id).then((article) => {
        this.article = article.data() as Article;
        this.initForm();
      });
    });
  }

  initForm() {
    this.articleForm = this.formBuilder.group({
      ref: [this.article ? this.article.ref : '', []],
      libelle: [this.article ? this.article.libelle : '', [Validators.required]],
      description: [this.article ? this.article.description : '', []],
      famille: [this.article ? this.article.famille : '', []]
    });
  }

  onSubmitForm() {
    const formValue = this.articleForm.value;
    const ref = formValue['ref'] ? formValue['ref'] : uuid.v4().split('-')[0];
    let article: Article;
    if (this.article) {
      article = this.article;
      article.libelle = formValue['libelle'];
      article.ref = formValue['ref'];
      article.description = formValue['description'];
      article.famille = formValue['famille'];

    } else {
      article = new Article(
        ref,
        formValue['libelle'],
        formValue['description'],
        formValue['famille']
      );
    }

    article.entreprise = this.us.entreprise;
    this.articleService.saveArticle(article).then((a) => {
      this.router.navigate(['articles', 'view', article.id]);
    });
  }

  supprimerArticle(article) {
    const oui = confirm('Etes-vous sûr de supprimer l\'article ?');
    if (oui) {
      this.articleService.deleteArticle(article).then((a) => {
        this.router.navigate(['articles']);
      });
    }
  }


}
