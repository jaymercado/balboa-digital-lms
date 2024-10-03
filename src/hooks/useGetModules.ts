import React, { useState, useEffect } from 'react'
import { Module } from '@/types/module'

export default function useGetModules({
  courseId,
  moduleId,
}: {
  courseId: string
  moduleId: string
}) {
  const [courseModules, setModules] = useState<Module[]>([])
  const [fetchingModules, setFetchingModules] = useState<boolean>(false)

  useEffect(() => {
    const fetchModules = async () => {
      setFetchingModules(true)

      const url = `/api/courses/${courseId}/modules/${moduleId}`

      const res = await fetch(url)
      const fetchedModules = ((await res.json()) as Module[]) || []

      setModules(fetchedModules)
    }

    fetchModules().finally(() => setFetchingModules(false))
  }, [courseId, moduleId])

  return { courseModules, setModules, fetchingModules }
}
