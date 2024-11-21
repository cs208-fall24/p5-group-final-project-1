import express from 'express'
import sql from 'sqlite3'
import student3Routes from '../public/js/student3.js'

const sqlite3 = sql.verbose()

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

const app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  console.log('GET called')
  res.render('index')
})

app.get('/student1', function (req, res) {
  console.log('GET called')
  res.render('student1')
})

app.get('/student2', function (req, res) {
  console.log('GET called')
  res.render('student2')
})

student3Routes(app, db)


// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
