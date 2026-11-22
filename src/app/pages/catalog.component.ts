import { Component, computed, inject, signal } from '@angular/core';
import { GameService } from '../game.service';
import { GameCardComponent } from '../components/game-card.component';

const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [GameCardComponent],
  template: `
    <section class="page">
      <div class="wrap">
        <h1>Catalogue</h1>

        <label class="search">
          <i class="bi bi-search" aria-hidden="true"></i>
          <input
            type="search"
            placeholder="Rechercher un jeu"
            aria-label="Rechercher un jeu"
            [value]="query()"
            (input)="query.set($any($event.target).value)"
          />
        </label>

        <div class="chips" role="group" aria-label="Filtrer par genre">
          <button type="button" class="chip" [class.on]="genre() === ''" (click)="genre.set('')">Tous</button>
          @for (g of genres(); track g) {
            <button type="button" class="chip" [class.on]="genre() === g" (click)="genre.set(g)">{{ g }}</button>
          }
        </div>

        @if (!svc.loaded()) {
          <p class="empty">Chargement du catalogue…</p>
        } @else if (svc.failed()) {
          <p class="empty">Impossible de charger le catalogue. Génère d'abord games.json avec le script RAWG.</p>
        } @else {
          <p class="count">{{ filtered().length }} jeu(x)</p>
          <div class="grid">
            @for (g of filtered(); track g.id) {
              <app-game-card [game]="g" />
            } @empty {
              <p class="empty">Aucun jeu ne correspond. Essaie un autre nom ou retire le filtre.</p>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class CatalogComponent {
  svc = inject(GameService);
  query = signal('');
  genre = signal('');

  genres = computed(() =>
    [...new Set(this.svc.games().flatMap((g) => g.genres))].sort((a, b) => a.localeCompare(b)),
  );

  filtered = computed(() => {
    const q = norm(this.query().trim());
    const gen = this.genre();
    return this.svc
      .games()
      .filter((g) => (!q || norm(g.title).includes(q)) && (!gen || g.genres.includes(gen)));
  });
}
