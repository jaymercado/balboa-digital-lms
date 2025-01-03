/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import { CCardText, CCard, CCardBody } from '@coreui/react-pro'
import { PDFRenderer } from '@/components'
import Image from 'next/image'

export default function CourseModuleContent({ type, content }: CourseModuleContentProps) {
  if (!content) {
    return (
      <CCard className="text-center">
        <CCardBody>
          <CCardText>This module has no content</CCardText>
        </CCardBody>
      </CCard>
    )
  }

  return (
    <CCard>
      <CCardBody>
        {type === 'video' && (
          <div className="embed-responsive embed-responsive-16by9">
            <video src={content} controls className="embed-responsive-item w-100" />
          </div>
        )}
        {type === 'image' && (
          <div className="text-center">
            <Image
              src={content}
              alt="Module image"
              width={800}
              height={600}
              className="img-fluid rounded"
              layout="responsive"
            />
          </div>
        )}
        {type === 'pdf' && <PDFRenderer file={content} />}
        {type === 'text' && (
          <div className="text-content">
            <div dangerouslySetInnerHTML={{ __html: content }} className="text-justify" />
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

interface CourseModuleContentProps {
  type: 'text' | 'video' | 'image' | 'pdf'
  content: string
}
