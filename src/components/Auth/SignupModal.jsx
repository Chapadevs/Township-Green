import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const { data, error } = await signUp(formData.email, formData.password, formData.fullName)
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => {
        onClose()
        // Reset form
        setFormData({ fullName: '', email: '', password: '', confirmPassword: '' })
        setSuccess(false)
      }, 2000)
    }
    setLoading(false)
  }

  const handleClose = () => {
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' })
    setError('')
    setSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1d2d25] rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">Join Township Green</h2>
        
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-3 py-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 px-3 py-2 rounded mb-3 text-sm">
            Account created successfully! Logging you in...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-white mb-1.5 text-xs font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none transition-colors text-sm h-10"
              placeholder="John Doe"
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-white mb-1.5 text-xs font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none transition-colors text-sm h-10"
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-white mb-1.5 text-xs font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none transition-colors text-sm h-10"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              minLength={6}
            />
            <p className="text-xs text-gray-400 mt-0.5">Minimum 6 characters</p>
          </div>

          <div>
            <label className="block text-white mb-1.5 text-xs font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none transition-colors text-sm h-10"
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-[#23a867] text-white py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm h-10 mt-1"
          >
            {loading ? 'Creating Account...' : success ? 'Success!' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4 text-sm">
          Already have an account?{' '}
          <button 
            onClick={onSwitchToLogin} 
            className="text-[#23a867] hover:underline font-medium"
          >
            Login
          </button>
        </p>

        <button
          onClick={handleClose}
          className="mt-3 w-full text-gray-400 hover:text-white py-1.5 transition-colors text-sm"
        >
          Close
        </button>
      </div>
    </div>
  )
}
