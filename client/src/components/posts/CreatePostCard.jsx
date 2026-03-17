import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Image, Send, User } from 'lucide-react'
import api from '../../api/axios'
import { useDispatch } from 'react-redux'
import { addPost } from '../../store/slices/postSlice'
import { toast } from 'react-toastify'

const CreatePostCard = () => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePost = async () => {
    if (!content.trim()) return
    setLoading(true)
    try {
      const { data } = await api.post('/posts', { content, visibility: 'public' })
      dispatch(addPost(data))
      setContent('')
      toast.success('Post shared!')
    } catch (err) {
      toast.error('Failed to post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass p-5 rounded-2xl space-y-4 border border-white/5">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden shrink-0 border border-primary/20">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <User size={20} className="text-white" />
          )}
        </div>
        <textarea
          placeholder={`What's on your mind, ${user?.username}?`}
          className="bg-transparent border-none outline-none w-full resize-none pt-2 text-sm text-text-primary placeholder:text-text-muted min-h-[60px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-xl transition-all text-text-secondary text-xs font-semibold">
            <Image size={18} className="text-green-400" />
            Media
          </button>
        </div>
        
        <button
          onClick={handlePost}
          disabled={!content.trim() || loading}
          className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:bg-primary/50 text-white px-6 py-2 rounded-xl transition-all font-bold text-sm flex items-center gap-2 group"
        >
          {loading ? 'Posting...' : (
            <>
              Post
              <Send size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default CreatePostCard
