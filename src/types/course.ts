import { User } from './user'

export interface Course {
  _id: string
  title: string
  description: string
  enrollees: string[] | User[]
  instructors: string[] | User[]
}

export interface CourseWithEnrolleesAndInstructors {
  _id: string
  title: string
  description: string
  enrollees: User[]
  instructors: User[]
}
