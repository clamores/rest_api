const express = require('express');
const app = express();
const port = 3000;
const file = './hossein.txt';
const lineReader = require('line-reader');
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies
const fs = require('fs')
const lineReplace = require('line-replace')


app.get('/hossein', (req, res) => {
    let obj = {}, i = 1
    lineReader.eachLine(file, (line, last) => {
        obj['line ' + i] = line
        i++
        if (last)
            return res.json(obj)
    })
});

app.post('/hossein', (req, res) => {
    if (!('val' in req.body))
        return res.status(400).json({ msg: 'bad request' });
    fs.appendFileSync(file, '\n' + req.body.val);
    return res.json({ msg: 'added successfully!' });
})

app.put('/hossein', (req, res) => {
    if (!('val' in req.body && 'line' in req.body))
        return res.status(400).json({ msg: 'bad request' });
    lineReplace({
        file: file,
        line: parseInt(req.body.line),
        text: req.body.val,
        callback: () => { return res.json({ msg: 'changed!' }) }
    })
})

app.delete('/hossein', (req, res) => {
    if (!('line' in req.body))
        return res.status(400).json({ msg: 'bad request' });
    lineReplace({
        file: file,
        line: parseInt(req.body.line),
        text: '',
        addNewLine: false,
        callback: () => { return res.json({ msg: 'deleted!' }) }
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});