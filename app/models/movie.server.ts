export interface MovieSearchResponse {
  page: number;
  results: MovieDetails[];
  total_results: number;
  total_pages: number;
}

export interface MovieDetails {
  poster_path?: string;
  adult: boolean;
  overview: string;
  release_date: string;
  genre_ids: number[];
  id: number;
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path?: string;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
}

// TODO: fetch Movies database for movies list
export async function getMovieListItems(): Promise<Array<MovieDetails>> {
  return [];
}
