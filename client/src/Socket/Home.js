import React from "react";

const Home = () => {
    return (
        <div>
            <div>
                <i>
                    Last update 05 June 2019
                    <a href="https://github.com/BestVersion7/realtime-chat-app">
                        https://github.com/BestVersion7/realtime-chat-app
                    </a>
                </i>
            </div>
            <h3>
                Real-time Chat!
                <br />
                Click on one of the rooms to begin
            </h3>
            <section className="home-container">
                {["game1", "game2", "game3"].map(item => (
                    <a
                        key={item}
                        className="link-container"
                        href={`/room/${item}`}
                    >
                        {item}
                    </a>
                ))}
            </section>
        </div>
    );
};

export default Home;
