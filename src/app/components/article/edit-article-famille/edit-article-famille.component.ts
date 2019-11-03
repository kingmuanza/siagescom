import { Component, OnInit, OnDestroy } from '@angular/core';
import { StockService } from 'src/app/services/stock.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { ArticleFamille } from 'src/app/models/article.famille.model';
import * as uuid from 'uuid';
import { Subscription } from 'rxjs';

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
        });
      }
    });
    this.famillessSubscription = this.articleService.getAllFamilles().subscribe((familles) => {
      this.familles = familles;
      console.log('this.familles');
      console.log(this.familles);
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
      this.router.navigate(['familles', 'view', famille.id]);
    });
  }

  ngOnDestroy() {
    this.famillessSubscription.unsubscribe();
  }
}

