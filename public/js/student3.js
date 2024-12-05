function student3Routes(app, db) {

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS student3_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      comment TEXT NOT NULL
    )`)
  })


  app.get('/student3', function (req, res) {
    console.log('GET /student3 called')
    
    db.all('SELECT * FROM student3_comments', [], (err, comments) => {
      if (err) {
        return console.error(err.message)
      }
 
      let commentsToDisplay = []
      if (comments.length > 0) {
        commentsToDisplay = comments.sort(() => 0.5 - Math.random()).slice(0, 5)
      }
      res.render('student3/index', { comments: commentsToDisplay })
    })
  })


  app.get('/student3/comments', function (req, res) {
    console.log('GET /student3/comments called')
 
    db.all('SELECT * FROM student3_comments', [], (err, comments) => {
      if (err) {
        return console.error(err.message)
      }
      res.render('student3/comments', { comments: comments })
    })
  })

  
  app.post('/student3/comments/add', function (req, res) {
    let newComment = req.body.comment
    db.run('INSERT INTO student3_comments (comment) VALUES (?)', [newComment], function(err){
      if (err) {
        return console.error(err.message)
      }
      res.redirect('/student3/comments')
    })
  })

  
  app.post('/student3/comments/delete/:id', function (req, res) {
    let id = req.params.id
    db.run('DELETE FROM student3_comments WHERE id = ?', [id], function(err){
      if (err) {
        return console.error(err.message)
      }
      res.redirect('/student3/comments')
    })
  })

 
  app.get('/student3/comments/edit/:id', function (req, res) {
    let id = req.params.id
    db.get('SELECT * FROM student3_comments WHERE id = ?', [id], (err, comment) => {
      if (err) {
        return console.error(err.message)
      }
      res.render('student3/edit_comment', { comment: comment })
    })
  })

 
  app.post('/student3/comments/edit/:id', function(req, res) {
    let id = req.params.id
    let updatedComment = req.body.comment
    db.run('UPDATE student3_comments SET comment = ? WHERE id = ?', [updatedComment, id], function(err) {
      if (err) {
        return console.error(err.message)
      }
      res.redirect('/student3/comments')
    })
  })
}

export default student3Routes