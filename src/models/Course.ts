import { Schema, models, model } from 'mongoose'

const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  enrollees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  instructors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
})

const Course = models['Course'] || model('Course', courseSchema)

export default Course
