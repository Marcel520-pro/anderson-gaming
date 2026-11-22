import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { CatalogComponent } from './pages/catalog.component';
import { GameDetailComponent } from './pages/game-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Anderson-Gaming' },
  { path: 'catalogue', component: CatalogComponent, title: 'Catalogue – Anderson-Gaming' },
  { path: 'jeu/:id', component: GameDetailComponent, title: 'Jeu – Anderson-Gaming' },
  { path: '**', redirectTo: '' },
];
