import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CharactersResponse, Character, CharacterForm } from '../../types'

interface CharactersState {
  list: Character[]
  currentPage: number
  total: number
  search: string
  loading: boolean
  error: string | null
}

const initialState: CharactersState = {
  list: [],
  currentPage: 1,
  total: 0,
  search: '',
  loading: false,
  error: null,
}

export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async ({ page = 1, search = '' }: { page: number; search: string }): Promise<CharactersResponse> => {
    let url = `https://swapi.dev/api/people/?page=${page}`
    if (search) {
      url = `https://swapi.dev/api/people/?search=${search}&page=${page}`
    }
    
    const response = await fetch(url)
    const data = await response.json()
    return data
  }
)

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    updateCharacter: (state, action: PayloadAction<{ id: string; data: CharacterForm }>) => {
      const { id, data } = action.payload
      const characterIndex = state.list.findIndex(char => char.url.includes(id))
      if (characterIndex !== -1) {
        state.list[characterIndex] = { ...state.list[characterIndex], ...data }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.results
        state.total = action.payload.count
      })
  },
})

export const { setCurrentPage, setSearch, updateCharacter } = charactersSlice.actions
export default charactersSlice.reducer