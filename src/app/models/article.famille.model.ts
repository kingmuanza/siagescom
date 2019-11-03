import { Entreprise } from './entreprise.model';
import { Utilisateur } from './utilisateur.model';
import * as uuid from 'uuid';

export class ArticleFamille {

    id: string;
    parent: ArticleFamille;
    entreprise: Entreprise;
    utilisateur: Utilisateur;

    constructor(public ref: string, public libelle: string) {
        this.id = this.generateID();
    }

    setParent(parent: ArticleFamille) {
        this.parent = parent;
    }

    generateID() {
        return uuid.v4().split('-').join('');
    }

}
