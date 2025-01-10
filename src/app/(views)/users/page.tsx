'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const Users = () => {
  const { data: session } = useSession()
  const router = useRouter()

  if (session?.user?.role && session?.user?.role !== 'admin') {
    router.push('/')
  }

  return <h1>Users</h1>
}

export default Users
