let express = require('express')
let bodyParser = require('body-parser')
let path = require('path')
let fs = require('fs')
let router = require('./route/router.js')
let morgan = require('morgan')
let FileStreamRotator = require('file-stream-rotator')

let port = process.env.PORT || 3000
let app = express()

let logDirectory = path.join(__dirname, 'log')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
let accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
})

// setup the logger
app.use(morgan('short', {stream: accessLogStream}))

app.use(express.static(path.resolve(__dirname, '../dist')))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(router)

let server = app.listen(port, () => {
  console.log(`devServer start on port:${port}`)
})

server.setTimeout(1000 * 60 * 30)
