// BUILD YOUR SERVER HERE
const express = require('express');
const User = require('./users/model')

const server = express()
server.use(express.json())

server.put('/api/users/:id', async (req, res) => {
    try {
        const possibleUser = await User.findById(req.params.id)
        if (!possibleUser) {
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        } else {
            if (!req.body.name || !req.body.bio) {
                res.status(400).json({
                    message: "Please provide name and bio for the user"
                })
            } else {
                const updatedDeets = await User.update(
                    req.params.id,
                    req.body
                )
                res.status(200).json(updatedDeets)
            }
        }
    } catch (err) {
        res.status(500).json({
            message: "The user information could not be modified",
            err: err.message,
            stack: err.stack
        })
    }
})

server.delete('/api/users/:id', async (req, res) => {
    try {
        const thisUser = await User.findById(req.params.id)
        if (!thisUser) {
            res.status(404).json({
                message: 'The user with the specified ID does not exist'
            })
        } else {
            const deletedUser = await User.remove(thisUser.id)
            res.status(200).json(deletedUser)
        }
    } catch (err) {
        res.status(500).json({
            message: "The user could not be removed",
            err: err.message,
            stack: err.stack
        })
    }
})

server.post('/api/users', (req, res) => {
    const user = req.body
    if (!user.name || !user.bio) {
        res.status(400).json({
            message: 'Please provide name and bio for the user'
        })
    } else {
        User.insert(user)
            .then(newUser => {
                res.status(201).json(newUser)
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Error getting all users',
                    err: err.message,
                })
            })
    }
})

server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error getting all users',
                err: err.message,
            })
        })
})

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).json({
                    message: "The user with the specified ID does not exist"
                })
            }
            res.json(user)
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error getting user',
                err: err.message,
            })
        })
})

server.use('*', (req, res) => {
    res.status(404).json({
        message: 'not found'
    })
})


module.exports = server;
