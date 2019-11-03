import * as uuid from 'uuid';

export class Entreprise {

    id: string;

    // tslint:disable-next-line:max-line-length
    constructor(public nom: string, public tel: string, public bp: string, public addresse: string, public juridique: string, public contribuable: string) {

        this.id = this.generateID();

    }

    generateID() {
        return uuid.v4().split('-').join('');
    }
}
