import React, { useState } from 'react'
import jsPDF from 'jspdf'
import { CButton } from '@coreui/react-pro'
import { User } from '../types/user'
import { PDFRenderer } from '@/components'

import { LatoBold } from '../../public/fonts/Lato-Bold'
import { LatoRegular } from '../../public/fonts/Lato-Regular'
import { PoppinsBold } from '../../public/fonts/Poppins-Bold'

const generateCertificate = (
  name: string | null | undefined,
  course: string | null | undefined,
  instructors: User[] | undefined,
): string => {
  const doc = new jsPDF({ orientation: 'landscape', format: 'a4' })
  const date = new Date()

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)

  doc.addImage(
    '../../images/certificate-background-1.jpg',
    'JPEG',
    0,
    0,
    doc.internal.pageSize.getWidth(),
    doc.internal.pageSize.getHeight(),
    'FAST',
  )

  doc.addFileToVFS('Lato-Bold.ttf', LatoBold)
  doc.addFileToVFS('Poppins-Bold.ttf', PoppinsBold)
  doc.addFileToVFS('Lato-Regular.ttf', LatoRegular)

  doc.addFont('Lato-Regular.ttf', 'Lato-Regular', 'normal')
  doc.addFont('Lato-Bold.ttf', 'Lato-Bold', 'normal')
  doc.addFont('Poppins-Bold.ttf', 'Poppins-Bold', 'normal')

  doc.setFontSize(30)
  doc.setFont('Poppins-Bold', 'normal')
  doc.setTextColor('black')
  doc.text('CERTIFICATE OF COMPLETION', 20, 40)

  doc.setFontSize(15)
  doc.setFont('Lato-Regular', 'normal')
  doc.setTextColor('#737373')
  doc.text('This certificate is proudly presented to', 20, 70)

  doc.setFontSize(45)
  doc.setTextColor('black')
  doc.setFont('Poppins-Bold', 'normal')
  doc.text(name ?? '', 20, 97)

  doc.setFontSize(15)
  doc.setFont('Lato-Regular', 'normal')
  doc.setTextColor('#737373')
  doc.text('For successfully completing the course', 20, 115)

  doc.setFontSize(15)
  doc.setFont('Lato-Bold', 'normal')
  doc.setTextColor('black')
  doc.text(course ?? '', 20, 125)

  doc.setFontSize(14)
  doc.setFont('Lato-Regular', 'normal')
  doc.setTextColor('#737373')
  doc.text('Instructors: ', 20, 135)

  doc.setFontSize(14)
  doc.setFont('Lato-Bold', 'normal')
  doc.setTextColor('#737373')
  {
    instructors && instructors.length > 1
      ? doc.text(instructors.map((instructor) => instructor.name).join(', '), 47, 135)
      : doc.text(instructors ? instructors[0].name : '', 47, 135)
  }

  doc.setFontSize(14)
  doc.setFont('Lato-Regular', 'normal')
  doc.setTextColor('#737373')
  doc.text(`Issued on ${formattedDate}`, 20, 155)

  doc.setFontSize(15)
  doc.setFont('Lato-Bold', 'normal')
  doc.setTextColor('black')
  doc.text('John Smith', 47, 180)

  doc.setFontSize(14)
  doc.setFont('Lato-Regular', 'normal')
  doc.setTextColor('#737373')
  doc.text('President', 49, 188)

  doc.setFontSize(15)
  doc.setFont('Lato-Bold', 'normal')
  doc.setTextColor('black')
  doc.text('John Smith', 122, 180)

  doc.setFontSize(14)
  doc.setFont('Lato-Regular', 'normal')
  doc.setTextColor('#737373')
  doc.text('Vice-President', 120, 188)

  return doc.output('dataurlstring')
}

export default function CertificateGenerator({
  name,
  course,
  instructors,
}: {
  name: string | null | undefined
  course: string | null | undefined
  instructors: User[] | undefined
}) {
  const [pdfFile, setPdfFile] = useState<string>('')

  const handleGenerateCertificate = () => {
    const file = generateCertificate(name, course, instructors)
    setPdfFile(file)
  }

  return (
    <div>
      <CButton onClick={handleGenerateCertificate} color="success" className="mb-2">
        Generate Certificate
      </CButton>
      {pdfFile && <PDFRenderer file={pdfFile} />}
    </div>
  )
}
