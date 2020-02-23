import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Giver from './components/Giver';
import Receiver from './components/Receiver';
import Login from './components/Login';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardDoctor from './components/DashboardDoctor';
import withAuthAdmin from './components/withAuthAdmin';
import withAuthDoctor from './components/withAuthDoctor';
import ManageDoctor from './components/ManageDoctor';

function App() {
  const token = localStorage.getItem('token');
  let isLogged = token ? true : false;
  return (
    <BrowserRouter>
      <div className='App'>
        <Switch>
          <Route exact path='/' component={() => (isLogged ? <Login /> : <Home />)} />
          <Route exact path='/receiver' component={Receiver} />
          <Route exact path='/giver' component={Giver} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/manage' component={withAuthAdmin(DashboardAdmin)} />
          <Route exact path='/manage/doctor' component={withAuthAdmin(ManageDoctor)} />
          <Route exact path='/doctor' component={withAuthDoctor(DashboardDoctor)} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
