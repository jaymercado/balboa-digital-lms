import React, { useState, useEffect } from 'react'
import { Module } from '@/types/module'

export function useGetModules({ courseId }: { courseId: string }) {
  const [fetchingModules, setFetchingModules] = useState<boolean>(false)
  const [courseModules, setCourseModules] = useState<Module[]>([])

  useEffect(() => {
    const fetchModules = async () => {
      setFetchingModules(true)

      let url = `/api/courses/${courseId}/modules`

      const res = await fetch(url)
      const fetchedCourseModules = ((await res.json()) as Module[]) || []

      setCourseModules(fetchedCourseModules)
    }

    fetchModules().finally(() => setFetchingModules(false))
  }, [courseId])

  return { fetchingModules, courseModules, setCourseModules }
}

export function useGetModule({ courseId, moduleId }: { courseId: string; moduleId: string }) {
  const [fetchingModule, setFetchingModule] = useState<boolean>(false)
  const [courseModule, setCourseModule] = useState<Module | null>(null)
  const [previousCourseId, setPreviousCourseId] = useState<string | null>(null)
  const [nextCourseId, setNextCourseId] = useState<string | null>(null)

  useEffect(() => {
    const fetchModule = async () => {
      setFetchingModule(true)

      let url = `/api/courses/${courseId}/modules/${moduleId}`

      const res = await fetch(url)
      const fetchedCourseModule =
        ((await res.json()) as {
          courseModule: Module
          nextCourseId?: string
          previousCourseId?: string
        }) || {}

      setCourseModule(fetchedCourseModule.courseModule)
      if (fetchedCourseModule.nextCourseId) {
        setNextCourseId(fetchedCourseModule.nextCourseId)
      }
      if (fetchedCourseModule.previousCourseId) {
        setPreviousCourseId(fetchedCourseModule.previousCourseId)
      }
    }

    fetchModule().finally(() => setFetchingModule(false))
  }, [courseId, moduleId])

  return { fetchingModule, courseModule, setCourseModule, nextCourseId, previousCourseId }
}
