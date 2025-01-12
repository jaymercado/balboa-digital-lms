'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function AllCourses() {
  const router = useRouter()
  const { data: session } = useSession()

  if (session?.user?.role && session?.user?.role !== 'admin') {
    router.push('/')
  }

  return <div>All Courses</div>
}
