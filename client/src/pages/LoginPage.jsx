import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react'
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice'
import api from '../api/axios'
import { toast } from 'react-toastify'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { loading } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())
    try {
      const { data } = await api.post('/auth/login', { email, password })
      dispatch(loginSuccess({ user: data, token: data.token }))
      toast.success('Welcome back to Swastik!')
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      dispatch(loginFailure(msg))
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass p-8 rounded-3xl space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Swastik
          </h1>
          <p className="text-text-secondary text-sm">Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted uppercase ml-1">University Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="email"
                required
                placeholder="university-id@gla.ac.in"
                className="w-full bg-bg-accent/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 focus:bg-bg-accent/60 transition-all text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Login
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-text-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline font-semibold">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
