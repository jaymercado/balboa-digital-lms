import { Schema, models, model } from 'mongoose'

const userSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String },
})

const User = models['User'] || model('User', userSchema)

export default User
