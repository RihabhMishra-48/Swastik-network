import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Search, Users, Shield, Globe, Lock } from 'lucide-react'
import api from '../api/axios'
import { setGroups } from '../store/slices/groupSlice'
import { Link } from 'react-router-dom'

const GroupsPage = () => {
  const dispatch = useDispatch()
  const { list, loading } = useSelector(state => state.groups)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data } = await api.get('/groups')
        dispatch(setGroups(data))
      } catch (err) {
        console.error(err)
      }
    }
    fetchGroups()
  }, [dispatch])

  const filteredGroups = list.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-text-secondary text-sm">Join campus communities and collaborate.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Find groups..."
              className="bg-bg-accent/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary transition-all text-sm w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
            <Plus size={18} />
            Create
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map(group => (
          <Link 
            key={group._id} 
            to={`/groups/${group._id}`}
            className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group animate-in fade-in slide-in-from-bottom-3 duration-500"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <Users size={24} />
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                group.type === 'public' ? 'bg-green-500/10 text-green-400' :
                group.type === 'private' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
              }`}>
                {group.type}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{group.name}</h3>
              <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
                {group.description}
              </p>
            </div>

            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-1 text-[11px] text-text-muted font-semibold">
                <Users size={14} />
                {group.membersCount || 0} Members
              </div>
              <div className="flex items-center gap-1 text-[11px] text-text-muted font-semibold">
                <Shield size={14} />
                {group.admin?.username || 'System'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default GroupsPage
