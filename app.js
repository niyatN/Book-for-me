const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res, next)=>{
    res.send('Om Shri ganeshah namah...')
})


app.listen(3000,(err)=>{
    if(err) throw err;
    console.log('I am listeng...')
})