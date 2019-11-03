import { Entreprise } from './entreprise.model';
import * as uuid from 'uuid';
import { Utilisateur } from './utilisateur.model';
import { Timestamp } from 'rxjs';

export class Suggestion {

    id: string;
    entreprise: Entreprise;
    utilisateur: Utilisateur;
    date: Date;
    likes: number;
    constructor(public section: string, public commentaire: string) {
        this.id = this.generateID();
        this.likes = 0 ;
    }

    generateID() {
        return uuid.v4().split('-').join('');
    }
}
