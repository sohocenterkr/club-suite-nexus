"use client";
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'

export default function Home() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // 세션 변경 리스너 설정
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Club Suite Nexus</h1>
        {!session ? <Auth /> : <p>You're logged in!</p>}
      </div>
    </main>
  )
}
