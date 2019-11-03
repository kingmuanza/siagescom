import { Autorisation } from './autorisation.model';
import { Entreprise } from './entreprise.model';

export class Utilisateur {


    public entreprise: Entreprise;
    public id: string;

    // tslint:disable-next-line:max-line-length
    constructor(public login: string, public nom: string, public passe: string,  public pourcentageRemise: number, public autorisations: Autorisation[]) {

    }

}
