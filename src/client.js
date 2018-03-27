import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './containers/App'
import store from './store'

const rootEl = document.getElementById('app')

// Grab the state from a global variable injected into the server-generated HTML
// eslint-disable-next-line no-underscore-dangle
const preloadedState = window.__PRELOADED_STATE__

// Allow the passed state to be garbage-collected
// eslint-disable-next-line no-underscore-dangle
delete window.__PRELOADED_STATE__

const render = Component => {
  ReactDOM.hydrate(
    <Provider store={store(preloadedState)}>
      <Router>
        <Component />
      </Router>
    </Provider>,
    rootEl,
  )
}

render(App)
