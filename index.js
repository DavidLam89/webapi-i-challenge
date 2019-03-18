const express = require('express');
const db = require('./data/db.js');
const server = express();
server.use(express.json());

server.listen(3000, () => {
    console.log('\n** API up and running on port 3k **');
})

server.post('/api/users', (req, res) => {
    const user = req.body;
    if (!user.name || !user.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }
    else db.insert(user).then(returnObj => {
        res.status(201).json(returnObj)
    }).catch(error => {
        res.status(500).json({ error: "There was an error while saving the user to the database" });
    });
})

server.get('/api/users', (req, res) => {
    db
        .find()
        .then(returnArr => {
            res.status(200).json(returnArr);
        })
        .catch(error => {
            res.status(500).json({ error: "The users information could not be retrieved." });
        })
})

server.get('/api/users/:id', (req, res) => {
    let existed = false;
    db.find().then(returnArr => {
        returnArr.map(ele => {
            if (ele.id.toString() === req.params.id) {
                existed = true;
                db.findById(req.params.id).then(returnObj => {
                    res.status(200).json(returnObj)
                }).catch(error => {
                    res.status(500).json({ error: "The user information could not be retrieved." });
                });
            }
        })
        if (!existed) res.status(404).json({ message: "The user with the specified ID does not exist." });
    }).catch(error => console.log(error))
})

server.delete('/api/users/:id', (req, res) => {
    let existed = false;
    db.find().then(returnArr => {
        returnArr.map(ele => {
            if (ele.id.toString() === req.params.id) {
                existed = true;
                db.remove(req.params.id).then(returnObj => {
                    res.status(200).json(returnObj)
                }).catch(error => {
                    res.status(500).json({ error: "The user could not be removed" });
                });
            }
        })
        if (!existed) res.status(404).json({ message: "The user with the specified ID does not exist." });
    }).catch(error => console.log(error))
})

server.put('/api/users/:id', (req, res) => {

    const user = req.body;
    if (!user.name || !user.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }
    else {
        let existed = false;
        db.find().then(returnArr => {
            returnArr.map(ele => {
                if (ele.id.toString() === req.params.id) {
                    existed = true;
                    db.update(req.params.id, user).then(returnObj => {
                        res.status(200).json(returnObj)
                    }).catch(error => {
                        res.status(500).json({ error: "The user information could not be modified." });
                    });
                }
            })
            if (!existed) res.status(404).json({ message: "The user with the specified ID does not exist." });
        }).catch(error => console.log(error))
    }
})