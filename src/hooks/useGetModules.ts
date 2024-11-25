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
  const [nextCourseId, setNextCourseId] = useState<string | undefined>(undefined)
  const [fetchingModules, setFetchingModules] = useState<boolean>(false)

  useEffect(() => {
    const fetchModules = async () => {
      setFetchingModules(true)

      const url = `/api/courses/${courseId}/modules/${moduleId}`

      const res = await fetch(url)
      const fetchedData =
        ((await res.json()) as { courseModules: Module[]; nextCourseId?: string }) || []

      setModules(fetchedData.courseModules)
      if (fetchedData.nextCourseId) {
        setNextCourseId(fetchedData.nextCourseId)
      }
    }

    fetchModules().finally(() => setFetchingModules(false))
  }, [courseId, moduleId])

  return { courseModules, setModules, nextCourseId, fetchingModules }
}
