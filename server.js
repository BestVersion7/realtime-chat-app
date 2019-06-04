require('dotenv').config()
const express = require('express')
const app = express()
const socket = require('socket.io')
const server = require('http').Server(app)
const io = socket(server)
const Message = require('./api/model/message')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// private
// const messageRouter = require('./api/routes/message')
// app.use('/api/messages', messageRouter)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

mongoose.connect(process.env.MONGO, {useNewUrlParser: true})
.then(() => console.log('mongoose running'))
.catch(err => console.error(err))

io.on('connection', socketController)

const port = process.env.PORT || 4000
server.listen(port, () => console.log(`server running on ${port}`))

// socket Controller
// the game rooms
let users = {
    game1: 0,
    game2: 0,
    game3: 0
};

function socketController (socket) {
    socket.on('userJoin', room => {
        socket.join(room)
        users[room]++
        io.to(room).emit('countUser', users[room])
    })

    socket.on('userLeave', room => {
        socket.leave(socket.room)
        users[room]--
        socket.broadcast.to(room).emit('countUser', users[room])
    })

    socket.on('getComments', async room => {
        try {
            // aggregate limit and order by
            const data = await Message.aggregate([
                { "$match": { room } },
                {$sort: {'date': -1}},
                {$limit: 30},
                {$sort: {'date': 1}},
            ]) 
            return io.to(room).emit('loadComments', data)
        } catch(err) {
            console.error(err)
        }
    })

    socket.on('postComment', async data => {
        try {
            await Message.create({
                name: data.name,
                message: data.message,
                room: data.room
            })
            return io.to(data.room).emit('postSuccess')
        } catch(err) {
            console.error(err)
        }
    })

    // socket.on('userTyping', data => {
    //     socket.broadcast.emit('typingMessage', data)
    // })
}
