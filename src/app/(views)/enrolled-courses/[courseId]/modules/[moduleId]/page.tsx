'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import useGetModules from '@/hooks/useGetModules'
import { Loading } from '@/components'

export default function Module() {
  const router = useRouter()
  const params = useParams()
  const { courseId, moduleId } = params as { courseId: string; moduleId: string }
  const { courseModules, fetchingModules } = useGetModules({ courseId, moduleId })
  const courseModule = courseModules[0]

  if (fetchingModules || !courseModule) {
    return <Loading />
  }

  return (
    <div>
      <section>
        <p>ID: {courseModule.id}</p>
        <p>Title: {courseModule.title}</p>
        <p>Description: {courseModule.description}</p>
        <p>Type: {courseModule.type}</p>
        <p>
          <strong>Content:</strong>
        </p>
        <p dangerouslySetInnerHTML={{ __html: courseModule.content }} />
      </section>
    </div>
  )
}
