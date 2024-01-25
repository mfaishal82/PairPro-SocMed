const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(express.static('public/css'))
app.use(express.static('public/img'))

app.use(require('./routes'))  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})