import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Giver from './components/Giver';
import Register from './components/Register';
import Admin from './components/Admin';
import Dashboard from './components/Dashboard';
import withAuth from './components/withAuth';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/giver' component={Giver} />
          <Route exact path='/admin' component={Admin} />
          <Route exact path='/dashboard' component={withAuth(Dashboard)} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
