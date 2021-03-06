import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Movies } from "api/agent"
import type { MovieDetails } from "api/responses"

export interface MoviesState {
  movies: { [category: string]: MovieDetails[] }
  searchValue: string
  searchResults: MovieDetails[]
  displaySearch: boolean
  currentMovie: MovieDetails | null
  error: string | null
}

const initialState: MoviesState = {
  movies: {},
  searchValue: "",
  searchResults: [],
  displaySearch: false,
  currentMovie: null,
  error: null,
}

export const fetchMoviesList = createAsyncThunk(
  "movies/fetchMoviesList",
  async () =>
    Promise.all([Movies.trending(), Movies.popular(), Movies.topRated()]).then(
      ([
        { results: trending },
        { results: popular },
        { results: topRated },
      ]) => ({
        "Trending Now": trending,
        "Popular on Reflix": popular,
        "Top Rated": topRated,
      })
    )
)

export const fetchMovieById = createAsyncThunk(
  "movies/fetchMovieById",
  async (id: number) => await Movies.movie(id)
)

export const searchMovie = createAsyncThunk(
  "movies/searchMovie",
  async (value: string) => (await Movies.search(value)).results
)

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setSearchValue(state, action) {
      state.searchValue = action.payload
    },
    setDisplaySearch(state, action: { payload: boolean }) {
      state.displaySearch = action.payload
    },
  },
  extraReducers: {
    [fetchMoviesList.fulfilled.toString()]: (state, action) => {
      state.movies = action.payload
      state.error = null
    },
    [fetchMovieById.fulfilled.toString()]: (state, action) => {
      state.currentMovie = { ...action.payload }
      state.error = null
    },
    [fetchMovieById.rejected.toString()]: (state, action) => {
      state.currentMovie = null
      if (action.error.message.includes("404")) state.error = "Movie not found"
      else state.error = action.error.message
    },
    [searchMovie.fulfilled.toString()]: (state, action) => {
      state.searchResults = action.payload
      state.error = null
    },
  },
})

const { actions, reducer } = moviesSlice
export const { setSearchValue, setDisplaySearch } = actions
export default reducer
