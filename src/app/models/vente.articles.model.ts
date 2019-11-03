import { Entree } from './entree.model';
import * as uuid from 'uuid';

export class VenteArticle {

    id: string;

    constructor(public entree: Entree, public quantite: number) {
        this.id = this.generateID();
    }

    generateID() {
        return uuid.v4().split('-')[0];
    }
}
