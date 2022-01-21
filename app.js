// app standard configuration
const express = require('express')
const app = express()
const port = process.env.PORT || '5000'

// access file system
const fs = require('fs')

// set view engine
const hbs = require('hbs');
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials');

// multer
const upload = require('./middlewares/fileUpload')

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

app.use('/public', express.static(__dirname + '/public'))
app.use(express.urlencoded({extended:false}))

// ROUTE METHOD GET

app.get('/', (req, res) => {

    db.connect((err, client, done) => {
        if (err) throw err
        
        client.query('SELECT * FROM tb_exp', function(err, result) {
            if (err) throw err

            let dbData = result.rows

            res.render('index', {
                pageTitle : 'Home | ',
                isLogin : req.session.isLogin,
                user : req.session.user,
                exps : dbData
            })
        })
    })
})

app.get('/register', (req, res) => {
    res.render('register', {
        pageTitle : 'Register | '
    })
})

app.get('/login', (req, res) => {
    res.render('login', {
        pageTitle : 'Login | '
    })
})

app.get('/logout', (req, res) => {
    req.session.destroy()

    res.redirect('/login')
})

app.get('/contact', (req, res) => {
    res.render('contact', {
        pageTitle : 'Contact | ',
        isLogin: req.session.isLogin,
        user : req.session.user,
    })
})

app.get('/blog', (req, res) => {
    db.connect((err, client, done) => {
        if (err) throw err

        const query = `SELECT tb_blog.id, tb_blog.title, tb_blog.content, tb_blog.post_at, tb_blog.image, tb_user.name AS author,
        tb_blog.author_id FROM tb_blog LEFT JOIN tb_user ON tb_blog.author_id = tb_user.id`
        
        client.query(query, function(err, result) {
            if (err) throw err

            let dbData = result.rows
            let newData = dbData.map((dbData) => {
                return {
                    ...dbData,
                    isLogin: req.session.isLogin,
                    postFullTime: getFullTime(dbData.post_at),
                    distanceTime: getDistanceTime(dbData.post_at),
                }
            })

            let errMsg = null
            if(newData.length == 0) {
                errMsg = 'Blog is empty.'
            }

            res.render('blog', {
                pageTitle : 'Blog | ',
                isLogin: req.session.isLogin,
                user : req.session.user,
                blogs : newData,
                errMsg,
            })
        })
    })
})

app.get('/blog-detail/:id', (req, res) => {
    let id = req.params.id
    
    db.connect((err, client, done) => {
        if (err) throw err

        const query = `SELECT tb_blog.id, tb_blog.title, tb_blog.content, tb_blog.post_at, tb_blog.image, tb_user.name AS author,
        tb_blog.author_id FROM tb_blog LEFT JOIN tb_user ON tb_blog.author_id = tb_user.id WHERE tb_blog.id = ${id}`

        client.query(query, (err, result) => {
            if (err) throw err

            let blogData = result.rows[0]
            blogData = {
                ...blogData,
                // isLogin : req.session.isLogin,
                postFullTime : getFullTime(blogData.post_at)
            }

            res.render('blog-detail', {
                id,
                pageTitle : 'Blog | ',
                isLogin: req.session.isLogin,
                user : req.session.user,
                blog: blogData,
            })
        })
    })
})

app.get('/add-blog',(req, res) => {
    if(!req.session.isLogin) {
        req.flash('danger', 'Error 403. Access denied.')
        res.redirect('/login')
        return
    }

    res.render('add-blog', {
        isLogin : req.session.isLogin,
        user : req.session.user,
        pageTitle : 'Add Blog | ',
    })
})

app.get('/edit-blog/:id',(req, res) => {
    if(!req.session.isLogin) {
        req.flash('danger', 'Error 403. Access denied.')
        res.redirect('/login')
        return
    }

    let id = req.params.id

    db.connect((err, client, done) => {
        if (err) throw err

        client.query(`SELECT * FROM tb_blog WHERE id = ${id}`, (err, result) => {
            if (err) throw err

            let dbData = result.rows[0]

            res.render('edit-blog', {
                id,
                title: dbData.title,
                content: dbData.content,
                image: dbData.image,
                isLogin : req.session.isLogin,
                user : req.session.user,
                pageTitle : 'Edit Blog | ',
            })
        })
    })
})

app.get('/delete/:id', (req, res) => {
    if(!req.session.isLogin) {
        req.flash('danger', 'Error 403. Access denied.')
        res.redirect('/login')
        return
    }

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
    const {inputName, inputEmail, inputPassword, confirmPassword} = req.body

    const hashedPassword = bcrypt.hashSync(inputPassword, 10)

    const selectQuery = `SELECT * FROM tb_user WHERE email='${inputEmail}'`

    let query = `INSERT INTO tb_user (name, email, password)
                    VALUES ('${inputName}', '${inputEmail}', '${hashedPassword}')`
    
    if(inputPassword != confirmPassword) {
        req.flash('danger', 'Password mismatch!')
        res.redirect('/register')
        return
    } else {
        db.connect((err, client, done) => {
            if (err) throw err

            client.query(selectQuery, (err, result) => {
                if (err) throw err

                if(result.rows.length != 0) {
                    req.flash('danger', 'Email already registered!')
                    res.redirect('/register')
                    return
                } else {
                    client.query(query, (err, result) => {
                        if (err) throw err

                        req.flash('success', 'Successfully Registered.')
                        res.redirect('/login')
                    })
                }
            })
        })
    }
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

app.post('/blog', upload.single('inputImage'), (req, res) => {
    let data = req.body

    let authorId = req.session.user.id

    let image = req.file.filename

    let query = `INSERT INTO tb_blog (title, content, image, author_id) 
                    VALUES ('${data.inputTitle}', '${data.inputContent}', '${image}', '${authorId}')`

    db.connect((err, client, done) => {
        if (err) throw err

        client.query(query, (err, result) => {
            if (err) throw err

            res.redirect('/blog')
        })
    })
})

app.post('/edit-blog/:id', upload.single('inputImage'), (req, res) => {
    let data = req.body
    let id = req.params.id

    console.log(data)

    let image = req.file.filename

    let query = `UPDATE tb_blog SET title='${data.inputTitle}', content='${data.inputContent}', image='${image}' WHERE id='${id}'`
    
    db.connect((err, client, done) => {
        if (err) throw err
        
        client.query(`SELECT image FROM tb_blog WHERE id='${id}'`, (err, result) => {
            if (err) throw err

            oldImage = result.rows[0].image
                
            client.query(query, (err, result) => {
                if (err) throw err

                fs.unlinkSync(`./public/img/uploads/${oldImage}`)
        
                res.redirect('/blog')
            })
        })
    })
})

app.listen(port, () => {
    console.log(`Server starting on http://localhost:${port}/\nPress Ctrl-C to exit`)
})