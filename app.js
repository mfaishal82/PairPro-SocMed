const express = require('express')
const app = express()
const port = 3000
const session = require('express-session')

app.set('view engine', 'ejs')
app.use(express.static('public/css'))
app.use(express.static('public/img'))
app.use(express.urlencoded({extended: true}))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    sameSite: true
  }
}))

app.use(require('./routes'))  

// app.get('/', (req, res) => {
//   try {
//     res.send('Okeee')
//   } catch (error) {
//     res.send(error)
//   }
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})