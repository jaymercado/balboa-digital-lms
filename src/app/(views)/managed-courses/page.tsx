'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardText,
  CCardFooter,
  CButton,
  CProgress,
  CProgressBar,
} from '@coreui/react-pro'
import { Course } from '@/types/course'
import useGetCourses from '@/hooks/useGetCourses'
import toast from '@/utils/toast'
import { Loading } from '@/components'

export default function ManagedCourses() {
  const [deletingCourse, setDeletingCourse] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ongoing')
  const { courses, setCourses, fetchingCourses } = useGetCourses({ type: 'managed' })

  function deleteCourse(courseId) {
    setDeletingCourse(courseId)
    fetch(`/api/courses/${courseId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((deletedCourse) => {
        setCourses(courses.filter((course) => course?._id !== deletedCourse?._id))
        toast('success', 'Course deleted successfully')
      })
      .catch((err) => {
        console.error(err)
        toast('error', 'Error deleting course')
      })
      .finally(() => setDeletingCourse(''))
  }

  // Filter courses based on the selected status
  const filteredCourses = courses.filter((course) => {
    if (selectedStatus === 'all') return true
    return course.status === selectedStatus
  })

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Courses</h5>
          <CButton color="primary" variant="outline" size="sm" href="/managed-courses/create">
            Create
          </CButton>
        </CCardHeader>
        
        {/* Individual Pill Buttons for Status Filters */}
        <div className="p-3 d-flex">
          {['all', 'ongoing', 'complete'].map((status) => (
            <CButton
              color={selectedStatus === status ? 'primary' : 'secondary'}
              shape="pill"
              onClick={() => setSelectedStatus(status)}
              key={status}
              className="me-2"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </CButton>
          ))}
        </div>

        <CCardBody>
          {fetchingCourses ? (
            <Loading />
          ) : (
            <div className="d-flex flex-wrap">
              {filteredCourses.length === 0 ? (
                <div>No courses found</div>
              ) : (
                filteredCourses.map((course) => (
                  <CCard key={course._id} className="m-2" style={{ width: '18rem' }}>
                    <img
                      src="https://via.placeholder.com/150"
                      alt="Course Image"
                      className="card-img-top"
                      style={{ height: '150px', objectFit: 'cover' }}
                    />
                    <CCardBody>
                      <h5 className="card-title">
                        <Link href={`/managed-courses/${course._id}`}>{course.title}</Link>
                      </h5>
                      <CCardText>{course.description}</CCardText>
                      {/* Progress Bar for Course Progress */}
                      <CProgress className="mt-3" style={{ height: '8px' }}>
                        <CProgressBar color="success" value={course.progress}>
                          {course.progress}%
                        </CProgressBar>
                      </CProgress>
                    </CCardBody>
                    <CCardFooter>
                      <CButton
                        color="primary"
                        variant="outline"
                        size="sm"
                        href={`/managed-courses/${course._id}/edit`}
                      >
                        Edit
                      </CButton>
                      <CButton
                        color="danger"
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCourse(course._id)}
                        disabled={deletingCourse === course._id}
                        className="ms-2"
                      >
                        Delete
                      </CButton>
                    </CCardFooter>
                  </CCard>
                ))
              )}
            </div>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}
