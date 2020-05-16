import { Routes } from '@angular/router';
import { ListUtilisateurComponent } from './components/utilisateur/list-utilisateur/list-utilisateur.component';
import { EditUtilisateurComponent } from './components/utilisateur/edit-utilisateur/edit-utilisateur.component';
import { ViewUtilisateurComponent } from './components/utilisateur/view-utilisateur/view-utilisateur.component';
import { ListArticleComponent } from './components/article/list-article/list-article.component';
import { ViewArticleComponent } from './components/article/view-article/view-article.component';
import { EditArticleComponent } from './components/article/edit-article/edit-article.component';
import { ConnexionComponent } from './components/utilisateur/connexion/connexion.component';
import { Guard } from './services/guard';
import { EditEntrepriseComponent } from './components/entreprise/edit-entreprise/edit-entreprise.component';
import { AuthGuard } from './services/auth.gard';
import { ListArticleFamilleComponent } from './components/article/list-article-famille/list-article-famille.component';
import { ViewArticleFamilleComponent } from './components/article/view-article-famille/view-article-famille.component';
import { EditArticleFamilleComponent } from './components/article/edit-article-famille/edit-article-famille.component';
import { ListVenteComponent } from './components/vente/list-vente/list-vente.component';
import { ViewVenteComponent } from './components/vente/view-vente/view-vente.component';
import { EditVenteComponent } from './components/vente/edit-vente/edit-vente.component';
import { ListEntreeComponent } from './components/entree/list-entree/list-entree.component';
import { ViewEntreeComponent } from './components/entree/view-entree/view-entree.component';
import { EditEntreeComponent } from './components/entree/edit-entree/edit-entree.component';
import { ChangerPasseComponent } from './components/utilisateur/changer-passe/changer-passe.component';
import { ListPromotionComponent } from './components/promotion/list-promotion/list-promotion.component';
import { ViewPromotionComponent } from './components/promotion/view-promotion/view-promotion.component';
import { EditPromotionComponent } from './components/promotion/edit-promotion/edit-promotion.component';
import { BlankComponent } from './components/blank/blank.component';
import { ListClientComponent } from './components/client/list-client/list-client.component';
import { ViewClientComponent } from './components/client/view-client/view-client.component';
import { EditClientComponent } from './components/client/edit-client/edit-client.component';
import { ListPaiementComponent } from './components/paiement/list-paiement/list-paiement.component';
import { ViewPaiementComponent } from './components/paiement/view-paiement/view-paiement.component';
import { EditPaiementComponent } from './components/paiement/edit-paiement/edit-paiement.component';
import { ListFactureComponent } from './components/facture/list-facture/list-facture.component';
import { ViewFactureComponent } from './components/facture/view-facture/view-facture.component';
import { EditFactureComponent } from './components/facture/edit-facture/edit-facture.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ParametresComponent } from './pages/parametres/parametres.component';
import { AvancesComponent } from './components/paiement/avances/avances.component';
import { ListSuggestionComponent } from './components/suggestions/list-suggestion/list-suggestion.component';
import { ViewSuggestionComponent } from './components/suggestions/view-suggestion/view-suggestion.component';
import { EditSuggestionComponent } from './components/suggestions/edit-suggestion/edit-suggestion.component';

export const appRoutes: Routes = [
    { path: 'connexion', component: BlankComponent },
    { path: 'entreprise', canActivate: [AuthGuard], component: EditEntrepriseComponent },

    { path: 'utilisateurs', canActivate: [Guard], component: ListUtilisateurComponent },
    { path: 'utilisateurs/view/:id', canActivate: [Guard], component: ViewUtilisateurComponent },
    { path: 'utilisateurs/edit/:id', canActivate: [Guard], component: EditUtilisateurComponent },
    { path: 'utilisateurs/edit', canActivate: [Guard], component: EditUtilisateurComponent },

    { path: 'articles', canActivate: [Guard], component: ListArticleComponent },
    { path: 'articles/view/:id', canActivate: [Guard], component: ViewArticleComponent },
    { path: 'articles/edit/:id', canActivate: [Guard], component: EditArticleComponent },
    { path: 'articles/:id', canActivate: [Guard], component: EditArticleComponent },

    { path: 'familles', canActivate: [Guard], component: ListArticleFamilleComponent },
    { path: 'familles/view/:id', canActivate: [Guard], component: ViewArticleFamilleComponent },
    { path: 'familles/edit/:id', canActivate: [Guard], component: EditArticleFamilleComponent },
    { path: 'familles/:id', canActivate: [Guard], component: EditArticleFamilleComponent },

    { path: 'ventes', canActivate: [Guard], component: ListVenteComponent },
    { path: 'ventes/view/:id', canActivate: [Guard], component: ViewVenteComponent },
    { path: 'ventes/edit/:id', canActivate: [Guard], component: EditVenteComponent },
    { path: 'ventes/:id', canActivate: [Guard], component: EditVenteComponent },

    { path: 'achats', canActivate: [Guard], component: ListEntreeComponent },
    { path: 'achats/view/:id', canActivate: [Guard], component: ViewEntreeComponent },
    { path: 'achats/edit/:id', canActivate: [Guard], component: EditEntreeComponent },
    { path: 'achats/:id', canActivate: [Guard], component: EditEntreeComponent },

    { path: 'promotions', canActivate: [Guard], component: ListPromotionComponent },
    { path: 'promotions/view/:id', canActivate: [Guard], component: ViewPromotionComponent },
    { path: 'promotions/edit/:id', canActivate: [Guard], component: EditPromotionComponent },
    { path: 'promotions/:id', canActivate: [Guard], component: EditPromotionComponent },

    { path: 'suggestions', canActivate: [Guard], component: ListSuggestionComponent },
    { path: 'suggestions/view/:id', canActivate: [Guard], component: ViewSuggestionComponent },
    { path: 'suggestions/edit/:id', canActivate: [Guard], component: EditSuggestionComponent },
    { path: 'suggestions/:id', canActivate: [Guard], component: EditSuggestionComponent },

    { path: 'clients', canActivate: [Guard], component: ListClientComponent },
    { path: 'clients/view/:id', canActivate: [Guard], component: ViewClientComponent },
    { path: 'clients/edit/:id', canActivate: [Guard], component: EditClientComponent },
    { path: 'clients/:id', canActivate: [Guard], component: EditClientComponent },

    { path: 'avances', canActivate: [Guard], component: AvancesComponent },

    { path: 'paiements', canActivate: [Guard], component: ListPaiementComponent },
    { path: 'paiements/view/:id', canActivate: [Guard], component: ViewPaiementComponent },
    { path: 'paiements/edit/:id', canActivate: [Guard], component: EditPaiementComponent },
    { path: 'paiements/:id', canActivate: [Guard], component: EditPaiementComponent },

    { path: 'factures', canActivate: [Guard], component: ListFactureComponent },
    { path: 'factures/view/:id', canActivate: [Guard], component: ViewFactureComponent },
    { path: 'factures/edit/:id', canActivate: [Guard], component: EditFactureComponent },
    { path: 'factures/:id', canActivate: [Guard], component: EditFactureComponent },

    { path: 'profil/:id', canActivate: [Guard], component: ChangerPasseComponent },
    { path: 'dashboard', canActivate: [Guard], component: DashboardComponent },
    { path: 'parametres', canActivate: [Guard], component: ParametresComponent },

    { path: '**', redirectTo: 'connexion' }
];
