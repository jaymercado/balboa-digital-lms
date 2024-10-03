'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useGetModules from '@/hooks/useGetModules'
import toast from '@/utils/toast'

const typeOptions = [
  { value: '', label: '-- Select --' },
  { value: 'text', label: 'Text' },
  { value: 'video', label: 'Video' },
  { value: 'image', label: 'Image' },
  { value: 'pdf', label: 'PDF' },
]

export default function EditModule() {
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
    return <div>Loading...</div>
  }

  return (
    <div>
      <Link href={`/managed-courses/${courseId}/modules/${moduleId}/edit`}>Edit</Link> /
      <button
        type="button"
        onClick={() => deleteModule(courseModule._id)}
        disabled={deletingModule}
      >
        Delete
      </button>
      <section>
        <p>ID: {courseModule._id}</p>
        <p>Title: {courseModule.title}</p>
        <p>Description: {courseModule.description}</p>
        <p>Type: {courseModule.type}</p>
        <p>Content: {courseModule.content}</p>
      </section>
    </div>
  )
}

type Inputs = {
  title: string
  description: string
  type: string
  content: string
}
