import React, { useEffect, useState } from 'react'
import { Send, User, Loader2 } from 'lucide-react'
import api from '../../api/axios'
import moment from 'moment'

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await api.get(`/posts/${postId}/comments`)
        setComments(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchComments()
  }, [postId])

  const handleComment = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    try {
      const { data } = await api.post(`/posts/${postId}/comment`, { content })
      setComments([data, ...comments])
      setContent('')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-4 bg-white/3 border-t border-white/5 space-y-4">
      <form onSubmit={handleComment} className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Write a comment..."
            className="w-full bg-bg-accent/50 border border-white/5 rounded-xl py-2 px-4 text-sm outline-none focus:border-primary/50 transition-all pr-10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!content.trim() || submitting}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary p-1 hover:bg-primary/10 rounded-md transition-all disabled:opacity-0"
          >
            <Send size={16} />
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin text-text-muted" size={20} />
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-bg-accent overflow-hidden shrink-0">
                {comment.author.avatar ? (
                  <img src={comment.author.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={16} className="text-text-muted m-2" />
                )}
              </div>
              <div className="flex-1 bg-white/5 p-3 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{comment.author.username}</span>
                  <span className="text-[10px] text-text-muted">{moment(comment.createdAt).fromNow()}</span>
                </div>
                <p className="text-sm text-text-secondary leading-snug">{comment.content}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-center text-xs text-text-muted py-4 italic">No comments yet. Be the first to join the conversation!</p>
          )}
        </div>
      )}
    </div>
  )
}

export default CommentSection
