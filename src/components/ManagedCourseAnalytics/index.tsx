'use client'

import React from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react-pro'
import { useGetCourseAnalytics } from '@/hooks/useGetCourseAnalytics'
import { useGetCourseItems } from '@/hooks/useGetCourseItems'

export default function ManagedCourseAnalytics({ courseId }: { courseId: string }) {
  const { courseAnalytics } = useGetCourseAnalytics({ type: 'managed', courseId })
  const { courseItems } = useGetCourseItems({ courseId })

  return (
    <CTable striped>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>
            <small>Student</small>
          </CTableHeaderCell>
          {courseItems?.map((item) => (
            <CTableHeaderCell key={item.id}>
              <small>{item.title}</small>
            </CTableHeaderCell>
          ))}
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {courseAnalytics?.students?.length === 0 && (
          <CTableRow>
            <CTableDataCell colSpan={4} className="text-center">
              No data available
            </CTableDataCell>
          </CTableRow>
        )}
        {courseAnalytics?.students?.map((student) => {
          return (
            <CTableRow key={student.id}>
              <CTableDataCell>{student.name}</CTableDataCell>
              {courseItems.map((item) => {
                const courseItemLog = student.courseItemLogs.find(
                  (log) => log.courseItem.id === +item.id,
                )
                let text = courseItemLog?.completed ? 'Completed' : 'Incomplete'
                if (courseItemLog?.courseItem.type === 'quiz') {
                  text = `${courseItemLog?.courseItem.score}/100`
                }
                return <CTableDataCell key={item.id}>{text}</CTableDataCell>
              })}
            </CTableRow>
          )
        })}
      </CTableBody>
    </CTable>
  )
}
