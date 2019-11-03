import { Component, OnInit, OnDestroy } from '@angular/core';
import { StockService } from 'src/app/services/stock.service';
import { Router } from '@angular/router';
import { Article } from 'src/app/models/article.model';
import { Subscription, Subject } from 'rxjs';
import { DATATABLE_OPTIONS } from 'src/app/models/datatable.options';

@Component({
  selector: 'app-list-article',
  templateUrl: './list-article.component.html',
  styleUrls: ['./list-article.component.scss']
})
export class ListArticleComponent implements OnInit, OnDestroy {

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

  constructor(private articleService: StockService, private router: Router) {

  }

  ngOnInit() {
    this.articlesSubscription = this.articleService.getAllArticles().subscribe((articles) => {
      this.articles = articles;
      this.dtTrigger.next();
      console.log('this.articles');
      console.log(this.articles);
    });
  }

  viewArticle(a: Article) {
    this.router.navigate(['articles', 'view', a.id]);
  }

  ngOnDestroy() {
    this.articlesSubscription.unsubscribe();
  }

}
