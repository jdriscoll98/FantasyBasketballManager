import { mount } from '@vue/test-utils'
import App from '../App.vue'
describe('App', () => {
  test('renders without crashing', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBeTruthy()
  })
})


