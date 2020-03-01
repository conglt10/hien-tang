import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/dashboard.css';
import { Button } from 'reactstrap';
import { Nav, NavItem, NavLink } from 'reactstrap';

function DashboardDoctor(props) {
  function LogOut() {
    localStorage.removeItem('token');
    props.history.push('/login');
  }

  return <h1>Hello Doctor</h1>;
}

export default DashboardDoctor;
