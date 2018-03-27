import { configure, shallow, render, mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-16'
import 'whatwg-fetch'

configure({ adapter: new Adapter() })

global.shallow = shallow
global.render = render
global.mount = mount
global.renderer = renderer
