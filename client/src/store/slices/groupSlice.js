import { createSlice } from '@reduxjs/toolkit'

const groupSlice = createSlice({
  name: 'groups',
  initialState: {
    list: [],
    activeGroup: null,
    messages: [],
    loading: false,
  },
  reducers: {
    setGroups: (state, action) => {
      state.list = action.payload
    },
    setActiveGroup: (state, action) => {
      state.activeGroup = action.payload
    },
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    }
  }
})

export const { setGroups, setActiveGroup, setMessages, addMessage } = groupSlice.actions
export default groupSlice.reducer
