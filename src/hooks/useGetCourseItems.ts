import React, { useState, useEffect } from 'react'
import { CourseItem } from '@/types/courseItem'

export function useGetCourseItems({ courseId }: { courseId: string }) {
  const [fetchingCourseItems, setFetchingCourseItems] = useState<boolean>(false)
  const [courseItems, setCourseItems] = useState<CourseItem[]>([])

  useEffect(() => {
    const fetchItems = async () => {
      setFetchingCourseItems(true)

      let url = `/api/courses/${courseId}/items`

      const res = await fetch(url)
      const fetchedCourseItems = ((await res.json()) as CourseItem[]) || []

      setCourseItems(fetchedCourseItems)
    }

    fetchItems().finally(() => setFetchingCourseItems(false))
  }, [courseId])

  return { fetchingCourseItems, courseItems, setCourseItems }
}

export function useGetCourseItem({ courseId, itemId }: { courseId: string; itemId: string }) {
  const [fetchingCourseItem, setFetchingCourseItem] = useState<boolean>(false)
  const [courseItem, setCourseItem] = useState<CourseItem | null>(null)
  const [previousCourseItemId, setPreviousCourseItemId] = useState<string | null>(null)
  const [nextCourseItemId, setNextCourseItemId] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourseItem = async () => {
      setFetchingCourseItem(true)

      let url = `/api/courses/${courseId}/items/${itemId}`

      const res = await fetch(url)
      const fetchedCourseItem =
        ((await res.json()) as {
          courseItem: CourseItem
          nextCourseItemId?: string
          previousCourseItemId?: string
        }) || {}

      setCourseItem(fetchedCourseItem.courseItem)
      if (fetchedCourseItem.nextCourseItemId) {
        setNextCourseItemId(fetchedCourseItem.nextCourseItemId)
      }
      if (fetchedCourseItem.previousCourseItemId) {
        setPreviousCourseItemId(fetchedCourseItem.previousCourseItemId)
      }
    }

    fetchCourseItem().finally(() => setFetchingCourseItem(false))
  }, [courseId, itemId])

  return {
    fetchingCourseItem,
    courseItem,
    nextCourseItemId,
    previousCourseItemId,
  }
}
