'use client'

import React from 'react'
import { UseFormSetValue } from 'react-hook-form'
import RichTextInput from './RichTextInput'
import FileInput from './FileInput'

export default function ModuleContentInput({ type, value, setValue }: ModuleContentInputProps) {
  if (type === 'text') {
    return <RichTextInput value={value} setValue={setValue} />
  }

  if (['text', 'video', 'image', 'pdf'].includes(type)) {
    return <FileInput />
  }

  return null
}

interface ModuleContentInputProps {
  type: string
  value: string
  setValue: UseFormSetValue<Inputs>
}

type Inputs = {
  title: string
  description: string
  type: string
  content: string
}
