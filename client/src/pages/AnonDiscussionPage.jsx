import React, { useEffect, useState } from 'react'
import { Hash, Send, ShieldAlert, Zap } from 'lucide-react'
import api from '../api/axios'
import moment from 'moment'

const AnonDiscussionPage = () => {
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnon = async () => {
      try {
        const { data } = await api.get('/anonymous')
        setMessages(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnon()
  }, [])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    try {
      const { data } = await api.post('/anonymous', { content })
      setMessages([data, ...messages])
      setContent('')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-120px)] glass rounded-3xl overflow-hidden animate-in zoom-in duration-500">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-red-500/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-400">
            <Hash size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Anonymous Confessions</h1>
            <p className="text-[11px] text-red-400/60 uppercase tracking-widest font-black flex items-center gap-1">
              <ShieldAlert size={12} /> Privacy Level: Maximum
            </p>
          </div>
        </div>
        <div className="px-4 py-2 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400 text-[10px] font-bold animate-pulse">
           IDENTITY HIDDEN
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-500/10 border-b border-yellow-500/10 px-6 py-3 flex items-center gap-3">
        <Zap className="text-yellow-500" size={16} />
        <p className="text-[11px] text-yellow-500 font-bold uppercase">Remember to be respectful. Rules still apply even when anonymous.</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg._id} className="animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-bg-accent flex items-center justify-center text-text-muted shrink-0">
                ?
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-primary">Anonymous student</span>
                  <span className="text-[10px] text-text-muted">• {moment(msg.createdAt).fromNow()}</span>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl rounded-tl-none border border-white/5 text-sm leading-relaxed text-text-secondary italic">
                  "{msg.content}"
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            placeholder="Shhh... share your secret anonymously"
            className="flex-1 bg-bg-accent/40 border border-white/5 rounded-2xl py-3.5 px-6 outline-none focus:border-red-500/30 transition-all text-sm italic"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!content.trim()}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 rounded-2xl transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
          >
            Reveal
          </button>
        </form>
      </div>
    </div>
  )
}

export default AnonDiscussionPage
