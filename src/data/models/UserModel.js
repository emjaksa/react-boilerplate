import mongoose from 'mongoose'
import { emailValidator, nameValidator, passwordValidator } from '../validators'
import PasswordHash from '../../utils/PasswordHash'

const { Schema } = mongoose

const UserSchema = new Schema({
  name: nameValidator,
  email: emailValidator,
  password: passwordValidator,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

UserSchema.pre('save', async function preSave(next) {
  try {
    this.password = await PasswordHash.hash(this.password)
    next()
  } catch (error) {
    next(error)
  }
})

function onUpdate() {
  this.update({}, { $set: { updatedAt: new Date() } })
}

UserSchema.pre('update', onUpdate)
UserSchema.pre('findOneAndUpdate', onUpdate)

const UserModel = mongoose.model('user', UserSchema)

export default UserModel
