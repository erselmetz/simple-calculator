const express = require('express')
const app = express()
const path = require('path')

app.use('/appjs',express.static(path.join(__dirname,'./src/app.js')))
app.use('/style',express.static(path.join(__dirname,'./src/style.css')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'./src/index.html'));
})

app.listen(1000, () => {console.log('project is listening on port 1000')})