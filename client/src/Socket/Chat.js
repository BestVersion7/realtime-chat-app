import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Button } from "@material-ui/core";
import { convertDate } from "../Utilities/convertDate";
import {Link} from 'react-router-dom'

let socket = io("http://localhost:4000");
if (process.env.NODE_ENV === "production") {
    socket = io({ transportOptions: ["websocket"] });
}

const Chat = ({ match }) => {
    const [messages, setMessages] = useState([]);
    const [name, setName] = useState("Anon");
    const [message, setMessage] = useState("hello there");
    const [userCount, setUserCount] = useState(null);
    const [typingMessage, setTypingMessage] = useState("");

    useEffect(() => {
        // joining rooms
        socket.emit("userJoin", match.params.id);
        socket.on("countUser", data => {
            // console.log(data);
            setUserCount(data);
        });

        // fetching data
        socket.emit("getComments", match.params.id);
        socket.on("loadComments", data => {  
            setMessages(data);
            // scroll to bottom on initial render
            if(data.length>0) {
                document
                .getElementById("chat-container")
                .lastElementChild.scrollIntoView();
            }
        });

        // posting data
        socket.on("postSuccess", () => {
            socket.emit("getComments", match.params.id);
        });

        socket.on('typingMessage', data => {
            console.log(data)
            setTypingMessage(data)
            document.getElementById('typingMessage').scrollIntoView()
        })

        return () => {
            // leave the room
            socket.emit("userLeave", match.params.id);
            socket.disconnect();
        };
    }, [match.params.id]);

    const handleSubmit = e => {
        e.preventDefault();
        if(!message) {
            alert('no message typed')
        }
        socket.emit("postComment", {
            name,
            message,
            room: match.params.id
        });
        setMessage("");
        socket.emit('userStopTyping', match.params.id)
    };

    const handleTyping = () => {
        socket.emit("userTyping", match.params.id)
    };

    return (
        <main className="container">
            <Link to="/">Back to Rooms</Link>
            <p>You are in {match.params.id}</p>
            <p>
                You are{" "}
                <input value={name} onChange={e => setName(e.target.value)} />{" "}
            </p>
            <section>{userCount}</section>
            <article id="chat-container" className="chat-container">
                {messages.map(({ _id, name, date, message }) => (
                    <div key={_id}>
                        {`${convertDate(date)}`} <strong>{name}</strong>:{" "}
                        {message}
                    </div>
                ))}
                <i id="typingMessage">{typingMessage}</i>
            </article>

            <form onSubmit={handleSubmit}>
                <input
                    onKeyDown={handleTyping}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
                <Button
                    size="small"
                    type="submit"
                    color="primary"
                    variant="contained"
                >
                    Send Message
                </Button>
            </form>
        </main>
    );
};

export default Chat;
