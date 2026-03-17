import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Loader2, Info } from 'lucide-react'
import api from '../api/axios'
import { toast } from 'react-toastify'

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match')
    }
    if (!formData.email.endsWith('@gla.ac.in')) {
      return toast.error('Only GLA University emails are allowed')
    }

    setLoading(true)
    try {
      const { data } = await api.post('/auth/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
      toast.success(data.message)
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass p-8 rounded-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Join Swastik
          </h1>
          <p className="text-text-secondary text-sm">The exclusive network for GLA Students.</p>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex gap-3">
          <Info className="text-primary shrink-0" size={20} />
          <p className="text-[11px] text-primary/90 leading-relaxed uppercase tracking-tight font-bold">
            Note: You must use your official @gla.ac.in email address to complete registration.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-text-muted uppercase ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="text"
                required
                placeholder="johndoe_gla"
                className="w-full bg-bg-accent/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 focus:bg-bg-accent/60 transition-all text-sm"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-text-muted uppercase ml-1">University Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="email"
                required
                placeholder="name.id@gla.ac.in"
                className="w-full bg-bg-accent/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 focus:bg-bg-accent/60 transition-all text-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted uppercase ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-bg-accent/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 focus:bg-bg-accent/60 transition-all text-sm"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted uppercase ml-1">Confirm</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-bg-accent/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 focus:bg-bg-accent/60 transition-all text-sm"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:col-span-2 bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-primary/20"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
