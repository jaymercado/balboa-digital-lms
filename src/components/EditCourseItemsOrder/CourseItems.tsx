'use client'

import React, { useEffect, useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { CourseItem } from '@/types/courseItem'

export default function CourseItems({ courseItems }: { courseItems: CourseItem[] }) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true))

    return () => {
      cancelAnimationFrame(animation)
      setEnabled(false)
    }
  }, [])

  if (!enabled) {
    return null
  }

  return (
    <Droppable droppableId="table-body">
      {(droppableProvided) => (
        <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
          {courseItems.map((courseItem, index) => (
            <Draggable key={`${courseItem.id}`} draggableId={`${courseItem.id}`} index={index}>
              {(draggableProvided, snapshot) => (
                <div
                  ref={draggableProvided.innerRef}
                  {...draggableProvided.draggableProps}
                  {...draggableProvided.dragHandleProps}
                  style={{
                    background: snapshot.isDragging ? '#f0f0f0' : 'white',
                    ...draggableProvided.draggableProps.style,
                    border: '1px solid #ccc',
                    padding: '0.5rem',
                  }}
                >
                  {courseItem.title}
                </div>
              )}
            </Draggable>
          ))}
          {droppableProvided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
