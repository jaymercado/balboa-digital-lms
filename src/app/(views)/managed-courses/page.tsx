'use client'

import { CCard, CCardHeader, CCardBody } from '@coreui/react-pro'
import { CreateLink } from '@/components'
import useGetManagedCoursesByUser from '@/hooks/useGetManagedCoursesByUser'

const ManagedCourses = () => {
  useGetManagedCoursesByUser()
  return (
    <CCard className="mb-4">
      <CCardHeader>
        Courses
        <CreateLink href="/managed-courses/create" text="Create" />
      </CCardHeader>
      <CCardBody></CCardBody>
    </CCard>
  )
}

export default ManagedCourses
