import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="wrap">
        <a class="logo" routerLink="/"><i class="bi bi-controller"></i> Anderson-Gaming</a>
        <nav class="site-nav" aria-label="Navigation principale">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Accueil</a>
          <a routerLink="/catalogue" routerLinkActive="active">Catalogue</a>
        </nav>
      </div>
    </header>
    <main><router-outlet /></main>
    <footer class="site-footer">
      <div class="wrap">Données et images : <a href="https://rawg.io" target="_blank" rel="noopener noreferrer">RAWG</a>. Les jeux appartiennent à leurs éditeurs.</div>
    </footer>
  `,
})
export class AppComponent {}
