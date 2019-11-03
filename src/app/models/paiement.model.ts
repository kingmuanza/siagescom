import * as uuid from 'uuid';
import { Vente } from './vente.model';

export class Paiement {

    id: string;

    constructor(public vente: Vente, public montant: number, public date: Date) {
        this.id = this.generateID();
    }

    generateID() {
        return uuid.v4().split('-').join('');
    }

}
