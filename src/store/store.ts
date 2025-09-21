import { configureStore } from '@reduxjs/toolkit'
import charactersSlice from './slices/charactersSlice.js'

export const store = configureStore({
  reducer: {
    characters: charactersSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
