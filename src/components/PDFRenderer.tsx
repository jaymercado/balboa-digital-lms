'use client'

import { useState } from 'react'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function PDFRenderer({ file }: PDFRendererProps) {
  const [numPages, setNumPages] = useState<number>()
  const [pageNumber, setPageNumber] = useState<number>(1)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages)
  }

  return (
    <div>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <button
        onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
        disabled={pageNumber <= 1}
      >
        Previous
      </button>
      <button
        onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages || 1))}
        disabled={pageNumber >= (numPages || 1)}
      >
        Next
      </button>
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} renderAnnotationLayer={false} renderTextLayer={false} />
      </Document>
    </div>
  )
}

interface PDFRendererProps {
  file: string
}
