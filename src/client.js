import React from 'react'
import ReactDOM from 'react-dom'
import App from './containers/App'

const rootEl = document.getElementById('app')

const render = Component => {
  ReactDOM.hydrate(<Component />, rootEl)
}

render(App)
