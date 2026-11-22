export interface Store {
  name: string;
  url: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  genres: string[];
  platforms: string[];
  released: string;
  rating: number | null;
  stores: Store[];
  rawgUrl: string;
}
