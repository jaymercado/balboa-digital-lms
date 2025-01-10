'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const Users = () => {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user?.role !== 'admin') {
      router.push('/')
    }
  }, [session, router])

  return <h1>Users</h1>
}

export default Users
