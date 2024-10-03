'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import useGetCourses from '@/hooks/useGetCourses'

export default function Modules() {
  const params = useParams()
  const { courseId } = params as { courseId: string }

  const { courses, fetchingCourses } = useGetCourses({ courseId })

  if (fetchingCourses) {
    return <div>Loading...</div>
  }

  return (
    <table>
      <thead>
        <tr>
          <th colSpan={3}>
            <Link href={`/managed-courses/${courses[0]?._id}/modules/create`}>Create Module</Link>
          </th>
        </tr>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {courses[0]?.modules.map((module) => (
          <tr key={module._id}>
            <td>
              <Link href={`/managed-courses/${courses[0]?._id}/modules/${module._id}`}>
                {module._id}
              </Link>
            </td>
            <td>{module.title}</td>
            <td>{module.type}</td>
            <td>
              <Link href={`/managed-courses/${courses[0]?._id}/modules/${module._id}/edit`}>
                Edit
              </Link>
              <button type="button" onClick={() => {}}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
