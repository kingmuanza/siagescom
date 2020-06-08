import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Entree } from 'src/app/models/entree.model';
import { Article } from 'src/app/models/article.model';
import { StockService } from 'src/app/services/stock.service';
import { Subscription } from 'rxjs';
import { AchatService } from 'src/app/services/achat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { ArticleFamille } from 'src/app/models/article.famille.model';

@Component({
  selector: 'app-edit-entree',
  templateUrl: './edit-entree.component.html',
  styleUrls: ['./edit-entree.component.scss']
})
export class EditEntreeComponent implements OnInit {

  achatForm: FormGroup;
  achat: Entree;
  articles: Article[];
  ARTICLES: Article[];
  articlesSubscription = new Subscription();

  familles: ArticleFamille[];
  famillesSubscription: Subscription;


  // tslint:disable-next-line:max-line-length
  constructor(
    private route: ActivatedRoute, private us: UtilisateurService,
    private router: Router,
    private formBuilder: FormBuilder,
    private articleService: StockService,
    private achatService: AchatService) { }

  ngOnInit() {
    this.initForm();
    console.log('articles');
    this.getAll();
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
    this.articleService.emitArticles();

  }


  initArticle() {
    for (let i = 0; i < this.articles.length; i++) {
      const article = this.articles[i];
      if (this.achat.article.id === article.id) {
        this.achat.article = article;
      }
    }
  }

  initForm() {
    this.achatForm = this.formBuilder.group({
      article: [this.achat ? this.achat.article : '', [Validators.required]],
      prixAchat: [this.achat ? this.achat.prixAchatUnitaire : 0, [Validators.required]],
      prixVente: [this.achat ? this.achat.prixVenteUnitaire : 0, [Validators.required]],
      quantite: [this.achat ? this.achat.quantite : 0, [Validators.required]],
      rechercher: ['', []],
      famille: ['', []],
    });

    this.achatForm.get('famille').valueChanges.subscribe((val: ArticleFamille) => {
      console.log('famille val');
      console.log(val);
      if (val && val.id) {
        this.articles = this.articles.filter((article) => {
          return article.famille.id === val.id;
        });
        this.ARTICLES = this.articles;
      } else {
      }
    });

    this.achatForm.get('prixAchat').valueChanges.subscribe((val2) => {
      const prixVente = Math.ceil(Number(val2) * (1.1925));
      this.achatForm.get('prixVente').setValue(prixVente);
    });

    this.achatForm.get('rechercher').valueChanges.subscribe((val2) => {
      this.articles = this.ARTICLES;
      console.log('val2 : ' + val2);
      if (val2) {
        this.articles = this.articles.filter((article) => {
          return article.libelle.toLowerCase().indexOf(val2) !== -1;
        });
        if (this.articles.length > 0) {
          this.achatForm.get('article').setValue(this.articles[0]);
        }
      }
    });
  }


  selectionner(i) {
    this.achatForm.get('article').setValue(this.articles[i]);
  }

  getAll() {
    this.articlesSubscription = this.articleService.getAllArticles().subscribe((articles: Article[]) => {
      console.log(articles);
      this.articles = articles;
      this.ARTICLES = articles;
      this.route.paramMap.subscribe(ParamsAsMap => {
        const id = ParamsAsMap.get('id');
        if (id) {
          this.achatService.getEntree(id).then((achat) => {
            console.log(achat.data());
            this.achat = achat.data() as Entree;
            console.log('this.achat');
            console.log(this.achat);
            this.initArticle();
            this.initForm();
          });
        }
      });
    });
  }

  modifier() {
    const formValue = this.achatForm.value;
    console.log(formValue);
    if (formValue.quantite > 0 && formValue.prixVenteUnitaire > 0) {
      if (this.achat) {
        this.achat.article = formValue.article;
        this.achat.prixAchatUnitaire = formValue.prixAchat;
        this.achat.prixVenteUnitaire = formValue.prixVente;
        this.achat.quantite = formValue.quantite;
      } else {
        this.achat = new Entree(formValue.article, formValue.prixAchat, formValue.prixVente, formValue.quantite, new Date());
      }
      console.log('this.achat');
      console.log(this.achat);
      this.achat.entreprise = this.us.entreprise;
      this.achat.utilisateur = this.us.utilisateur;
      this.achatService.saveEntree(this.achat).then(() => {
        this.router.navigate(['achats']);
      });
    } else {
      alert('Veuillez entrer des quantités et des prix valides');
    }

  }

  onSubmitForm(action) {
    console.log(action);
    console.log(this.achat);
    /*if (action === 'modifier') {
      this.modifier();
    }
    if (action === 'supprimer') {
      this.supprimerAchat(this.achat);

    }*/
  }

  supprimerAchat(achat: Entree) {
    if (confirm('Etes-vous sûr de vouloir supprimer cet achat ?')) {
      this.achatService.deleteEntree(achat).then((x) => {
        console.log('x');
        console.log(x);
        this.router.navigate(['achats']);
      });
    }
  }

  isSelected(entree: Entree) {
    if (this.achatForm.value.article.id === entree.id) {
      return true;
    } else {
      return false;
    }
  }


}
