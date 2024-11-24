'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import useGetCourses from '@/hooks/useGetCourses'
import { Loading } from '@/components'

export default function Modules() {
  const params = useParams()
  const { courseId } = params as { courseId: string }

  const { courses, fetchingCourses } = useGetCourses({ courseId })

  if (fetchingCourses) {
    return <Loading />
  }

  return (
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
        {courses[0]?.modules.map((module) => (
          <tr key={module.id}>
            <td>
              <Link href={`/enrolled-courses/${courses[0]?.id}/modules/${module.id}`}>
                {module.id}
              </Link>
            </td>
            <td>{module.title}</td>
            <td>{module.type}</td>
            <td dangerouslySetInnerHTML={{ __html: module.content }} />
          </tr>
        ))}
      </tbody>
    </table>
  )
}
