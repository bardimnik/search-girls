const express = require('express')
const collector = require('./modules/collector')

const app = express()

const group = process.env.GROUP
const token = process.env.TOKEN

app.use(express.static('./static'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  collector(group, 4000, token).then(body => {
    res.render('pages/index', {
      data: body
    })
  })
})

app.listen(80, () => {
  console.log(`Listening on localhost...`)
})
