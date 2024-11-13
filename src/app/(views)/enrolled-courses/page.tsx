'use client'

import React from 'react'
import Link from 'next/link'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CProgress
} from '@coreui/react-pro'
import useGetCourses from '@/hooks/useGetCourses'
import { Loading } from '@/components'

export default function ManagedCourses() {
  const { courses, fetchingCourses } = useGetCourses({ type: 'enrolled' })

  return (
    <div>
      <h2 className="mb-4 text-center">Featured Courses</h2>

      <div className="d-grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', justifyContent: 'left' }}>
        {fetchingCourses ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Loading />
        </div>
        ) : courses.length === 0 ? (
          <CCard className="mb-4" style={{ width: '100%' }}>
            <CCardBody>No courses found</CCardBody>
          </CCard>
        ) : (
          courses.map((course) => (
            <Link
              key={course.id}
              href={`/enrolled-courses/${course.id}`}
              passHref
              style={{ textDecoration: 'none' }} 
            >
              <CCard className="mb-4" style={{ width: '100%', cursor: 'pointer' }}>
                <div
                  style={{
                    height: '150px',
                    backgroundImage: 'url(https://via.placeholder.com/150)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%',
                  }}
                  className="card-img-top"
                />
                <CCardBody>
                  <CProgress value={course.progress || 0} max={100} style={{ position: 'relative' }}>
                    {course.progress === 100 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      >
                        Completed
                      </span>
                    )}
                  </CProgress>
                  <div className="mb-3" />
                  <CCardTitle>{course.title}</CCardTitle>
                  <CCardText>{course.description}</CCardText>
                </CCardBody>
              </CCard>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}