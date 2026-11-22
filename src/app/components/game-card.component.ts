import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Game } from '../game.model';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a class="game-card" [routerLink]="['/jeu', game.id]">
      <div class="cover">
        @if (game.image) {
          <img [src]="game.image" [alt]="'Image de ' + game.title" loading="lazy" />
        } @else {
          <i class="bi bi-controller" aria-hidden="true"></i>
        }
      </div>
      <h3>{{ game.title }}</h3>
      <p>{{ game.genres.slice(0, 2).join(', ') || 'Genre inconnu' }}</p>
    </a>
  `,
})
export class GameCardComponent {
  @Input({ required: true }) game!: Game;
}
