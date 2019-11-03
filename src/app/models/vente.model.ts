import { VenteArticle } from './vente.articles.model';
import { Entreprise } from './entreprise.model';
import * as uuid from 'uuid';
import { Utilisateur } from './utilisateur.model';
import { Entree } from './entree.model';
import { Client } from './client.model';

export class Vente {

    id: string;
    entreprise: Entreprise;
    utilisateur: Utilisateur;
    idEntrees = new Array<string>();
    client?: Client;
    montantPercu?: Array<{
        date: Date,
        montant: number
    }>;
    comptant = false;

    constructor(public reference: string, public ventesArticles: VenteArticle[], public date: Date, public remise: number) {
        this.id = this.generateID();
    }

    syncEntrees() {
        for (let i = 0; i < this.ventesArticles.length; i++) {
            const va = this.ventesArticles[i];
            this.idEntrees.push(va.entree.id);
        }
    }


    generateID() {
        return uuid.v4().split('-').join('');
    }
}
