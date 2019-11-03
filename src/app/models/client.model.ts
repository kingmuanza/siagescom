import * as uuid from 'uuid';
import { Entreprise } from './entreprise.model';
import { Utilisateur } from './utilisateur.model';

export class Client {

    id: string;
    code: string;
    entreprise: Entreprise;
    utilisateur: Utilisateur;

    constructor(public nomComplet: string, public tel: string, public mail: string) {
        this.id = this.generateID();
        this.code = this.generateCode();
    }

    generateID() {
        return uuid.v4().split('-').join('');
    }
    generateCode() {
        return uuid.v4().split('-')[0];
    }

}
