import { Schema, models, model } from 'mongoose'

const moduleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['text', 'video', 'image', 'pdf'],
  },
  content: { type: String, required: true },
})

const Module = models['Module'] || model('Module', moduleSchema)

export default Module
