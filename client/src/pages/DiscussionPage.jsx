import React, { useEffect, useState } from 'react'
import { Plus, MessageSquare, TrendingUp, Filter, ThumbsUp, Tag } from 'lucide-react'
import api from '../api/axios'
import moment from 'moment'

const DiscussionPage = () => {
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const { data } = await api.get('/discussions')
        setDiscussions(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDiscussions()
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Discussion Forum</h1>
          <p className="text-text-secondary text-sm">Professional ideas, technical questions, and achievements.</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
          <Plus size={20} />
          Start Discussion
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-5 rounded-2xl space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-text-muted">
              <Filter size={16} /> Filters
            </h3>
            <div className="space-y-2">
              {['All', 'Technical', 'Ideation', 'Achievements', 'Opinion'].map(f => (
                <button key={f} className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                  f === 'All' ? 'bg-primary/20 text-primary font-bold' : 'text-text-secondary hover:bg-white/5'
                }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Discussions List */}
        <div className="lg:col-span-3 space-y-4">
          {discussions.map(post => (
            <div key={post._id} className="glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all space-y-4 group">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-bg-accent flex items-center justify-center overflow-hidden border border-white/5">
                    {post.author.avatar ? <img src={post.author.avatar} alt="" /> : <User size={20} className="text-text-muted" />}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg group-hover:text-primary transition-colors">{post.title}</h2>
                    <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                      <span className="font-semibold text-text-secondary">{post.author.username}</span>
                      <span>•</span>
                      <span>{moment(post.createdAt).fromNow()}</span>
                    </div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-bg-accent rounded-full text-[10px] font-bold text-text-secondary uppercase">
                  {post.type}
                </div>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                {post.content}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags?.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-md text-[10px] text-text-muted">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                <button className="flex items-center gap-2 text-text-secondary hover:text-primary transition-all text-xs font-bold">
                  <ThumbsUp size={16} />
                  {post.votes} Votes
                </button>
                <button className="flex items-center gap-2 text-text-secondary hover:text-blue-400 transition-all text-xs font-bold">
                  <MessageSquare size={16} />
                  Join discussion
                </button>
              </div>
            </div>
          ))}
          {discussions.length === 0 && !loading && (
            <div className="text-center py-20 px-6 glass rounded-3xl space-y-4">
              <MessageSquare size={48} className="mx-auto text-text-muted opacity-20" />
              <p className="text-text-muted font-medium italic">The stage is empty. Start the first professional discussion!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DiscussionPage
