import { Schema, models, model } from 'mongoose'

const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  enrollees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  instructors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
})

const User = models['Course'] || model('Course', courseSchema)

export default User
