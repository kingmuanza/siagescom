import { Injectable } from '@angular/core';
import { Article } from '../models/article.model';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilisateurService } from './utilisateur.service';
import { ArticleFamille } from '../models/article.famille.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  articles: Article[];
  articlesSubject = new Subject<Article[]>();
  familles: Article[];
  famillessSubject = new Subject<Article[]>();

  constructor(public db: AngularFirestore, private uService: UtilisateurService) { }

  emitArticles() {
    this.articlesSubject.next(this.articles);
  }

  emitFamilles() {
    this.famillessSubject.next(this.familles);
  }

  getAllArticles() {
    return this.db
      .collection<Article>('articles', ref => ref.where('entreprise.id', '==', this.uService.entreprise.id))
      .valueChanges();
  }
  getAllFamilles() {
    return this.db
      .collection<ArticleFamille>('familles', ref => ref.where('entreprise.id', '==', this.uService.entreprise.id))
      .valueChanges();
  }

  getArticle(id: string) {
    return this.db.collection('articles').doc(id).get().toPromise();
  }
  getFamille(id: string) {
    return this.db.collection('familles').doc(id).get().toPromise();
  }

  saveArticle(article: Article): Promise<Article> {
    return new Promise((resolve, reject) => {
      this.db.collection('articles').doc(article.id).set(Object.assign({}, article)).then(() => {
        resolve(article);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  saveFamille(famille: ArticleFamille) {
    return this.db.collection('familles').doc(famille.id).set(Object.assign({}, famille));
  }

  deleteArticle(article: Article) {
    return this.db.collection('articles').doc(article.id).delete();
  }
  deleteFamille(famille: ArticleFamille) {
    return this.db.collection('familles').doc(famille.id).delete();
  }


}
