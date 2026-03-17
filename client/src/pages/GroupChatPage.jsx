import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Send, Image, User, MoreVertical, Hash, Info, ChevronLeft } from 'lucide-react'
import api from '../api/axios'
import { setMessages, addMessage, setActiveGroup } from '../store/slices/groupSlice'
import { initSocket, getSocket } from '../socket/socket'
import moment from 'moment'

const GroupChatPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { token, user } = useSelector(state => state.auth)
  const { activeGroup, messages } = useSelector(state => state.groups)
  const [content, setContent] = useState('')
  const scrollRef = useRef()

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const { data: group } = await api.get(`/groups`)
        const current = group.find(g => g._id === id)
        dispatch(setActiveGroup(current))
        
        const { data: msgs } = await api.get(`/groups/${id}/messages`)
        dispatch(setMessages(msgs))
      } catch (err) {
        console.error(err)
      }
    }
    
    fetchGroup()
    const socket = initSocket(token)
    socket.emit('join-room', id)

    return () => {
      socket.emit('leave-room', id)
    }
  }, [id, token, dispatch])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!content.trim()) return
    
    const socket = getSocket()
    socket.emit('send-message', {
      roomId: id,
      content,
    })
    setContent('')
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col glass rounded-3xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-bg-accent/20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <Hash size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">{activeGroup?.name || 'Loading...'}</h2>
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
              {activeGroup?.type} • {activeGroup?.membersCount || 0} Members
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="p-2 hover:bg-white/5 rounded-full text-text-muted transition-colors"><Info size={20} /></button>
          <button className="p-2 hover:bg-white/5 rounded-full text-text-muted transition-colors"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => {
          const isOwn = msg.sender?._id === user?._id
          return (
            <div key={msg._id} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-bg-accent overflow-hidden shrink-0 mt-1">
                {msg.sender?.avatar ? (
                  <img src={msg.sender.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={16} className="text-text-muted m-2" />
                )}
              </div>
              <div className={`max-w-[70%] space-y-1 ${isOwn ? 'items-end' : ''}`}>
                {!isOwn && <span className="text-[10px] font-bold text-text-muted ml-1">{msg.sender?.username}</span>}
                <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                  isOwn ? 'bg-primary text-white rounded-tr-none' : 'bg-bg-accent/60 text-text-primary rounded-tl-none border border-white/5'
                }`}>
                  {msg.content}
                </div>
                <span className="text-[9px] text-text-muted mx-1">{moment(msg.createdAt).format('hh:mm A')}</span>
              </div>
            </div>
          )
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-bg-accent/10 border-t border-white/5">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <button type="button" className="p-2 text-text-muted hover:text-text-primary transition-colors">
            <Image size={22} />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full bg-bg-accent/40 border border-white/5 rounded-2xl py-3 px-5 pr-14 outline-none focus:border-primary/50 transition-all text-sm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!content.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-hover text-white p-2 rounded-xl transition-all disabled:opacity-0"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GroupChatPage
