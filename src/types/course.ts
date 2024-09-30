import { User } from './user'
import { Module } from './module'

export interface Course {
  _id: string
  title: string
  description: string
  enrollees: string[] | User[]
  instructors: string[] | User[]
  modules: Module[]
}

export interface CourseWithEnrolleesAndInstructors {
  _id: string
  title: string
  description: string
  enrollees: User[]
  instructors: User[]
  modules: Module[]
}
