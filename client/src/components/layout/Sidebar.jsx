import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Users, 
  MessageSquare, 
  Hash, 
  Shuffle, 
  Calendar, 
  BookOpen,
  Settings
} from 'lucide-react'

const Sidebar = () => {
  const navItems = [
    { name: 'Feed', icon: Home, path: '/' },
    { name: 'Groups', icon: Users, path: '/groups' },
    { name: 'Discussion', icon: BookOpen, path: '/discussion' },
    { name: 'Anonymous', icon: Hash, path: '/anonymous' },
    { name: 'Random Chat', icon: Shuffle, path: '/random-chat' },
    { name: 'Events', icon: Calendar, path: '/events' },
  ]

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 glass border-r border-white/5 p-4 hidden lg:block overflow-y-auto">
      <div className="space-y-6">
        <div>
          <p className="px-4 text-[11px] font-bold text-text-muted uppercase tracking-wider mb-4">
            Navigation
          </p>
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-primary/20 text-primary font-semibold border border-primary/20' 
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'}
                `}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <p className="px-4 text-[11px] font-bold text-text-muted uppercase tracking-wider mb-4">
            Your Groups
          </p>
          <div className="px-4 text-xs text-text-muted italic">
            No groups joined yet
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-white/5">
          <NavLink
            to="/settings"
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}
            `}
          >
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
