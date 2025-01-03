'use client'

import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import RichTextInput from './RichTextInput'
import FileInput from './FileInput'

export default function ModuleContentInput({
  type,
  value,
  setValue,
  setFile,
  setFileExtension,
  currentFile,
}: ModuleContentInputProps) {
  useEffect(() => {
    if (currentFile && type != 'text') {
      setFile(currentFile)
      setValue('content', '')
    }
  }, [currentFile, setFile, setFileExtension, setValue, type])

  if (type === 'text') {
    return <RichTextInput value={value} setValue={setValue} />
  }

  if (['video', 'image', 'pdf'].includes(type)) {
    return (
      <FileInput
        type={type as 'video' | 'image' | 'pdf'}
        setFile={setFile}
        setFileExtension={setFileExtension}
        currentFile={currentFile}
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
  currentFile: File | null
}

type Inputs = {
  title: string
  description: string
  type: string
  content: string
}
