import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { User as UserIcon, Calendar, MapPin, Users, Edit3, Loader2 } from 'lucide-react'
import api from '../api/axios'
import PostCard from '../components/posts/PostCard'

const ProfilePage = () => {
  const { id } = useParams()
  const { user: currentUser } = useSelector(state => state.auth)
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const isOwnProfile = id === currentUser?._id

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/${id}`)
        setUser(data)
        // In a real app we'd fetch user posts specifically, for now we reuse feed logic filtered
        const { data: feedData } = await api.get('/posts/feed')
        setPosts(feedData.filter(p => p.author._id === id))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [id])

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Profile Header */}
      <div className="glass rounded-[40px] overflow-hidden border border-white/5">
        <div className="h-48 bg-gradient-to-r from-primary/30 via-bg-accent to-blue-500/30 relative">
          <div className="absolute -bottom-16 left-10 p-2 bg-bg-dark rounded-[40px]">
            <div className="w-32 h-32 rounded-[32px] bg-primary flex items-center justify-center overflow-hidden border-4 border-bg-dark shadow-2xl">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={64} className="text-white" />
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-20 pb-10 px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4 max-w-lg">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                {user?.username}
                <span className="text-[10px] bg-primary/20 text-primary px-3 py-1 rounded-full uppercase tracking-widest font-black">
                  {user?.universityBadge || 'Student'}
                </span>
              </h1>
              <p className="text-text-muted text-sm italic mt-1">@{user?.username.toLowerCase()}</p>
            </div>
            
            <p className="text-sm text-text-secondary leading-relaxed">
              {user?.bio || "No bio yet. This student is busy building the future!"}
            </p>

            <div className="flex flex-wrap gap-5 text-sm text-text-muted font-medium">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" /> {user?.university}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary" /> Joined Mar 2026
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isOwnProfile ? (
              <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 border border-white/5">
                <Edit3 size={18} /> Edit Profile
              </button>
            ) : (
              <button className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20">
                Follow Student
              </button>
            )}
          </div>
        </div>

        <div className="px-12 py-6 border-t border-white/5 flex gap-10">
          <div className="text-center">
            <p className="text-xl font-bold">{posts.length}</p>
            <p className="text-[10px] text-text-muted uppercase font-black">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{user?.followers?.length || 0}</p>
            <p className="text-[10px] text-text-muted uppercase font-black">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{user?.friends?.length || 0}</p>
            <p className="text-[10px] text-text-muted uppercase font-black">Friends</p>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold px-2">Activity</h2>
        <div className="grid grid-cols-1 gap-6">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
          {posts.length === 0 && (
            <div className="text-center py-20 glass rounded-3xl space-y-3">
              <p className="text-text-muted italic">This student hasn't posted anything yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
