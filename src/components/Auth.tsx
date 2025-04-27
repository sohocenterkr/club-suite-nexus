import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({ email })
      
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      console.error('Error sending magic link:', error)
      alert('Error sending magic link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm p-6 border rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              className="w-full p-2 border rounded"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Send magic link'}
          </button>
        </form>
      </div>
    </div>
  )
}
