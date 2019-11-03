import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article.model';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { StockService } from 'src/app/services/stock.service';
import { faPen, faList } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-view-article',
  templateUrl: './view-article.component.html',
  styleUrls: ['./view-article.component.scss']
})
export class ViewArticleComponent implements OnInit {


  article: Article;
  constructor(private router: Router, private route: ActivatedRoute, private articleService: StockService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(ParamsAsMap => {
      const id = ParamsAsMap.get('id');
      this.articleService.getArticle(id).then((article) => {
        this.article = article.data() as Article;
      });
    });
  }

  edit(article: Article) {
    this.router.navigate(['articles', 'edit', article.id]);
  }

}
