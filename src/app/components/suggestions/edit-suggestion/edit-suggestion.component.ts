import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Suggestion } from 'src/app/models/suggestion.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { StockService } from 'src/app/services/stock.service';
import { VenteService } from 'src/app/services/vente.service';
import { SuggestionService } from 'src/app/services/suggestion.service';

@Component({
  selector: 'app-edit-suggestion',
  templateUrl: './edit-suggestion.component.html',
  styleUrls: ['./edit-suggestion.component.scss']
})
export class EditSuggestionComponent implements OnInit {

  SECTIONS = [
    'GLOBAL',
    'TABLEAU DE BORD',
    'VENTES',
    'CREANCES EN COURS',
    'PAIEMENTS',
    'PROMOTIONS',
    'CLIENTS',
    'ACHATS',
    'ARTICLES',
    'UTILISATEURS'
  ];

  suggestionForm: FormGroup;
  suggestion: Suggestion;

  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private us: UtilisateurService, private router: Router, private formBuilder: FormBuilder, private suggestionService: SuggestionService) { }

  ngOnInit() {
    this.initForm();
    this.route.paramMap.subscribe(ParamsAsMap => {
      const id = ParamsAsMap.get('id');
      if (id) {
        this.suggestionService.getSuggestion(id).then((suggestion) => {
          console.log(suggestion.data());
          this.suggestion = suggestion.data() as Suggestion;
          console.log('this.suggestion');
          console.log(this.suggestion);
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

  initForm() {
    this.suggestionForm = this.formBuilder.group({
      section: [this.suggestion ? this.suggestion.section : '', [Validators.required]],
      commentaire: [this.suggestion ? this.suggestion.commentaire : '', [Validators.required]]
    });
  }

  modifier() {
    const formValue = this.suggestionForm.value;
    if (this.suggestion) {
      this.suggestion.section = formValue.section;
      this.suggestion.commentaire = formValue.commentaire;
    } else {
      this.suggestion = new Suggestion(formValue.section, formValue.commentaire);
    }
    this.suggestion.entreprise = this.us.entreprise;
    this.suggestion.utilisateur = this.us.utilisateur;
    this.suggestion.date = new Date();
    this.suggestionService.saveSuggestion(this.suggestion).then(() => {
      this.router.navigate(['suggestions']);
    });
    console.log(formValue);
  }

  onSubmitForm(action) {
    if (action === 'modifier') {
      this.modifier();
    }
    if (action === 'supprimer') {
      this.supprimerSuggestion(this.suggestion);

    }
  }

  supprimerSuggestion(suggestion: Suggestion) {
    if (confirm('Etes-vous sûr de vouloir supprimer cette suggestion ?')) {
      this.suggestionService.deleteSuggestion(suggestion).then((x) => {
        console.log('x');
        console.log(x);
        this.router.navigate(['suggestions']);
      });
    }
  }
}
