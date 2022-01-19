// app standard configuration
const express = require('express')
const app = express()
const port = 5000

const { getFullTime, getDistanceTime } = require('./utility/time')

const LoremIpsum = require("lorem-ipsum").LoremIpsum
const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 6
    },
    wordsPerSentence: {
      max: 16,
      min: 12
    }
})

// import postgreSQL db
const db = require('./connection/db')

// set view engine
app.set('view engine', 'hbs')

app.use('/public', express.static(__dirname + '/public'))
app.use(express.urlencoded({extended:false}))

// check login state
let isLogin = true

// Starting blog array
let blogs = [
    {
        title: 'Pasar Coding di Indonesia Dinilai Masih Menjanjikan',
        postAt: new Date(),
        postFullTime: function() {
            getFullTime(this.postAt)
        },
        distanceTime: function() {
            getDistanceTime(this.postAt)
        },
        author: 'Karunia Leo Gultom',
        content: lorem.generateSentences(5)
    },
]

// ROUTE METHOD GET

app.get('/', (req, res) => {
    db.connect((err, client, done) => {
        if (err) throw err
        
        client.query('SELECT * FROM tb_exp', function(err, result) {
            if (err) throw err

            let dbData = result.rows

            res.render('index', {isLogin, exps : dbData})
        })
    })
})

app.get('/contact', (req, res) => {
    res.render('contact', {isLogin})
})

app.get('/blog', (req, res) => {
    db.connect((err, client, done) => {
        if (err) throw err
        
        client.query('SELECT * FROM tb_blog', function(err, result) {
            if (err) throw err

            let dbData = result.rows
            let newData = dbData.map((dbData) => {
                return {
                    ...dbData,
                    isLogin,
                    author: 'Karunia Leo Gultom',
                    postFullTime: getFullTime(dbData.postAt),
                    distanceTime: getDistanceTime(dbData.postAt),
                }
            })

            res.render('blog', {isLogin, blogs : newData})
        })
    })
})

app.get('/blog-detail/:id', (req, res) => {
    let id = req.params.id
    
    db.connect((err, client, done) => {
        if (err) throw err

        client.query(`SELECT * FROM tb_blog WHERE id = ${id}`, (err, result) => {
            if (err) throw err

            let dbData = result.rows[0]

            res.render('blog-detail', { id, blog: dbData})
        })
    })
})

app.get('/add-blog',(req, res) => {
    res.render('add-blog', {isLogin})
})

app.get('/edit-blog/:id',(req, res) => {
    let id = req.params.id

    db.connect((err, client, done) => {
        if (err) throw err

        client.query(`SELECT * FROM tb_blog WHERE id = ${id}`, (err, result) => {
            if (err) throw err

            let dbData = result.rows[0]

            res.render('edit-blog', {
                title: dbData.title,
                content: dbData.content,
                id,
                isLogin
            })
        })
    })
})

app.get('/delete/:id', (req, res) => {
    let id = req.params.id

    let query = `DELETE FROM tb_blog WHERE id = ${id}`

    db.connect((err, client, done) => {
        if (err) throw err

        client.query(query, (err, result) => {
            if (err) throw err

            res.redirect('/blog')
        })
    })
})

// ROUTE METHOD POST

app.post('/blog', (req, res) => {
    let data = req.body
    let query = `INSERT INTO tb_blog (title, content, image) VALUES ('${data.inputTitle}', '${data.inputContent}', 'image.png')`

    db.connect((err, client, done) => {
        if (err) throw err

        client.query(query, (err, result) => {
            if (err) throw err

            res.redirect('/blog')
        })
    })
})

app.post('/edit-blog/:id', (req, res) => {
    let data = req.body
    let id = req.params.id

    query = `UPDATE tb_blog SET title='${data.inputTitle}', content='${data.inputContent}' WHERE id='${id}'`
    
    db.connect((err, client, done) => {
        if (err) throw err

        client.query(query, (err, result) => {
            if (err) throw err

            res.redirect('/blog')
        })
    })
})

app.listen(port, () => {
    console.log(`Server starting on http://localhost:${port}/\nPress Ctrl-C to exit`)
})