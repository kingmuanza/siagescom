import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AchatService } from './services/achat.service';
import { VenteService } from './services/vente.service';
import { StockService } from './services/stock.service';
import { UtilisateurService } from './services/utilisateur.service';
import { EditUtilisateurComponent } from './components/utilisateur/edit-utilisateur/edit-utilisateur.component';
import { ListUtilisateurComponent } from './components/utilisateur/list-utilisateur/list-utilisateur.component';
import { ViewUtilisateurComponent } from './components/utilisateur/view-utilisateur/view-utilisateur.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { ConnexionComponent } from './components/utilisateur/connexion/connexion.component';
import { EditArticleComponent } from './components/article/edit-article/edit-article.component';
import { ListVenteComponent } from './components/vente/list-vente/list-vente.component';
import { EditVenteComponent } from './components/vente/edit-vente/edit-vente.component';
import { ViewVenteComponent } from './components/vente/view-vente/view-vente.component';
import { ViewEntreeComponent } from './components/entree/view-entree/view-entree.component';
import { ListEntreeComponent } from './components/entree/list-entree/list-entree.component';
import { EditEntreeComponent } from './components/entree/edit-entree/edit-entree.component';
import { ListArticleFamilleComponent } from './components/article/list-article-famille/list-article-famille.component';
import { EditArticleFamilleComponent } from './components/article/edit-article-famille/edit-article-famille.component';
import { ViewArticleFamilleComponent } from './components/article/view-article-famille/view-article-famille.component';
import { ListArticleComponent } from './components/article/list-article/list-article.component';
import { ViewArticleComponent } from './components/article/view-article/view-article.component';
import { AuthGuard } from './services/auth.gard';
import { ReactiveFormsModule } from '@angular/forms';
import { EditEntrepriseComponent } from './components/entreprise/edit-entreprise/edit-entreprise.component';
import { Guard } from './services/guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RecapVenteComponent } from './components/vente/recap-vente/recap-vente.component';
import {NgxPrintModule} from 'ngx-print';
import { ChangerPasseComponent } from './components/utilisateur/changer-passe/changer-passe.component';
import { ListPromotionComponent } from './components/promotion/list-promotion/list-promotion.component';
import { ViewPromotionComponent } from './components/promotion/view-promotion/view-promotion.component';
import { EditPromotionComponent } from './components/promotion/edit-promotion/edit-promotion.component';
import { BrandComponent } from './pages/brand/brand.component';
import { BlankComponent } from './components/blank/blank.component';
import { EditPaiementComponent } from './components/paiement/edit-paiement/edit-paiement.component';
import { ViewPaiementComponent } from './components/paiement/view-paiement/view-paiement.component';
import { ListPaiementComponent } from './components/paiement/list-paiement/list-paiement.component';
import { AvancesComponent } from './components/paiement/avances/avances.component';
import { ListClientComponent } from './components/client/list-client/list-client.component';
import { EditClientComponent } from './components/client/edit-client/edit-client.component';
import { ViewClientComponent } from './components/client/view-client/view-client.component';
import { ListFactureComponent } from './components/facture/list-facture/list-facture.component';
import { EditFactureComponent } from './components/facture/edit-facture/edit-facture.component';
import { ViewFactureComponent } from './components/facture/view-facture/view-facture.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StatsVentesComponent } from './components/vente/stats-ventes/stats-ventes.component';
import { TableVentesComponent } from './components/vente/table-ventes/table-ventes.component';
import { ParametresComponent } from './pages/parametres/parametres.component';
import { ListSuggestionComponent } from './components/suggestions/list-suggestion/list-suggestion.component';
import { ViewSuggestionComponent } from './components/suggestions/view-suggestion/view-suggestion.component';
import { EditSuggestionComponent } from './components/suggestions/edit-suggestion/edit-suggestion.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDAoL0D9ZN5SeOzy5QYXVkbSOcAzmC7jqE',
  authDomain: 'siagescom.firebaseapp.com',
  databaseURL: 'https://siagescom.firebaseio.com',
  projectId: 'siagescom',
  storageBucket: 'siagescom.appspot.com',
  messagingSenderId: '877554049922',
  appId: '1:877554049922:web:76766421e905e01a'
};

@NgModule({
  declarations: [
    AppComponent,
    EditUtilisateurComponent,
    ListUtilisateurComponent,
    ViewUtilisateurComponent,
    ConnexionComponent,
    ListArticleComponent,
    ViewArticleComponent,
    EditArticleComponent,
    ListVenteComponent,
    EditVenteComponent,
    ViewVenteComponent,
    ViewEntreeComponent,
    ListEntreeComponent,
    EditEntreeComponent,
    ListArticleFamilleComponent,
    EditArticleFamilleComponent,
    ViewArticleFamilleComponent,
    EditEntrepriseComponent,
    RecapVenteComponent,
    ChangerPasseComponent,
    ListPromotionComponent,
    ViewPromotionComponent,
    EditPromotionComponent,
    BrandComponent,
    BlankComponent,
    EditPaiementComponent,
    ViewPaiementComponent,
    ListPaiementComponent,
    AvancesComponent,
    ListClientComponent,
    EditClientComponent,
    ViewClientComponent,
    ListFactureComponent,
    EditFactureComponent,
    ViewFactureComponent,
    DashboardComponent,
    StatsVentesComponent,
    TableVentesComponent,
    ParametresComponent,
    ListSuggestionComponent,
    ViewSuggestionComponent,
    EditSuggestionComponent,
    InscriptionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFirestoreModule,
    DataTablesModule,
    FontAwesomeModule,
    NgxPrintModule,
    RouterModule.forRoot(appRoutes),
    ChartsModule
  ],
  providers: [
    AuthGuard,
    Guard,
    AchatService,
    VenteService,
    StockService,
    UtilisateurService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
