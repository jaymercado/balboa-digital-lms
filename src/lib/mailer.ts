import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendCourseNotificationEmail({
  to,
  courseName,
  itemName,
  itemLink,
  notificationType,
}: {
  to: string
  courseName: string
  itemName: string
  itemLink: string
  notificationType: 'created-module' | 'edited-module' | 'created-quiz' | 'edited-quiz'
}) {
  let subject = ''
  let bodyMessage = ''

  switch (notificationType) {
    case 'created-module':
      subject = `New Module "${itemName}" added to "${courseName}"`
      bodyMessage = `A new module <strong>${itemName}</strong> has been added to the course <strong>${courseName}</strong>.`
      break
    case 'edited-module':
      subject = `Module "${itemName}" in "${courseName}" has been updated`
      bodyMessage = `The module <strong>${itemName}</strong> in the course <strong>${courseName}</strong> has been updated.`
      break
    case 'created-quiz':
      subject = `New Quiz "${itemName}" added to "${courseName}"`
      bodyMessage = `A new quiz <strong>${itemName}</strong> has been added to the course <strong>${courseName}</strong>.`
      break
    case 'edited-quiz':
      subject = `Quiz "${itemName}" in "${courseName}" has been updated`
      bodyMessage = `The quiz <strong>${itemName}</strong> in the course <strong>${courseName}</strong> has been updated.`
      break
  }

  await transporter.sendMail({
    from: `"Balboa Digital LMS" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <p>Hi,</p>
      <p>${bodyMessage}</p>
      <p>You can view it here:</p>
      <p><a href="${itemLink}">${itemLink}</a></p>
      <p>Thank you!</p>
    `,
  })
}
