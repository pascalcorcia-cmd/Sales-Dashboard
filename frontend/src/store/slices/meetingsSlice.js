import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  current: {
    subject: '',
    stakes: '',
    trigger: '',
    participants: [],
    duration: '60',
    agenda: '',
    notes: '',
    decisions: '',
    actions: '',
    email: ''
  },
  history: [],
  loading: false
}

const meetingsSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    setMeetingData: (state, action) => {
      state.current = { ...state.current, ...action.payload }
    },
    addAction: (state, action) => {
      state.current.actions += '\n' + action.payload
    },
    clearMeeting: (state) => {
      state.current = initialState.current
    },
    saveMeetingHistory: (state, action) => {
      state.history.push({ ...state.current, timestamp: new Date().toISOString() })
      state.current = initialState.current
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  }
})

export const { setMeetingData, addAction, clearMeeting, saveMeetingHistory, setLoading } = meetingsSlice.actions
export default meetingsSlice.reducer
