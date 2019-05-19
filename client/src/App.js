import React from 'react'
import Chat from './Socket/Chat'
import Map from './Maps/Map'

const App = () => {
    return (
        <main>
            <i>Last update 18/05/19</i> <br />
            <Chat />
            <Map />
        </main>
    )
}

export default App