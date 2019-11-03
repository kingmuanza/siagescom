import { Component, OnInit, OnDestroy } from '@angular/core';
import { DATATABLE_OPTIONS } from 'src/app/models/datatable.options';
import { Subject, Subscription } from 'rxjs';
import { Suggestion } from 'src/app/models/suggestion.model';
import { Router } from '@angular/router';
import { SuggestionService } from 'src/app/services/suggestion.service';
import { faUser, faPlus, faComment } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-list-suggestion',
  templateUrl: './list-suggestion.component.html',
  styleUrls: ['./list-suggestion.component.scss']
})
export class ListSuggestionComponent implements OnInit, OnDestroy {


  faComment = faComment;
  faPlus = faPlus;

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

  suggestions: Suggestion[];
  suggestionsSubscription: Subscription;

  constructor(private suggestionService: SuggestionService, private router: Router) {

  }

  ngOnInit() {
    this.suggestionsSubscription = this.suggestionService.getAllSuggestions().subscribe((suggestions) => {
      this.suggestions = suggestions;
      this.dtTrigger.next();
      console.log('this.suggestions');
      console.log(this.suggestions);
    });
  }

  viewSuggestion(a: Suggestion) {
    this.router.navigate(['suggestions', 'view', a.id]);
  }

  ngOnDestroy() {
    this.suggestionsSubscription.unsubscribe();
  }

}
