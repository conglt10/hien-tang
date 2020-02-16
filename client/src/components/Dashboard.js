import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/dashboard.css';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import {
  Nav,
  NavItem,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  NavLink
} from 'reactstrap';

function Dashboard(props) {
  function LogOut() {
    localStorage.removeItem('token');
    props.history.push('/admin');
  }

  return (
    <div id='dashboard' className='pt-2'>
      <Nav tabs>
        <NavItem>
          <NavLink href='#' active>
            Link
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href='#' active>
            Link
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href='#' active>
            Link
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href='#' active>
            Link
          </NavLink>
        </NavItem>
        <Button color='info' onClick={LogOut}>
          Logout
        </Button>
      </Nav>
    </div>
  );
}

export default Dashboard;
