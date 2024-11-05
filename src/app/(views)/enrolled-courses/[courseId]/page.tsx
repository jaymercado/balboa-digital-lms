'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import useGetCourses from '@/hooks/useGetCourses'
import { Loading } from '@/components'

export default function Course() {
  const params = useParams()
  const { courseId } = params as { courseId: string }
  const { courses, fetchingCourses } = useGetCourses({ courseId })
  const course = courses[0]

  if (fetchingCourses || !course) {
    return <Loading />
  }

  return (
    <div>
      <p>Title: {course.title}</p>
      <p>Description: {course.description}</p>
      <p>
        Instructors:
        {course.instructors.map((instructor, index) => (
          <span key={instructor.id}>
            {instructor?.name} {index < course.instructors.length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          {course.modules.map((module) => (
            <tr key={module.id}>
              <td>
                <Link href={`/enrolled-courses/${course.id}/modules/${module.id}`}>{module.id}</Link>
              </td>
              <td>{module.title}</td>
              <td>{module.type}</td>
              <td dangerouslySetInnerHTML={{ __html: module.content }} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
