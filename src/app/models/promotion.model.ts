import { Entreprise } from './entreprise.model';
import * as uuid from 'uuid';
import { Utilisateur } from './utilisateur.model';

export class Promotion {

    id: string;
    entreprise: Entreprise;
    utilisateur: Utilisateur;
    constructor(public dateDebut: Date, public dateFin: Date, public pourcentageRemise: number) {
        this.id = this.generateID();
    }

    generateID() {
        return uuid.v4().split('-').join('');
    }
}
