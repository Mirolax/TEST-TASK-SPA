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

const loadEditedCharacters = () => {
  try {
    return JSON.parse(localStorage.getItem('editedCharacters') || '{}')
  } catch {
    return {}
  }
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
        const updatedCharacter = { ...state.list[characterIndex], ...data }
        state.list[characterIndex] = updatedCharacter
        
        const editedCharacters = loadEditedCharacters()
        editedCharacters[id] = updatedCharacter
        localStorage.setItem('editedCharacters', JSON.stringify(editedCharacters))
      }
    },
    resetCharacterChanges: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const editedCharacters = loadEditedCharacters()
      delete editedCharacters[id]
      localStorage.setItem('editedCharacters', JSON.stringify(editedCharacters))
      
      const characterIndex = state.list.findIndex(char => char.url.includes(id))
      if (characterIndex !== -1) {
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false
        const editedCharacters = loadEditedCharacters()
        
        state.list = action.payload.results.map(character => {
          const characterId = character.url.split('/').filter(Boolean).pop()!
          return editedCharacters[characterId] || character
        })
        
        state.total = action.payload.count
      })
  },
})

export const { setCurrentPage, setSearch, updateCharacter, resetCharacterChanges } = charactersSlice.actions
export default charactersSlice.reducer