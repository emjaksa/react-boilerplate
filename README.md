<div align="center">
  <!-- Dependency Status -->
  <a href="https://david-dm.org/emjaksa/react-boilerplate">
    <img src="https://david-dm.org/emjaksa/react-boilerplate.svg" alt="Dependency Status" />
  </a>
  <!-- devDependency Status -->
  <a href="https://david-dm.org/emjaksae/react-boilerplate#info=devDependencies">
    <img src="https://david-dm.org/emjaksa/react-boilerplate/dev-status.svg" alt="devDependency Status" />
  </a>
  <!-- Build Status -->
  <a href="https://travis-ci.org/emjaksa/react-boilerplate">
    <img src="https://travis-ci.org/emjaksa/react-boilerplate.svg" alt="Build Status" />
  </a>
</div>

# React Boilerplate

## Features

* React
* Redux
* React Router v4
* Express
* SSR (streaming)
* Jest & Enzyme for testing
* Webpack
* Hot Module Reloading
* SASS
* CSS Modules
* Babel
* Post-css

## Gettings Started

Clone the repository
```
git clone https://github.com/emjaksa/react-boilerplate
cd react-boilerplate
npm install
``` 

Build and start server (production)
```
npm start
```

Build only (production)
```
npm run build
```

Dev build, start server and watch for changes (development)
```
npm run watch
```

Dev build only (development)
```
npm run dev
```

#### Dotenv config
Create ``.env`` file in project root

Following options are available
```
# Port express server will start on
PORT=8080
# Port webpack dev server will start on
DEV_PORT=3000
# Log directory (defaults to build/log)
# LOG_DIR=/var/log
```
