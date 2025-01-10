'use client'

import React, { Dispatch, SetStateAction } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import CourseItems from './CourseItems'
import { CourseItem } from '@/types/courseItem'

export default function EditCourseItemsOrder({
  courseItems,
  setCourseItems,
}: {
  courseItems: CourseItem[]
  setCourseItems: Dispatch<SetStateAction<CourseItem[]>>
}) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return // dropped outside the list
    const updatedList = [...courseItems]
    const [removed] = updatedList.splice(result.source.index, 1)
    updatedList.splice(result.destination.index, 0, removed)
    setCourseItems(updatedList)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <CourseItems courseItems={courseItems} />
    </DragDropContext>
  )
}
