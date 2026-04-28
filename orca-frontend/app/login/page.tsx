'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Chrome, ArrowRight } from 'lucide-react'
import { AuthCard } from '@/components/auth-card'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('') 

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Map the 'email' input to the 'username' key our Spring Boot backend expects
        body: JSON.stringify({ username: email, password: password }),
      });

      if (res.ok) {
        const data = await res.json();
        // Save the secure JWT to local storage
        localStorage.setItem("orca_token", data.token);
        // Route them to the Master Project List
        router.push("/projects");
      } else {
        setError("Invalid credentials. Please check your username and password.");
      }
    } catch (err) {
      setError("Cannot connect to the O.R.C.A. Backend. Is the server running?");
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    // Simulate Google OAuth flow for now
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    console.log('Google sign in initiated')
  }

  return (
    <AuthCard
      title="O.R.C.A."
      subtitle="Sign in to your operations dashboard"
      footerText={
        <>
          Don't have an account?{' '}
          <Link href="/signup" className="text-zinc-700 hover:text-black font-medium transition-colors">
            Create one
          </Link>
        </>
      }
    >
      {/* Error Message Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-lg">
          {error}
        </div>
      )}

      {/* Sign In Form */}
      <form onSubmit={handleSignIn} className="space-y-4 mb-6">
        {/* Email/Username Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-900 mb-2">
            Email or Username
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
            <input
              id="email"
              type="text" 
              placeholder="John Doe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-900 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white font-medium py-2.5 rounded-lg hover:bg-zinc-800 active:bg-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Authenticating...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-zinc-500">or continue with</span>
        </div>
      </div>

      {/* Google Sign In Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 text-zinc-900 font-medium py-2.5 rounded-lg hover:bg-zinc-50 active:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Chrome className="w-5 h-5" />
        <span>Sign in with Google</span>
      </button>
    </AuthCard>
  )
}