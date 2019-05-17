require('dotenv').config()
const express = require('express')
const app = express()
const socket = require('socket.io')
const server = require('http').Server(app)
const io = socket(server)
const Message = require('./api/model/message')
const cors = require('cors')
const path = require('path')
app.use(cors())
const mongoose = require('mongoose')

app.use(express.json())
app.use(express.urlencoded({extended: false}))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

mongoose.connect(process.env.MONGO, {useNewUrlParser: true})
.then(() => console.log('mongoose running'))
.catch(err => console.error(err))


let userCount = 0;

io.on('connection', function(socket) {
    // user count
    userCount ++
    io.emit('countUser', `${userCount} users are currently online`)

    socket.on('getData', async () => {
        try {
            // aggregate limit and order by
            const data = await Message.aggregate([
                {$sort: {'date': -1}},
                {$limit: 30},
                {$sort: {'date': 1}}
            ])
            socket.emit('loadData', data)
        } catch(err) {
            socket.emit('error', err)
        }
    })

    socket.on('postData', async (data) => {
        try {
            const post = await Message.create({
                name: data.name,
                message: data.message
            })
            return io.emit('postSuccess', post)
        } catch(err) {
            return socket.emit('error', err)
        }
    })

    socket.on('userTyping', data => {
        socket.broadcast.emit('typingMessage', data)
    })

    socket.on('disconnect', () => {
        userCount--
        io.emit('countUser', `${userCount} users are currently online`)
    })
})

const port = process.env.PORT || 4000
server.listen(port, () => console.log(`server running on ${port}`))