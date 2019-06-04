import React from "react";
import Home from "./Socket/Home";
import Chat from "./Socket/Chat";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/room/:id" component={Chat} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
};

const NotFound = () => {
    return <div>notfoun</div>;
};

export default App;
