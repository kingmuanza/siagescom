import { Component, OnInit, OnDestroy } from '@angular/core';
import { DATATABLE_OPTIONS } from 'src/app/models/datatable.options';
import { Subject, Subscription } from 'rxjs';
import { ArticleFamille } from 'src/app/models/article.famille.model';
import { StockService } from 'src/app/services/stock.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-article-famille',
  templateUrl: './list-article-famille.component.html',
  styleUrls: ['./list-article-famille.component.scss']
})
export class ListArticleFamilleComponent implements OnInit, OnDestroy {

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

  familles: ArticleFamille[];
  famillesSubscription: Subscription;

  constructor(private articleService: StockService, private router: Router) {

  }

  ngOnInit() {
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
  }

  viewFamilleArticle(f: ArticleFamille) {
    this.router.navigate(['familles', 'view', f.id]);
  }

  ngOnDestroy() {
    this.famillesSubscription.unsubscribe();
  }

}
