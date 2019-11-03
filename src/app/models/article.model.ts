import { ArticleFamille } from './article.famille.model';
import * as uuid from 'uuid';
import { Entreprise } from './entreprise.model';

export class Article {

    id: string;
    entreprise: Entreprise;

    // tslint:disable-next-line:max-line-length
    constructor(public ref: string, public libelle: string, public description: string, public famille: ArticleFamille) {
        this.id = this.generateID();
    }

    generateID() {
        return uuid.v4().split('-').join('');
    }

}
