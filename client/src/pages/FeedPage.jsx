import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFeed, setLoading } from '../store/slices/postSlice'
import api from '../api/axios'
import PostCard from '../components/posts/PostCard'
import CreatePostCard from '../components/posts/CreatePostCard'
import { Loader2, TrendingUp, Users } from 'lucide-react'

const FeedPage = () => {
  const dispatch = useDispatch()
  const { feed, loading } = useSelector(state => state.posts)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchFeed = async () => {
      dispatch(setLoading(true))
      try {
        const { data } = await api.get(`/posts/feed?page=${page}`)
        dispatch(setFeed(data))
      } catch (err) {
        console.error(err)
      } finally {
        dispatch(setLoading(false))
      }
    }
    fetchFeed()
  }, [dispatch, page])

  return (
    <div className="max-w-4xl mx-auto flex gap-6">
      <div className="flex-1 space-y-6">
        <CreatePostCard />
        
        {loading && feed.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : (
          <div className="space-y-6">
            {feed.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      <div className="hidden xl:block w-80 shrink-0 space-y-6">
        <div className="glass p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-text-muted">
            <TrendingUp size={16} />
            Trending Posts
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors">
                <p className="text-xs text-primary font-semibold">#hackathon2024</p>
                <p className="text-sm font-medium line-clamp-1">GLA Annual Tech Fest Registration Starts!</p>
                <p className="text-[10px] text-text-muted">1.2k interactions</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-text-muted">
            <Users size={16} />
            Recommended Groups
          </div>
          <div className="space-y-3">
            {['Coding Club', 'Sports Arena', 'Music Society'].map(name => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-8 h-8 rounded-lg bg-bg-accent flex items-center justify-center text-[10px]">{name[0]}</div>
                  {name}
                </div>
                <button className="text-[10px] bg-primary/20 text-primary hover:bg-primary hover:text-white px-3 py-1 rounded-full font-bold transition-all">
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedPage
