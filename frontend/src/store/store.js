import { configureStore } from '@reduxjs/toolkit'
import meetingsReducer from './slices/meetingsSlice'

export const store = configureStore({
  reducer: {
    meetings: meetingsReducer
  }
})
