import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Giver from './components/Giver';
import Receiver from './components/Receiver';
import Admin from './components/Admin';
import Dashboard from './components/Dashboard';
import withAuth from './components/withAuth';

function App() {
  const token = localStorage.getItem('token');
  let isLogged = token ? true : false;
  return (
    <BrowserRouter>
      <div className='App'>
        <Switch>
          <Route exact path='/' component={() => (isLogged ? <Dashboard /> : <Home />)} />
          <Route exact path='/receiver' component={Receiver} />
          <Route exact path='/giver' component={Giver} />
          <Route exact path='/admin' component={Admin} />
          <Route exact path='/dashboard' component={withAuth(Dashboard)} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
