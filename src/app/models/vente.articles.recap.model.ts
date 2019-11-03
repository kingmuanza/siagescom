import { Article } from './article.model';
import { Vente } from './vente.model';

export class VenteRecap {

    remise: number;
    reference: string;
    date: Date;

    lignes = new Array<{
        article: Article,
        quantite: number,
        prixTotal: number
    }>();

    constructor(public vente: Vente) {
        this.remise = this.vente.remise;
        this.reference = this.vente.reference;
        this.date = this.vente.date;
        for (let i = 0; i < this.vente.ventesArticles.length; i++) {
            const va = this.vente.ventesArticles[i];
            const ligne = {
                article: va.entree.article,
                quantite: va.quantite,
                prixTotal: va.quantite * va.entree.prixVenteUnitaire
            };
            this.lignes.push(ligne);
        }
        this.arrangemento(this);
    }

    arrangemento(venteRecap: VenteRecap) {

        const lignes = new Array<{
            article: Article,
            quantite: number,
            prixTotal: number
        }>();
        const lignes2 = new Array<{
            article: Article,
            quantite: number,
            prixTotal: number
        }>();

        for (let i = 0; i < venteRecap.lignes.length; i++) {
            const ligne = venteRecap.lignes[i];
            const l = venteRecap.lignes[i];
            for (let j = i + 1; j < venteRecap.lignes.length; j++) {
                if (ligne.article.id === venteRecap.lignes[j].article.id) {
                    l.quantite += venteRecap.lignes[j].quantite;
                    l.prixTotal += venteRecap.lignes[j].prixTotal;
                    venteRecap.lignes[j].quantite = 0;
                    venteRecap.lignes[j].prixTotal = 0;
                }
            }
            if (l.quantite > 0) {
                lignes.push(l);
            }
        }

        for (let k = 0; k < lignes.length; k++) {
            if (lignes[k].quantite > 0) {
                lignes2.push(lignes[k]);
            }
        }
        console.log('lignes2');
        console.log(lignes2);
        this.lignes = lignes2;

    }

    articleIsPresent(venteRecap: VenteRecap, article: Article) {
        for (let i = 0; i < venteRecap.lignes.length; i++) {
            if (article.id === venteRecap.lignes[i].article.id) {
                return true;
            }
        }
        return false;
    }
}
