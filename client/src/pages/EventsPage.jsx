import React, { useEffect, useState } from 'react'
import { Calendar, MapPin, Link as LinkIcon, Plus, Send, Users, Check, ExternalLink } from 'lucide-react'
import api from '../api/axios'
import moment from 'moment'
import { toast } from 'react-toastify'

const EventsPage = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events')
        setEvents(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const handleRegister = async (id) => {
    try {
      const { data } = await api.post(`/events/${id}/register`)
      setEvents(events.map(e => e._id === id ? data : e))
      toast.success('Registration status updated!')
    } catch (err) {
      toast.error('Failed to register')
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">University Events</h1>
          <p className="text-text-secondary text-sm">Hackathons, workshops, and campus meetups.</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
          <Plus size={20} />
          Organize Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event._id} className="glass rounded-3xl overflow-hidden border border-white/5 flex flex-col hover:border-primary/20 transition-all group">
            <div className="h-40 bg-bg-accent/40 relative overflow-hidden">
               <div className="absolute top-4 right-4 bg-bg-dark/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-center">
                  <p className="text-xs font-black text-primary leading-none uppercase">{moment(event.date).format('MMM')}</p>
                  <p className="text-lg font-black leading-tight">{moment(event.date).format('DD')}</p>
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent"></div>
               <div className="absolute bottom-4 left-6">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{event.title}</h3>
               </div>
            </div>

            <div className="p-6 space-y-6 flex-1 flex flex-col">
              <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
                {event.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-text-muted font-medium">
                  <Calendar size={16} className="text-primary" />
                  {moment(event.date).format('dddd, hh:mm A')}
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted font-medium">
                  <MapPin size={16} className="text-primary" />
                  {event.location}
                </div>
              </div>

              <div className="pt-6 mt-auto border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full bg-primary/20 border-2 border-bg-card flex items-center justify-center text-[8px] font-bold">U</div>
                     ))}
                  </div>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-tighter">
                    {event.attendees?.length || 0} Registered
                  </p>
                </div>

                <div className="flex gap-2">
                  {event.registrationLink && (
                    <a 
                      href={event.registrationLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-text-secondary"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                  <button 
                    onClick={() => handleRegister(event._id)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                      event.attendees?.includes('REPLACE_WITH_USER_ID') // Placeholder for real check
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/10'
                    }`}
                  >
                    REGISTER <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && !loading && (
          <div className="col-span-full text-center py-20 glass rounded-3xl space-y-4">
            <Calendar size={48} className="mx-auto text-text-muted opacity-20" />
            <p className="text-text-muted font-mediumitalic">No upcoming events scheduled. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventsPage
