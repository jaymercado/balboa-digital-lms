import React, { useState, useEffect } from 'react'
import { CourseItem } from '@/types/courseItem'

export function useGetCourseItems({ courseId }: { courseId: string }) {
  const [fetchingCourseItems, setFetchingCourseItems] = useState<boolean>(false)
  const [courseItems, setCourseItems] = useState<CourseItem[]>([])
  const [courseItemsNotFound, setCourseItemsNotFound] = useState<boolean>(false)

  useEffect(() => {
    const fetchItems = async () => {
      setFetchingCourseItems(true)
      try {
        const res = await fetch(`/api/courses/${courseId}/items`)

        if (!res.ok) {
          if (res.status === 404) {
            setCourseItemsNotFound(true)
          }
          throw new Error('Course items not found or invalid request')
        }

        const fetchedData = (await res.json()) as CourseItem[]
        setCourseItems(fetchedData || [])
      } catch (error) {
        console.error('Error fetching course items:', error)
        setCourseItemsNotFound(true)
      } finally {
        setFetchingCourseItems(false)
      }
    }

    fetchItems()
  }, [courseId])

  return { fetchingCourseItems, courseItems, setCourseItems, courseItemsNotFound }
}

export function useGetCourseItem({ courseId, itemId }: { courseId: string; itemId: string }) {
  const [fetchingCourseItem, setFetchingCourseItem] = useState<boolean>(false)
  const [courseItem, setCourseItem] = useState<CourseItem | null>(null)
  const [previousCourseItemId, setPreviousCourseItemId] = useState<string | null>(null)
  const [nextCourseItemId, setNextCourseItemId] = useState<string | null>(null)
  const [courseItemNotFound, setCourseItemNotFound] = useState<boolean>(false)

  useEffect(() => {
    const fetchCourseItem = async () => {
      setFetchingCourseItem(true)
      try {
        const res = await fetch(`/api/courses/${courseId}/items/${itemId}`)

        if (!res.ok) {
          if (res.status === 404) {
            setCourseItemNotFound(true)
          }
          throw new Error('Course item not found or invalid request')
        }

        const fetchedData = (await res.json()) as {
          courseItem?: CourseItem
          nextCourseItemId?: string
          previousCourseItemId?: string
        }

        if (!fetchedData.courseItem) {
          setCourseItemNotFound(true)
          return
        }

        setCourseItem(fetchedData.courseItem)
        setNextCourseItemId(fetchedData.nextCourseItemId || null)
        setPreviousCourseItemId(fetchedData.previousCourseItemId || null)
      } catch (error) {
        console.error('Error fetching course item:', error)
        setCourseItemNotFound(true)
      } finally {
        setFetchingCourseItem(false)
      }
    }

    fetchCourseItem()
  }, [courseId, itemId])

  return {
    fetchingCourseItem,
    courseItem,
    nextCourseItemId,
    previousCourseItemId,
    courseItemNotFound,
  }
}
