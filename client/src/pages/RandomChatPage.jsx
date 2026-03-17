import React, { useState, useEffect, useRef } from 'react'
import { Shuffle, Send, User, ChevronRight, MessageSquare, ShieldCheck, UserPlus, SkipForward } from 'lucide-react'
import { getSocket, initSocket } from '../socket/socket'
import { useSelector } from 'react-redux'
import moment from 'moment'

const RandomChatPage = () => {
  const { token } = useSelector(state => state.auth)
  const [status, setStatus] = useState('idle') // 'idle', 'searching', 'chatting'
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [roomId, setRoomId] = useState(null)
  const scrollRef = useRef()

  useEffect(() => {
    const socket = initSocket(token)

    socket.on('waiting-for-match', () => setStatus('searching'))
    
    socket.on('match-found', ({ roomId }) => {
      setRoomId(roomId)
      setStatus('chatting')
      setMessages([{ system: true, content: 'Connected with a random student! Say hello.' }])
    })

    socket.on('new-random-message', (msg) => {
      setMessages(prev => [...prev, { from: 'partner', content: msg.content }])
    })

    socket.on('chat-skipped', () => {
      setStatus('idle')
      setRoomId(null)
      setMessages([])
    })

    return () => {
      socket.off('waiting-for-match')
      socket.off('match-found')
      socket.off('new-random-message')
      socket.off('chat-skipped')
    }
  }, [token])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const findMatch = () => {
    getSocket().emit('find-match')
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!content.trim() || !roomId) return
    getSocket().emit('random-message', { roomId, content })
    setMessages(prev => [...prev, { from: 'me', content }])
    setContent('')
  }

  const skip = () => {
    getSocket().emit('skip-random-chat', { roomId })
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col animate-in slide-in-from-bottom-5 duration-700">
      {status === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 glass rounded-[40px] border border-white/5">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-pulse">
            <Shuffle size={48} />
          </div>
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold">Random Anonymous Chat</h1>
            <p className="text-text-secondary max-w-sm">Meet students from your campus anonymously. No profiles, no names, just pure conversation.</p>
          </div>
          <button 
            onClick={findMatch}
            className="bg-primary hover:bg-primary-hover text-white font-black px-12 py-5 rounded-3xl text-xl transition-all shadow-2xl shadow-primary/40 flex items-center gap-3 active:scale-95"
          >
            FIND A MATCH <ChevronRight size={24} />
          </button>
          <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-widest">
            <ShieldCheck size={14} className="text-green-500" /> Secure • Anonymous • GLA Private
          </div>
        </div>
      )}

      {status === 'searching' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 glass rounded-[40px]">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            <Shuffle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={40} />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Looking for someone...</h2>
            <p className="text-text-muted text-sm italic">matching you with another student currently online</p>
          </div>
          <button 
            onClick={skip}
            className="text-text-muted hover:text-red-400 font-bold transition-colors underline underline-offset-8"
          >
            Cancel search
          </button>
        </div>
      )}

      {status === 'chatting' && (
        <div className="flex-1 flex flex-col glass rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">Anonymous Partner</p>
                <p className="text-[10px] text-green-400 font-black uppercase tracking-tighter">Connected</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold transition-all">
                <UserPlus size={16} /> Add Friend
              </button>
              <button 
                onClick={skip}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                <SkipForward size={16} /> Skip
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.system ? 'justify-center' : msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                {msg.system ? (
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {msg.content}
                  </div>
                ) : (
                  <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed ${
                    msg.from === 'me' ? 'bg-primary text-white rounded-tr-none' : 'bg-bg-accent/60 text-text-primary rounded-tl-none border border-white/5'
                  }`}>
                    {msg.content}
                  </div>
                )}
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          <div className="p-6 bg-white/5 border-t border-white/5">
            <form onSubmit={sendMessage} className="flex gap-4">
              <input
                type="text"
                autoFocus
                placeholder="Start typing..."
                className="flex-1 bg-bg-accent/80 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 transition-all text-sm"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                <Send size={24} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RandomChatPage
