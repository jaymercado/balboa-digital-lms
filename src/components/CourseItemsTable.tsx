'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
} from '@coreui/react-pro'
import getCourseItemStatus from '@/utils/getCourseItemStatus'
import { useGetCourse } from '@/hooks/useGetCourses'
import { useGetCourseItems } from '@/hooks/useGetCourseItems'
import { useGetUserCourseItemLogs } from '@/hooks/useGetUserCourseItemLogs'
import { Loading } from '@/components'
import CertificateGenerator from './CertificateGenerator'

interface CourseItemsTableProps {
  courseId: string
  userIsAdmin?: boolean
  userIsInstructor?: boolean
}

export default function CourseItemsTable({
  courseId,
  userIsAdmin = false,
  userIsInstructor = false,
}: CourseItemsTableProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { course, fetchingCourse } = useGetCourse({ courseId })
  const { courseItems, fetchingCourseItems, courseItemsNotFound } = useGetCourseItems({ courseId })
  const { userCourseItemLogs, fetchingUserCourseItemLogs } = useGetUserCourseItemLogs({
    courseId,
  })

  const getBasePath = () => {
    if (userIsAdmin) return '/all-courses'
    if (userIsInstructor) return '/managed-courses'
    return '/enrolled-courses'
  }

  useEffect(() => {
    if (!fetchingCourseItems && courseItemsNotFound) {
      router.replace('/404')
    }
  }, [fetchingCourseItems, courseItemsNotFound])

  if (fetchingCourseItems) {
    return <Loading />
  }

  if (courseItemsNotFound) {
    return null
  }

  return (
    <CTable striped>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>
            <small>ID</small>
          </CTableHeaderCell>
          <CTableHeaderCell>
            <small>Title</small>
          </CTableHeaderCell>
          <CTableHeaderCell>
            <small>Type</small>
          </CTableHeaderCell>
          <CTableHeaderCell>
            <small>Status</small>
          </CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {courseItems.length > 0 ? (
          courseItems.map((item) => (
            <CTableRow key={item.id} align="middle">
              <CTableDataCell>
                <Link
                  href={`${getBasePath()}/${courseId}/items/${item.id}`}
                  className="text-decoration-none"
                >
                  <span className="fw-semibold">{item.id}</span>
                </Link>
              </CTableDataCell>
              <CTableDataCell>
                <span className="fw-semibold">{item.title}</span>
              </CTableDataCell>
              <CTableDataCell>
                <span className="text-capitalize">{item.type}</span>
              </CTableDataCell>
              <CTableDataCell>
                <CBadge
                  className="text-capitalize"
                  shape="rounded-pill"
                  color={
                    fetchingUserCourseItemLogs
                      ? 'secondary'
                      : item.type === 'quiz'
                      ? userCourseItemLogs?.find((log) => log.courseItemId === item.id)?.courseItem
                          .score === 100
                        ? 'success'
                        : 'danger'
                      : getCourseItemStatus(
                          userCourseItemLogs?.find((log) => log.courseItemId === item.id),
                        ) === 'Completed'
                      ? 'success'
                      : 'danger'
                  }
                >
                  {fetchingUserCourseItemLogs && 'Loading...'}
                  {!fetchingUserCourseItemLogs &&
                    getCourseItemStatus(
                      userCourseItemLogs?.find((log) => log.courseItemId === item.id),
                    )}
                </CBadge>
              </CTableDataCell>
            </CTableRow>
          ))
        ) : (
          <CTableRow>
            <CTableDataCell colSpan={4} className="text-center">
              No items available
            </CTableDataCell>
          </CTableRow>
        )}
        {courseItems.length > 0 &&
          courseItems.every(
            (item) =>
              getCourseItemStatus(
                userCourseItemLogs?.find((log) => log.courseItemId === item.id),
              ) === 'Completed' ||
              getCourseItemStatus(
                userCourseItemLogs?.find((log) => log.courseItemId === item.id),
              ) === '100/100',
          ) && (
            <CTableRow>
              <CTableDataCell colSpan={4} className="text-center">
                <CertificateGenerator
                  name={session?.user.name}
                  course={course?.title}
                  instructors={course?.instructors}
                />
              </CTableDataCell>
            </CTableRow>
          )}
      </CTableBody>
    </CTable>
  )
}
