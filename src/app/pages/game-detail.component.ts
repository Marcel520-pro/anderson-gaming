import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page">
      <div class="wrap">
        <a class="back" routerLink="/catalogue"><i class="bi bi-chevron-left"></i> Catalogue</a>

        @if (game; as g) {
          <article class="detail">
            <div class="detail-grid">
              <div class="cover">
                @if (g.image) {
                  <img [src]="g.image" [alt]="'Image de ' + g.title" />
                }
              </div>

              <div>
                <h1>{{ g.title }}</h1>
                <ul class="meta">
                  @if (g.rating) {
                    <li class="gold"><i class="bi bi-star-fill"></i> {{ g.rating }} / 5</li>
                  }
                  @for (genre of g.genres; track genre) {
                    <li>{{ genre }}</li>
                  }
                </ul>
                <p class="facts">
                  @if (g.released) { Sortie : {{ g.released }}. }
                  @if (g.platforms.length) { Plateformes : {{ g.platforms.join(', ') }}. }
                </p>
                <p class="desc">{{ g.description || 'Aucune description disponible pour ce jeu.' }}</p>

                <h2>Où l'obtenir</h2>
                <div class="stores">
                  @for (s of g.stores; track s.url) {
                    <a class="btn-gold" [href]="s.url" target="_blank" rel="noopener noreferrer">
                      <i class="bi bi-bag"></i> Obtenir sur {{ s.name }}
                    </a>
                  } @empty {
                    <p class="empty">Aucune boutique référencée pour ce jeu.</p>
                  }
                </div>
                <p class="src">Source : <a [href]="g.rawgUrl" target="_blank" rel="noopener noreferrer">RAWG</a></p>
              </div>
            </div>
          </article>
        } @else if (svc.loaded()) {
          <p class="empty">Ce jeu est introuvable. <a routerLink="/catalogue">Retour au catalogue</a></p>
        }
      </div>
    </section>
  `,
})
export class GameDetailComponent {
  svc = inject(GameService);
  @Input() id = '';

  get game() {
    return this.svc.games().find((g) => g.id === this.id);
  }
}
