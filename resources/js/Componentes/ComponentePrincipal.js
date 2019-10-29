import React, { Component } from 'react'
    import ReactDOM from 'react-dom'
    import { BrowserRouter, Route, Switch } from 'react-router-dom'
    import Menu from "./Menu/Menu"


    class App extends Component {
      render () { 
        return (
          
            <div>
              <Menu />
            </div>
          
        )
      }
    }

    ReactDOM.render(<App />, document.getElementById('app'))