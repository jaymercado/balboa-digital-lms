'use client'
import { Loading } from '@/components'
import useGetUser from '@/hooks/useGetUser'
import { useParams } from 'next/navigation'
import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react-pro'
import useGetUserCourses from '@/hooks/useGetUserCourses'
import Link from 'next/link'

export default function User() {
  const params = useParams()
  const { userId } = params as { userId: string }
  const { user, fetchingUser, userNotFound, courses } = useGetUser(userId)

  console.log(user)
  console.log(courses)

  if (fetchingUser) {
    return <Loading />
  }

  if (userNotFound) {
    return <div>User not found</div>
  }

  return (
    <div>
      <CCard className="mb-4">
        <CCardBody>
          <h4 className="mb-4">User Details</h4>
          <div className="mb-3">
            <strong>Name:</strong> {user?.name}
          </div>
          <div className="mb-3">
            <strong>Email:</strong> {user?.email}
          </div>
          <div className="mb-3">
            <strong>Role:</strong> {user?.role}
          </div>
        </CCardBody>
      </CCard>

      <CCard>
        <CCardBody>
          <h4 className="mb-4">Completed Courses</h4>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Course Name</CTableHeaderCell>
                <CTableHeaderCell>Description</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <CTableRow key={course.id}>
                    <CTableDataCell>
                      <Link href={`/all-courses/${course.id}`} className="text-decoration-none">
                        {course.id}
                      </Link>
                    </CTableDataCell>
                    <CTableDataCell>
                      <Link href={`/all-courses/${course.id}`} className="text-decoration-none">
                        {course.title}
                      </Link>
                    </CTableDataCell>
                    <CTableDataCell>
                      {course.description.length > 50
                        ? `${course.description.slice(0, 50)}...`
                        : course.description}
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={2}>No completed courses found</CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  )
}
