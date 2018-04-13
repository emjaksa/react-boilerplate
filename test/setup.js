import { configure, shallow, render, mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-16'
import 'whatwg-fetch'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const { MONGODB_TEST_URI } = process.env

configure({ adapter: new Adapter() })

if (!MONGODB_TEST_URI) {
  throw new Error('MONGODB_TEST_URI env variable must be set.')
}

;(async () => {
  mongoose.connect(MONGODB_TEST_URI, {
    reconnectTries: 30,
  })

  try {
    await mongoose.connection
    // eslint-disable-next-line no-console
    console.log('Mongoose default connection open')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Mongoose default connection error: ${error}`)
  }
})()

global.shallow = shallow
global.render = render
global.mount = mount
global.renderer = renderer
