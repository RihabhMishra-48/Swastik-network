import { createSlice } from '@reduxjs/toolkit'

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    feed: [],
    loading: false,
    error: null,
  },
  reducers: {
    setFeed: (state, action) => {
      state.feed = action.payload
    },
    addPost: (state, action) => {
      state.feed = [action.payload, ...state.feed]
    },
    updatePost: (state, action) => {
      state.feed = state.feed.map(p => p._id === action.payload._id ? action.payload : p)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  }
})

export const { setFeed, addPost, updatePost, setLoading } = postSlice.actions
export default postSlice.reducer
