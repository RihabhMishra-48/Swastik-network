import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import api from '../api/axios'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setMessage('No verification token found.')
      return
    }

    const verify = async () => {
      try {
        const { data } = await api.get(`/auth/verify-email?token=${token}`)
        setStatus('success')
        setMessage(data.message)
      } catch (err) {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Verification failed')
      }
    }

    verify()
  }, [searchParams])

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass p-10 rounded-3xl text-center space-y-6">
        {status === 'verifying' && (
          <div className="space-y-4">
            <Loader2 className="mx-auto text-primary animate-spin" size={48} />
            <h2 className="text-2xl font-bold">Verifying your email...</h2>
            <p className="text-text-secondary">This will only take a moment.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 animate-in zoom-in duration-500">
            <CheckCircle className="mx-auto text-green-500" size={64} />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
              <p className="text-text-secondary">{message}</p>
            </div>
            <Link 
              to="/login"
              className="inline-block w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-2xl transition-all"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 animate-in zoom-in duration-500">
            <XCircle className="mx-auto text-red-500" size={64} />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
              <p className="text-red-400/80">{message}</p>
            </div>
            <Link 
              to="/signup"
              className="inline-block w-full bg-bg-accent hover:bg-bg-accent/80 text-white font-bold py-3.5 rounded-2xl transition-all"
            >
              Try Signing Up Again
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyEmailPage
