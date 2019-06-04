import React from "react";

const Home = () => {
    return (
        <div>
            <div>
                <i>
                    Last update 05 June 2019
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/BestVersion7/realtime-chat-app"
                    >
                        https://github.com/BestVersion7/realtime-chat-app
                    </a>
                </i>
            </div>
            <h3>Real-time Chat!</h3>
            <h4>Click on one of the rooms to begin</h4>
            <section className="home-container">
                {["game1", "game2", "game3"].map(item => (
                    <a
                        key={item}
                        className="link-container"
                        href={`/room/${item}`}
                    >
                        <h1>{item}</h1>
                    </a>
                ))}
            </section>
        </div>
    );
};

export default Home;
