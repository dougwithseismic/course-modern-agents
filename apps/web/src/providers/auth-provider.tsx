'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

type LoadingState = 'idle' | 'progress' | 'complete' | 'error'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  loadingState: LoadingState
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: (options?: {
    redirect?: boolean
    destinationUrl?: string
  }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 Attempting sign in:', { email })
      setLoadingState('progress')
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        console.error('❌ Sign in error:', error)
        setLoadingState('error')
        throw error
      }
      setLoadingState('complete')
      console.log('✅ Sign in successful, redirecting to dashboard')
      router.push('/dashboard')
    } catch (error) {
      console.error('❌ Sign in failed:', error)
      throw error
    } finally {
      console.log('🔄 Sign in process complete')
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setLoadingState('progress')
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setLoadingState('error')
        throw error
      }
      setLoadingState('complete')
      router.push('/dashboard')
    } catch (error) {
      console.error('Sign up failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async ({
    redirect = true,
    destinationUrl = '/login',
  }: { redirect?: boolean; destinationUrl?: string } = {}) => {
    try {
      setLoadingState('progress')
      const { error } = await supabaseClient.auth.signOut()
      if (error) {
        setLoadingState('error')
        throw error
      }
      setLoadingState('complete')
      if (redirect) router.push(destinationUrl)
    } catch (error) {
      console.error('Sign out failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isLoading,
    loadingState,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
