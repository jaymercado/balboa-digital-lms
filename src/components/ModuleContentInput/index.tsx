'use client'

import React, { Dispatch, SetStateAction } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import RichTextInput from './RichTextInput'
import FileInput from './FileInput'

export default function ModuleContentInput({
  type,
  value,
  setValue,
  setFile,
  setFileExtension,
}: ModuleContentInputProps) {
  if (type === 'text') {
    return <RichTextInput value={value} setValue={setValue} />
  }

  if (['video', 'image', 'pdf'].includes(type)) {
    return (
      <FileInput
        type={type as 'video' | 'image' | 'pdf'}
        setFile={setFile}
        setFileExtension={setFileExtension}
      />
    )
  }

  return null
}

interface ModuleContentInputProps {
  type: string
  value: string
  setValue: UseFormSetValue<Inputs>
  setFile: Dispatch<SetStateAction<File | null>>
  setFileExtension: Dispatch<SetStateAction<string>>
}

type Inputs = {
  title: string
  description: string
  type: string
  content: string
}
