import React, { useState } from 'react'
import { Heart, MessageSquare, Share2, MoreHorizontal, User as UserIcon } from 'lucide-react'
import moment from 'moment'
import api from '../../api/axios'
import { useDispatch, useSelector } from 'react-redux'
import { updatePost } from '../../store/slices/postSlice'
import CommentSection from './CommentSection'

const PostCard = ({ post }) => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [showComments, setShowComments] = useState(false)
  const isLiked = post.likes.includes(user?._id)

  const handleLike = async () => {
    try {
      const { data } = await api.post(`/posts/${post._id}/like`)
      dispatch(updatePost(data))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="glass rounded-2xl border border-white/5 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bg-accent flex items-center justify-center overflow-hidden border border-white/5">
            {post.author.avatar ? (
              <img src={post.author.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={20} className="text-text-muted" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm">{post.author.username}</span>
              <span className="w-1 h-1 rounded-full bg-text-muted"></span>
              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-tight">
                {post.author.university || 'GLA student'}
              </span>
            </div>
            <p className="text-[11px] text-text-muted">{moment(post.createdAt).fromNow()}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-muted">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Media */}
      {post.images && post.images.length > 0 && (
        <div className="aspect-video w-full bg-black/20 flex items-center justify-center border-y border-white/5">
          <img src={post.images[0]} alt="" className="w-full h-full object-contain" />
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 flex items-center gap-6 border-t border-white/5">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm font-semibold transition-all ${isLiked ? 'text-red-500' : 'text-text-secondary hover:text-red-400'}`}
        >
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          {post.likes.length}
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-text-secondary hover:text-primary transition-all text-sm font-semibold"
        >
          <MessageSquare size={20} />
          {post.comments.length}
        </button>
        <button className="flex items-center gap-2 text-text-secondary hover:text-blue-400 transition-all text-sm font-semibold">
          <Share2 size={20} />
          {post.shares || 0}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && <CommentSection postId={post._id} />}
    </div>
  )
}

export default PostCard
