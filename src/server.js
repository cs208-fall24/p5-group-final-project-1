import express from 'express'
import sql from 'sqlite3'
import student3Routes from '../public/js/student3.js'

const sqlite3 = sql.verbose()

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

db.run(`CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment TEXT NOT NULL)`)

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
  const local = { comments: [] }
  db.each('SELECT id, comment FROM comments', function (err, row) {
    if (err) {
      console.log(err)
    } else {
      local.comments.push({ id: row.id, comment: row.comment })
    }
  }, function (err, numrows) {
    if (!err) {
      res.render('student1', local)
    } else {
      console.log(err)
    }
  })
  console.log('GET called')
})

app.get('/student2', function (req, res) {
  console.log('GET called')
  res.render('student2')
})

student3Routes(app, db)


app.post('/add', function(req, res) {
  console.log('adding comment')
  const stmt = db.prepare('INSERT INTO comments (comment) VALUES (?)')
  stmt.run(rew.body.comment)
  stmt.finalize()
  res.redirect('/')
})

// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
