import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/dashboard.css';
import { Button } from 'reactstrap';
import { Nav, NavItem, NavLink } from 'reactstrap';

function DashboardAdmin(props) {
  function LogOut() {
    localStorage.removeItem('token');
    props.history.push('/login');
  }

  return (
    <div id='dashboard'>
      <Nav tabs>
        <NavItem>
          <NavLink href='/manage/doctor' active>
            Quản lý bác sĩ
          </NavLink>
        </NavItem>
        <Button color='info' onClick={LogOut}>
          Đăng xuất
        </Button>
      </Nav>
    </div>
  );
}

export default DashboardAdmin;
