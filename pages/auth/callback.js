import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the code from URL
        const { code } = router.query

        if (code) {
          // Exchange code for session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('Auth error:', error)
            router.push('/login?error=verification_failed')
            return
          }

          if (data?.session) {
            // Success! Redirect to dashboard
            router.push('/dashboard')
          }
        }
      } catch (err) {
        console.error('Error:', err)
        router.push('/login')
      }
    }

    if (router.isReady) {
      handleAuthCallback()
    }
  }, [router.isReady, router.query])

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Verifying your email...</h1>
      <p>Please wait while we confirm your account.</p>
    </div>
  )
}
