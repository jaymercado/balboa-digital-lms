import { NextResponse } from 'next/server'
import { sendCourseNotificationEmail } from '@/lib/mailer'

export async function POST(request: Request) {
  try {
    const { users, courseName, courseLink } = await request.json()

    for (const user of users) {
      await sendCourseNotificationEmail({
        to: user.email,
        courseName,
        itemName: courseName,
        itemLink: courseLink,
        notificationType: 'created-module',
      })
    }

    return NextResponse.json({ message: 'Emails sent' }, { status: 200 })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ message: 'Failed to send notifications' }, { status: 500 })
  }
}
