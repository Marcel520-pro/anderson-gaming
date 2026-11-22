import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Game } from './game.model';

@Injectable({ providedIn: 'root' })
export class GameService {
  private http = inject(HttpClient);

  readonly games = signal<Game[]>([]);
  readonly loaded = signal(false);
  readonly failed = signal(false);

  constructor() {
    this.http.get<Game[]>('assets/games.json').subscribe({
      next: (games) => {
        this.games.set(games);
        this.loaded.set(true);
      },
      error: () => {
        this.failed.set(true);
        this.loaded.set(true);
      },
    });
  }
}
