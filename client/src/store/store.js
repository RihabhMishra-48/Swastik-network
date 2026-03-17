import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import postReducer from './slices/postSlice'
import groupReducer from './slices/groupSlice'
import notificationReducer from './slices/notificationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    groups: groupReducer,
    notifications: notificationReducer,
  },
})
