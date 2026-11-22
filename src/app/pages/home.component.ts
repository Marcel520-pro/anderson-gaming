import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameService } from '../game.service';
import { GameCardComponent } from '../components/game-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, GameCardComponent],
  template: `
    <section class="hero">
      <div class="wrap">
        <div>
          <h1>Trouve ton prochain jeu.</h1>
          <p>Parcours {{ svc.games().length || '' }} jeux, compare leurs genres et leurs notes, puis ouvre la boutique officielle pour l'obtenir.</p>
          <a class="btn-gold" routerLink="/catalogue"><i class="bi bi-grid"></i> Voir le catalogue</a>
        </div>
        <div class="hero-covers" aria-hidden="true">
          @for (g of covers(); track g.id) {
            <div class="cover"><img [src]="g.image" alt="" /></div>
          }
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <h2>Les mieux notés</h2>
          <a routerLink="/catalogue">Tout le catalogue</a>
        </div>
        @if (svc.loaded() && svc.failed()) {
          <p class="empty">Impossible de charger le catalogue. Génère d'abord games.json avec le script RAWG.</p>
        }
        <div class="grid">
          @for (g of featured(); track g.id) {
            <app-game-card [game]="g" />
          }
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {
  svc = inject(GameService);

  featured = computed(() =>
    [...this.svc.games()].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 6),
  );

  covers = computed(() => this.featured().filter((g) => g.image).slice(0, 3));
}
