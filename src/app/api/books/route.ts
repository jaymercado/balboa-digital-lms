import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json('Hello Lloyd', { status: 200 })
}
