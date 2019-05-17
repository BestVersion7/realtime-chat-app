import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { Button, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core'
import { convertDate } from '../Utilities/convertDate'
import Check from '@material-ui/icons/Check'

let socket = io.connect('http://localhost:4000')
if (process.env.NODE_ENV === 'production') {
    socket = io.connect({ transportOptions: ['websocket'] })
}

const Home = () => {
    return (
        <div>
            <h3>Technologies Used</h3>
            <p>
                Link to repo: <span> </span>
                <a href="https://github.com/BestVersion7/realtime-chat-app">
                    https://github.com/BestVersion7/realtime-chat-app
                </a>
            </p>
            <section>
                <h3>Technologies Used: Front-End</h3>
                <List>
                    {['Socket.io', 'Reactjs', 'CSS', 'HTML', 'Material UI'].map((item, index) => (
                        <ListItem key={index}>
                            <ListItemIcon><Check /></ListItemIcon>
                            <ListItemText primary={item} />
                        </ListItem>
                    ))}
                </List>
            </section>
            <section>
                <h3>Technologies Used: Back-end (Real-time)</h3>
                <List>
                    {['Socket.io', 'ExpressJs', 'Nodejs', 'MongoDB Atlas'].map((item, index) => (
                        <ListItem key={index}>
                            <ListItemIcon><Check /></ListItemIcon>
                            <ListItemText primary={item} />
                        </ListItem>
                    ))}
                </List>
            </section>
        </div>
    )
}

const Chat = () => {
    const ContainerRef = useRef()
    const [messages, setMessages] = useState([])

    const [name, setName] = useState('Anon')
    const [message, setMessage] = useState('')

    const [userCount, setUserCount] = useState(null)

    const [typingMessage, setTypingMessage] = useState('')

    useEffect(() => {
        // http requests
        socket.emit('getData')
        socket.on('loadData', data => {
            console.log(data)
            setMessages(data)
        })

        socket.on('postSuccess', () => {
            socket.emit('getData')
        })

        // this counts the number of users
        socket.on('countUser', data => {
            console.log(data)
            setUserCount(data)
        })

        socket.on('typingMessage', data => {
            console.log(data)
            setTypingMessage(data)
            setTimeout(() => ContainerRef.current.scrollTop = ContainerRef.current.scrollHeight, 330)
        })

        // 
    }, [])

    const handleSubmit = e => {
        e.preventDefault()
        if (!message) {
            return
        }
        socket.emit('postData', {
            name, message
        })
        setMessage('')
        socket.emit('userTyping')
        // move to bottom of screen after finish typing
        setTimeout(() => ContainerRef.current.scrollTop = ContainerRef.current.scrollHeight, 330)
    }

    const handleTyping = () => {
        socket.emit('userTyping', `${name} is typing...`)
        setTimeout(() => ContainerRef.current.scrollTop = ContainerRef.current.scrollHeight, 330)
    }

    return (
        <main className="container">
            <h3>Real-time Chat!</h3>
            <p>You are <input value={name} onChange={e => setName(e.target.value)} /> </p>

            <section>{userCount}</section>

            <article ref={ContainerRef} className="chat-container">
                {messages.map(({ _id, name, date, message }) => (
                    <div key={_id}>
                        {`${convertDate(date)}`} <strong>{name}</strong>: {message}
                    </div>
                ))}
                <i>{typingMessage}</i>
            </article>

            <form onSubmit={handleSubmit}>
                <input onKeyDown={handleTyping} value={message} onChange={e => setMessage(e.target.value)} />
                <Button size="small" type="submit" color="primary" variant="contained">Send Message</Button>
            </form>

            <Home />
        </main>
    )
}

export default Chat