import { io } from 'socket.io-client'
import { store } from '../store/store'
import { addMessage } from '../store/slices/groupSlice'

let socket

export const initSocket = (token) => {
  if (socket) return socket

  socket = io('/', {
    auth: { token },
    transports: ['websocket'],
  })

  socket.on('connect', () => {
    console.log('✅ Connected to Socket server')
  })

  socket.on('new-message', (message) => {
    const state = store.getState()
    if (state.groups.activeGroup?._id === message.group) {
      store.dispatch(addMessage(message))
    }
  })

  socket.on('message-deleted', ({ messageId, roomId }) => {
    // Handle deletion logic in Redux if needed
  })

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
