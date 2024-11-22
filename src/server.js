import express from 'express'
import sql from 'sqlite3'
import student3Routes from '../public/js/student3.js'

const sqlite3 = sql.verbose()

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

db.run(`CREATE TABLE IF NOT EXISTS s1comments (
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

function getRandomItems(array, numItems) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numItems);
}

app.get('/student1', function (req, res) {
  const s1comments = [];

  db.all('SELECT id, comment FROM s1comments', function (err, rows) {
    if (err) {
      console.log(err);
      res.status(500).send('Database error');
    } else {
      const randomComments = getRandomItems(rows, 5); // Fetch 5 random comments
      res.render('student1', { s1comments: randomComments });
    }
  });
  console.log("GET Called")
});

app.get('/student1/comments', function (req, res) {
  const local = { s1comments: [] }
  db.each('SELECT id, comment FROM s1comments', function (err, row) {
    if (err) {
      console.log(err)
    } else {
      local.s1comments.push({ id: row.id, comment: row.comment })
    }
  }, function (err, numrows) {
    if (!err) {
      res.render('student1/comments', local)
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


app.post('/student1/comments/add', function(req, res) {
  console.log('adding comment')
  const stmt = db.prepare('INSERT INTO s1comments (comment) VALUES (?)')
  stmt.run(req.body.comment)
  stmt.finalize()
  res.redirect('/student1/comments')
})

app.post('/student1/comments/delete', function (req, res) {
  console.log('deleting comment')
  const stmt = db.prepare('DELETE FROM s1comments where id = (?)')
  stmt.run(req.body.id)
  stmt.finalize()
  res.redirect('/student1/comments')

})

app.get('/student1/comments/edit/:id', function (req, res) {
  let id = req.params.id;
  db.get('SELECT * FROM s1comments WHERE id = ?', [id], (err, comment) => {
    if (err) {
      return console.error(err.message);
    }
    res.render('student1/edit', { comment: comment });
  });
});


app.post('/student1/comments/edit/:id', function (req, res) {
  let id = req.params.id;
  let updatedComment = req.body.comment;

  console.log(`Updating comment with ID: ${id}, New Comment: ${updatedComment}`);

  db.run('UPDATE s1comments SET comment = ? WHERE id = ?', [updatedComment, id], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Database error');
    } else {
      console.log(`Updated comment for student1 with ID: ${id}`);
      res.redirect('/student1/comments');
    }
  });
});


// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
