import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    unreadCount: 0,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.list = action.payload
      state.unreadCount = action.payload.filter(n => !n.read).length
    },
    addNotification: (state, action) => {
      state.list = [action.payload, ...state.list]
      if (!action.payload.read) state.unreadCount += 1
    },
    markAllRead: (state) => {
      state.list = state.list.map(n => ({ ...n, read: true }))
      state.unreadCount = 0
    }
  }
})

export const { setNotifications, addNotification, markAllRead } = notificationSlice.actions
export default notificationSlice.reducer
