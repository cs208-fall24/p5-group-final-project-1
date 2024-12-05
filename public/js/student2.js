import express from 'express'

function student2Routes(app, db) {
    
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS student2_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        comment TEXT NOT NULL
        )`)
    })
    
    
    app.get('/student2', function (req, res) {
        console.log('GET /student2 called')
            
        db.all('SELECT * FROM student2_comments', [], (err, comments) => {
        if (err) {
            return console.error(err.message)
        }
    
        let commentsToDisplay = []
        if (comments.length > 0) {
            commentsToDisplay = comments.sort(() => 0.5 - Math.random()).slice(0, 5)
        }
        res.render('student2/index', { comments: commentsToDisplay })
        })
    })
    
    app.get('/student2/comments', function (req, res) {
        console.log('GET /student2/comments called')
        
        db.all('SELECT * FROM student2_comments', [], (err, comments) => {
        if (err) {
            return console.error(err.message)
        }
        res.render('student2/comments', { comments: comments })
        })
    })
    
    app.post('/student2/comments/add', function (req, res) {
        let newComment = req.body.comment
        db.run('INSERT INTO student2_comments (comment) VALUES (?)', [newComment], function(err){
        if (err) {
            return console.error(err.message)
        }
        res.redirect('/student2/comments')
        })
    })
    
    app.post('/student2/comments/delete/:id', function (req, res) {
        let id = req.params.id
        db.run('DELETE FROM student2_comments WHERE id = ?', [id], function(err){
        if (err) {
            return console.error(err.message)
        }
        res.redirect('/student2/comments')
        })
    })
    
    app.get('/student2/comments/edit/:id', function (req, res) {
        let id = req.params.id
        db.get('SELECT * FROM student2_comments WHERE id = ?', [id], (err, comment) => {
        if (err) {
            return console.error(err.message)
        }
        res.render('student2/editor', { comment: comment })
        })
    })
    
     
    app.post('/student2/comments/edit/:id', function(req, res) {
        let id = req.params.id
        let updatedComment = req.body.comment
        db.run('UPDATE student2_comments SET comment = ? WHERE id = ?', [updatedComment, id], function(err) {
        if (err) {
            return console.error(err.message)
        }
        res.redirect('/student2/comments')
        })
    })
}

export default student2Routes
