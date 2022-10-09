const path = require('path')
const express = require('express')
const JSONdb = require('simple-json-db')
const cors = require('cors')

const app = express()
const db = new JSONdb(path.join('mock_db.json'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))

app.use(cors({
    origin: 'http://localhost:3000'
}))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get('/list', (req, res) => {
    const data = db.get('list');
    res.json(data);
})

app.post('/list', (req, res) => {
    const { payload } = req.body;
    const data = db.get('list');
    
    try {
        var { id } = payload;
    } catch (err) {
        return res.status(400).json({ msg: "Missing payload" });
    }

    if (!id) {
        return res.status(400).json({ msg: "Missing id" });
    }
    if (id in data) {
        return res.status(400).json({ msg: `Entry with id ${id} already exists.` });
    }

    data[id] = { ...payload };
    db.set('list', data);
    res.json(payload);
})

app.put('/list', (req, res) => {
    const { payload } = req.body;
    const data = db.get('list');

    try {
        var { id } = payload;
    } catch (err) {
        return res.status(400).json({ msg: "Missing payload" });
    }

    if (!id) {
        return res.status(400).json({ msg: "Missing id" })
    }

    if (!(id in data)) {
        return res.status(400).json({ msg: `Entry with id ${id} does not exist.`  })
    }

    data[id] = { ...payload };
    db.set('list', data);
    res.json(payload);
})

app.delete('/list/:id', (req, res) => {
    const id = req.params.id;
    const data = db.get('list');
    if (!(id in data)) {
        return res.status(400).json({ msg: `Entry with id ${id} not found` })
    }
    delete data[id];
    db.set('list', data);
    res.json({ id: id });
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));