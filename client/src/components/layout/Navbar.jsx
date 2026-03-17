import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Bell, Search, LogOut, User as UserIcon } from 'lucide-react'
import { logout } from '../../store/slices/authSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const { unreadCount } = useSelector(state => state.notifications)
  const [searchTerm, setSearchTerm] = useState('')

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 glass z-50 px-6 flex items-center justify-between border-b border-white/5">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          Swastik
        </Link>
      </div>

      <div className="hidden md:flex items-center bg-bg-accent/50 rounded-full px-4 py-1.5 w-96 border border-white/5 focus-within:border-primary/50 transition-all">
        <Search size={18} className="text-text-muted" />
        <input
          type="text"
          placeholder="Search students, groups..."
          className="bg-transparent border-none outline-none px-3 py-1 w-full text-sm text-text-primary placeholder:text-text-muted"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-5">
        <Link to="/notifications" className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
          <Bell size={22} className="text-text-secondary" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
              {unreadCount}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-3 border-l border-white/10 pl-5">
          <Link to={`/profile/${user?._id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center overflow-hidden border border-primary/20">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={20} className="text-white" />
              )}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold leading-tight">{user?.username}</p>
              <p className="text-[11px] text-text-muted leading-tight">{user?.universityBadge || 'Student'}</p>
            </div>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-full transition-all text-text-muted"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
