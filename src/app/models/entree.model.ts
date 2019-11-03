import { Article } from './article.model';
import * as uuid from 'uuid';
import { Entreprise } from './entreprise.model';
import { Utilisateur } from './utilisateur.model';

export class Entree {

    id: string;
    entreprise: Entreprise;
    utilisateur: Utilisateur;
    quantiteActuelle: number;
    // tslint:disable-next-line:max-line-length
    constructor(public article: Article, public prixAchatUnitaire: number, public prixVenteUnitaire: number, public quantite: number, public date: Date) {
        this.id = this.generateID();
        this.quantiteActuelle = quantite;
    }

    generateID() {
        return uuid.v4().split('-').join('');
    }
}
