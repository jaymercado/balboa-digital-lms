'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import StudentDashboard from '@/components/StudentDashboard'
import InstructorDashboard from '@/components/InstructorDashboard'
import AdminDashboard from '@/components/AdminDashboard'

const Dashboard = () => {
  const { data: session } = useSession()

  const role = session?.user?.role
  if (role === 'admin') {
    return <AdminDashboard />
  } else if (role === 'instructor') {
    return <InstructorDashboard />
  } else {
    return <StudentDashboard />
  }
}

export default Dashboard
