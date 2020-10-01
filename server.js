const express = require('express')
const app = express()

app.get('/healthcheck',(req,res)=>{
    console.log('healthy!!!')
    res.send('healthy!!!')
})

app.listen(process.env.PORT || 5000)