import React, { useState, useEffect } from 'react'
import { Module } from '@/types/module'

export function useGetCourseModules({ courseId }: { courseId: string }) {
  const [fetchingModules, setFetchingModules] = useState<boolean>(false)
  const [courseModules, setCourseModules] = useState<Module[]>([])
  const [courseModulesNotFound, setCourseModulesNotFound] = useState<boolean>(false)

  useEffect(() => {
    const fetchModules = async () => {
      setFetchingModules(true)
      try {
        const res = await fetch(`/api/courses/${courseId}/modules`)

        if (!res.ok) {
          if (res.status === 404) {
            setCourseModulesNotFound(true)
          }
          throw new Error('Course modules not found or invalid request')
        }

        const fetchedData = (await res.json()) as Module[]
        setCourseModules(fetchedData || [])
      } catch (error) {
        console.error('Error fetching course modules:', error)
        setCourseModulesNotFound(true)
      } finally {
        setFetchingModules(false)
      }
    }

    fetchModules()
  }, [courseId])

  return { fetchingModules, courseModules, setCourseModules, courseModulesNotFound }
}

export function useGetCourseModule({ courseId, moduleId }: { courseId: string; moduleId: string }) {
  const [fetchingModule, setFetchingModule] = useState<boolean>(false)
  const [courseModule, setCourseModule] = useState<Module | null>(null)
  const [courseModuleNotFound, setCourseModuleNotFound] = useState<boolean>(false)
  const [previousCourseModuleId, setPreviousCourseId] = useState<string | null>(null)
  const [nextCourseModuleId, setNextCourseId] = useState<string | null>(null)

  useEffect(() => {
    const fetchModule = async () => {
      setFetchingModule(true)
      try {
        const res = await fetch(`/api/courses/${courseId}/modules/${moduleId}`)

        if (!res.ok) {
          if (res.status === 404) {
            setCourseModuleNotFound(true)
          }
          throw new Error('Module not found or invalid request')
        }

        const fetchedData = (await res.json()) as {
          courseModule: Module
          nextCourseModuleId?: string
          previousCourseModuleId?: string
        }

        if (!fetchedData.courseModule) {
          setCourseModuleNotFound(true)
          return
        }
  
        setCourseModule(fetchedData.courseModule)
        setNextCourseId(fetchedData.nextCourseModuleId || null)
        setPreviousCourseId(fetchedData.previousCourseModuleId || null)
      } catch (error) {
        console.error('Error fetching module:', error)
        setCourseModuleNotFound(true)
      } finally {
        setFetchingModule(false)
      }
    }

    fetchModule()
  }, [courseId, moduleId])

  return {
    fetchingModule,
    courseModule,
    setCourseModule,
    nextCourseModuleId,
    previousCourseModuleId,
    courseModuleNotFound,
  }
}
