/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { CCardText } from '@coreui/react-pro'

export default function CourseModuleContent({ type, content }: CourseModuleContentProps) {
  if (!content) return <CCardText>This module has no content</CCardText>
  if (type === 'video') return <video src={content} controls />
  if (type === 'image') return <img src={content} alt="Module image" />
  if (type === 'pdf')
    return (
      <a href={content} target="_blank">
        View PDF
      </a>
    )
  return <div dangerouslySetInnerHTML={{ __html: content }}></div>
}

interface CourseModuleContentProps {
  type: 'text' | 'video' | 'image' | 'pdf'
  content: string
}
