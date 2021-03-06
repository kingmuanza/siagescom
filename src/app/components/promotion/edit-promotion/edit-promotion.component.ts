import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Promotion } from 'src/app/models/promotion.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { StockService } from 'src/app/services/stock.service';
import { VenteService } from 'src/app/services/vente.service';
import { ArticleFamille } from 'src/app/models/article.famille.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-promotion',
  templateUrl: './edit-promotion.component.html',
  styleUrls: ['./edit-promotion.component.scss']
})
export class EditPromotionComponent implements OnInit {

  promotionForm: FormGroup;
  promotion: Promotion;
  familles: ArticleFamille[];
  famillesSubscription: Subscription;

  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private us: UtilisateurService, private router: Router, private formBuilder: FormBuilder, private articleService: StockService, private promotionService: VenteService) { }

  ngOnInit() {
    this.initForm();
    this.famillesSubscription = this.articleService.getAllFamilles().subscribe((familles) => {
      this.familles = familles;
      console.log('this.familles');
      console.log(this.familles);
    });
    this.route.paramMap.subscribe(ParamsAsMap => {
      const id = ParamsAsMap.get('id');
      if (id) {
        this.promotionService.getPromotion(id).then((promotion) => {
          console.log(promotion.data());
          this.promotion = promotion.data() as Promotion;
          console.log('this.promotion');
          console.log(this.promotion);
          this.initForm();
        });
      }
    });
  }

  formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }

    return [year, month, day].join('-');
  }


  promotionHasArticleFamille(articleFamille: ArticleFamille) {
    for (let i = 0; i < this.promotion.familles.length; i++) {
      const a = this.promotion.familles[i];
      if (a.id === articleFamille.id) {
        return true;
      }
    }
    return false;
  }

  setUtilisateurArticleFamilles() {
    const articleFamilles = [];
    for (let i = 0; i < this.familles.length; i++) {
      const a = this.familles[i];
      if (this.promotionHasArticleFamille(a)) {
        articleFamilles.push(a);
      }
    }
    return articleFamilles;
  }

  initForm() {
    this.promotionForm = this.formBuilder.group({
      debut: [this.promotion ? this.promotion.dateDebut : this.formatDate(new Date()), [Validators.required]],
      fin: [this.promotion ? this.promotion.dateFin : this.formatDate(new Date()), [Validators.required]],
      pourcentage: [this.promotion ? this.promotion.pourcentageRemise : '', [Validators.required]],
      libelle: [this.promotion ? this.promotion.libelle : '', []],
      familles: [this.promotion ? this.promotion.familles : '', []]
    });
    if (this.promotion) {
      this.promotionForm.controls.familles.setValue(this.setUtilisateurArticleFamilles());
    }
  }

  modifier() {
    const formValue = this.promotionForm.value;
    if (this.promotion) {
      this.promotion.dateDebut = formValue.debut;
      this.promotion.dateFin = formValue.fin;
      this.promotion.pourcentageRemise = formValue.pourcentage;
      this.promotion.familles = formValue.familles;
      this.promotion.libelle = formValue.libelle;
    } else {
      this.promotion = new Promotion(formValue.debut, formValue.fin, formValue.pourcentage);
      this.promotion.familles = formValue.familles;
      this.promotion.libelle = formValue.libelle;
    }
    this.promotion.entreprise = this.us.entreprise;
    this.promotion.utilisateur = this.us.utilisateur;
    this.promotionService.savePromotion(this.promotion).then(() => {
      this.router.navigate(['promotions']);
    });
    console.log(formValue);
  }

  onSubmitForm(action) {
    if (action === 'modifier') {
      this.modifier();
    }
    if (action === 'supprimer') {
      this.supprimerPromotion(this.promotion);

    }
  }

  supprimerPromotion(promotion: Promotion) {
    if (confirm('Etes-vous sûr de vouloir supprimer cette promotion ?')) {
      this.promotionService.deletePromotion(promotion).then((x) => {
        console.log('x');
        console.log(x);
        this.router.navigate(['promotions']);
      });
    }
  }
}
