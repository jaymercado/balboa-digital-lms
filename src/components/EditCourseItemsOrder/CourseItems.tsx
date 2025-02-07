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
        <div
          ref={droppableProvided.innerRef}
          {...droppableProvided.droppableProps}
          style={{
            backgroundColor: 'var(--cui-body-bg)',
            color: 'var(--cui-body-color)',
            borderRadius: '8px',
          }}
        >
          {courseItems.map((courseItem, index) => (
            <Draggable key={courseItem.id} draggableId={`${courseItem.id}`} index={index}>
              {(draggableProvided, snapshot) => (
                <div
                  ref={draggableProvided.innerRef}
                  {...draggableProvided.draggableProps}
                  {...draggableProvided.dragHandleProps}
                  style={{
                    display: 'flex',
                    backgroundColor: snapshot.isDragging
                      ? 'var(--cui-secondary-bg)'
                      : 'var(--cui-tertiary-bg)',
                    color: 'var(--cui-body-color)',
                    ...draggableProvided.draggableProps.style,
                    border: '1px solid var(--cui-border-color)',
                    padding: '0.7rem',
                    marginBottom: '0.5rem',
                    borderRadius: '6px',
                  }}
                >
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      id="equal"
                      className="me-2"
                    >
                      <path
                        fill="currentColor"
                        d="M2.75,9.25 L13.25,9.25 C13.6642136,9.25 14,9.58578644 14,10 C14,10.3796958 13.7178461,10.693491 13.3517706,10.7431534 L13.25,10.75 L2.75,10.75 C2.33578644,10.75 2,10.4142136 2,10 C2,9.62030423 2.28215388,9.30650904 2.64822944,9.25684662 L2.75,9.25 L13.25,9.25 L2.75,9.25 Z M2.75,5.25 L13.25,5.25 C13.6642136,5.25 14,5.58578644 14,6 C14,6.37969577 13.7178461,6.69349096 13.3517706,6.74315338 L13.25,6.75 L2.75,6.75 C2.33578644,6.75 2,6.41421356 2,6 C2,5.62030423 2.28215388,5.30650904 2.64822944,5.25684662 L2.75,5.25 L13.25,5.25 L2.75,5.25 Z"
                      ></path>
                    </svg>
                  </div>
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
