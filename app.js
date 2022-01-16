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
    res.render('index', {isLogin})
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
                    postFullTime: function() {
                        return getFullTime(dbData.postAt)
                    },
                    distanceTime: getDistanceTime(dbData.postAt),
                }
            })

            res.render('blog', {isLogin, blogs : newData})
        })
    })
})

app.get('/blog-detail/:id', (req, res) => {
    let id = req.params.id
    res.render('blog-detail', {isLogin, blog : {
        id : id,
        title : 'Welcome to my Website',
        author : 'Karunia Leo Gultom',
        postAt: new Date(),
        postFullTime: function() {
            return getFullTime(this.postAt)
        },
        distanceTime: function() {
            return getDistanceTime(this.postAt)
        },
        content : lorem.generateSentences(10)
    }})
})

app.get('/add-blog',(req, res) => {
    res.render('add-blog', {isLogin})
})

app.get('/edit-blog/:index',(req, res) => {
    let index = req.params.index

    res.render('edit-blog', {
        title: blogs[index].title,
        content: blogs[index].content,
        index,
        isLogin
    })
})

app.get('/delete/:index', (req, res) => {
    let index = req.params.index

    blogs.splice(index, 1)

    res.redirect('/blog')
})

// ROUTE METHOD POST

app.post('/blog', (req, res) => {
    let data = req.body

    data = {
        title: data.inputTitle,
        postAt: new Date(),
        postFullTime: function() {
            return getFullTime(this.postAt)
        },
        distanceTime: function() {
            return getDistanceTime(this.postAt)
        },
        author: 'Karunia Leo Gultom',
        content: data.inputContent,
    }

    blogs.push(data)

    res.redirect('/blog')
})

app.post('/edit-blog/:index', (req, res) => {
    let data = req.body

    index = req.params.index

    data = {
        title: data.inputTitle,
        postTime: new Date(),
        postAt: getFullTime(new Date()),
        distanceTime: function() {
            return getDistanceTime(this.postTime)
        },
        author: 'Karunia Leo Gultom',
        content: data.inputContent,
    }

    blogs[index] = data
    
    res.redirect('/blog')
})

app.listen(port, () => {
    console.log(`Server starting on http://localhost:${port}/\nPress Ctrl-C to exit`)
})