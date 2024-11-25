'use client'
import { Worker } from '@react-pdf-viewer/core'
import { Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

export default function PDFRenderer({ file }: PDFRendererProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div className="viewer">
        <Viewer fileUrl={file} plugins={[defaultLayoutPluginInstance]} />
      </div>
    </Worker>
  )
}

interface PDFRendererProps {
  file: string
}
