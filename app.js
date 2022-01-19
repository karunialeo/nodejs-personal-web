// app standard configuration
const express = require('express')
const app = express()
const port = 5000

// import bcrypt password encryption
const bcrypt = require('bcrypt')

const session = require('express-session')
const flash = require('express-flash')

app.use(
    session({
        cookie: {
            maxAge: 2 * 60 * 60 * 1000, //2 hours
            secure: false,
            httpOnly: true
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: 'secretValue'
    })
)

app.use(flash())

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
const { request } = require('express')

// set view engine
app.set('view engine', 'hbs')

app.use('/public', express.static(__dirname + '/public'))
app.use(express.urlencoded({extended:false}))

// check login state
// let isLogin = true

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

            res.render('index', {isLogin : req.session.isLogin, user : req.session.user, exps : dbData})
        })
    })
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/logout', (req, res) => {
    req.session.destroy()

    res.redirect('/login')
})

app.get('/contact', (req, res) => {
    res.render('contact', {isLogin: req.session.isLogin, user : req.session.user})
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
                    isLogin: req.session.isLogin,
                    author: 'Karunia Leo Gultom',
                    postFullTime: getFullTime(dbData.postAt),
                    distanceTime: getDistanceTime(dbData.postAt),
                }
            })

            res.render('blog', {isLogin: req.session.isLogin, user : req.session.user, blogs : newData})
        })
    })
})

app.get('/blog-detail/:id', (req, res) => {
    let id = req.params.id
    
    db.connect((err, client, done) => {
        if (err) throw err

        client.query(`SELECT * FROM tb_blog WHERE id = ${id}`, (err, result) => {
            if (err) throw err

            let blogData = result.rows[0]
            blogData = {
                ...blogData,
                isLogin : req.session.isLogin,
                author : 'Karunia Leo Gultom',
                postFullTime : getFullTime(blogData.postAt)
            }

            res.render('blog-detail', { id, isLogin: req.session.isLogin, user : req.session.user, blog: blogData})
        })
    })
})

app.get('/add-blog',(req, res) => {
    res.render('add-blog', {isLogin : req.session.isLogin, user : req.session.user})
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
                isLogin : req.session.isLogin,
                user : req.session.user
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

app.post('/register', (req, res) => {
    const {inputName, inputEmail, inputPassword} = req.body

    const hashedPassword = bcrypt.hashSync(inputPassword, 10)

    let query = `INSERT INTO tb_user (name, email, password) VALUES ('${inputName}', '${inputEmail}', '${hashedPassword}')`

    db.connect((err, client, done) => {
        if (err) throw err

        client.query(query, (err, result) => {
            if (err) throw err

            res.redirect('/login')
        })
    })
})

app.post('/login', (req, res) => {
    const {inputEmail, inputPassword} = req.body

    let query = `SELECT * FROM tb_user WHERE email='${inputEmail}'`

    
    db.connect((err, client, done) => {
        if (err) throw err
        
        client.query(query, (err, result) => {
            if (err) throw err
            
            if(result.rows.length == 0) {
                req.flash('danger', 'Email not registered!')
                res.redirect('/login')
                return
            }

            const isMatch = bcrypt.compareSync(inputPassword, result.rows[0].password)

            if(!isMatch) {
                req.flash('danger', 'Incorrect Password!')
                res.redirect('/login')
            } else {
                req.session.isLogin = true
                req.session.user = {
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    email: result.rows[0].email,
                }

                req.flash('success', 'Login successful')
                res.redirect('/blog')
            }
            
        })
    })
})

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