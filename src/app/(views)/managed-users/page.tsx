'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const ManagedUsers = () => {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user?.role !== 'instructor') {
      router.push('/')
    }
  }, [session, router])

  return <h1>Managed Users</h1>
}

export default ManagedUsers
