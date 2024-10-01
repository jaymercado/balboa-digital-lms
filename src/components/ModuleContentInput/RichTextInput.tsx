'use client'

import React from 'react'
import { UseFormSetValue } from 'react-hook-form'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function RichTextInput({ value, setValue }: RichTextInputProps) {
  return <ReactQuill theme="snow" value={value} onChange={(value) => setValue('content', value)} />
}

interface RichTextInputProps {
  value: string
  setValue: UseFormSetValue<Inputs>
}

type Inputs = {
  title: string
  description: string
  type: string
  content: string
}
