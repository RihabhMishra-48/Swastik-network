import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bell, Heart, MessageSquare, UserPlus, Info, Check } from 'lucide-react'
import { setNotifications, markAllRead } from '../store/slices/notificationSlice'
import api from '../api/axios'
import moment from 'moment'

const NotificationsPage = () => {
  const dispatch = useDispatch()
  const { list } = useSelector(state => state.notifications)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications')
        dispatch(setNotifications(data))
      } catch (err) {
        console.error(err)
      }
    }
    fetchNotifications()
  }, [dispatch])

  const handleMarkRead = async () => {
    try {
      await api.put('/notifications/read')
      dispatch(markAllRead())
    } catch (err) {
      console.error(err)
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'post_like': return <Heart className="text-red-400" size={18} />
      case 'post_comment': return <MessageSquare className="text-blue-400" size={18} />
      case 'friend_request': return <UserPlus className="text-green-400" size={18} />
      default: return <Bell className="text-primary" size={18} />
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-right-10 duration-500">
      <div className="flex items-center justify-between px-2">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Bell size={24} className="text-primary" />
          Notifications
        </h1>
        <button 
          onClick={handleMarkRead}
          className="text-xs font-bold text-primary hover:bg-primary/10 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
        >
          <Check size={16} /> Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {list.map((note) => (
          <div 
            key={note._id} 
            className={`glass p-5 rounded-2xl flex items-center justify-between border-l-4 transition-all hover:translate-x-1 ${
              note.read ? 'border-transparent opacity-80' : 'border-primary bg-primary/5'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-bg-accent/50 rounded-xl">
                {getIcon(note.type)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-relaxed">{note.data?.text || 'New activity on your profile'}</p>
                <div className="flex items-center gap-2 text-[10px] text-text-muted">
                  <span className="font-bold text-text-secondary uppercase tracking-tight">{note.type.replace('_', ' ')}</span>
                  <span>•</span>
                  <span>{moment(note.createdAt).fromNow()}</span>
                </div>
              </div>
            </div>
            
            <button className="p-2 hover:bg-white/5 rounded-full text-text-muted">
              <Info size={16} />
            </button>
          </div>
        ))}

        {list.length === 0 && (
          <div className="text-center py-20 glass rounded-3xl space-y-4">
            <Bell size={48} className="mx-auto text-text-muted opacity-20" />
            <p className="text-text-muted font-medium">All caught up! No new notifications.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage
