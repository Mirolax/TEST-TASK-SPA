export interface Character {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

export interface CharactersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Character[];
}

export interface CharacterForm {
  name: string;
  height: string;
  mass: string;
  birth_year: string;
}

export interface SwapiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Character[]
}

export interface InputComponentProps {
  onResults: (data: SwapiResponse) => void
  onSearchTermChange?: (term: string) => void
}


