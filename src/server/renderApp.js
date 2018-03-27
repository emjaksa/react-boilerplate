import React from 'react'
import { renderToNodeStream } from 'react-dom/server'
import { Provider } from 'react-redux'
import serialize from 'serialize-javascript'
import { StaticRouter } from 'react-router-dom'

import App from '../containers/App'
import createStore from '../store'

export default (req, res, next) => {
  const initialState = {}
  // This context object contains the results of the render
  const context = {}
  const store = createStore(initialState)
  const stream = renderToNodeStream(
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </Provider>,
  )

  const preloadedState = serialize(store.getState())

  res.render('index.ejs', { preloadedState }, (err, html) => {
    if (err) {
      next(err)
    }
    const [htmlStart, htmlEnd] = html.split('<!--content-->')
    // context.url will contain the URL to redirect to if a <Redirect> was used
    const status = context.status ? context.status : 200
    if (context.url) {
      res.redirect(context.url)
      res.end()
    } else {
      res.writeHead(status)
      res.write(htmlStart)
      stream.pipe(res, { end: false })
      stream.on('end', () => {
        res.write(htmlEnd)
        res.end()
      })
    }
  })
}
