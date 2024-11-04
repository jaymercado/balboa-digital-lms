'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useGetModules from '@/hooks/useGetModules'
import toast from '@/utils/toast'
import { Loading } from '@/components'

export default function Module() {
  const router = useRouter()
  const params = useParams()
  const { courseId, moduleId } = params as { courseId: string; moduleId: string }
  const { courseModules, fetchingModules } = useGetModules({ courseId, moduleId })
  const courseModule = courseModules[0]
  const [deletingModule, setDeletingModule] = useState(false)

  function deleteModule(moduleId: string) {
    setDeletingModule(true)
    fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        toast('success', 'Module deleted successfully')
        router.push(`/managed-courses/${courseId}`)
      })
      .catch((err) => {
        console.error(err)
        toast('error', 'Error deleting course')
      })
      .finally(() => setDeletingModule(false))
  }

  if (fetchingModules || !courseModule) {
    return <Loading />
  }

  return (
    <div>
      <Link href={`/managed-courses/${courseId}/modules/${moduleId}/edit`}>Edit</Link> /
      <button
        type="button"
        onClick={() => deleteModule(courseModule.id)}
        disabled={deletingModule}
      >
        Delete
      </button>
      <section>
        <p>ID: {courseModule.id}</p>
        <p>Title: {courseModule.title}</p>
        <p>Description: {courseModule.description}</p>
        <p>Type: {courseModule.type}</p>
        <p>Content: {courseModule.content}</p>
      </section>
    </div>
  )
}
