import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/home.css';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

function Forbidden() {
  return (
    <div id='home' className='pt-5'>
      <h1>403 Forbidden</h1>
      <Link to='/home'>
        <Button color='primary'>Trở về trang chủ</Button>
      </Link>
    </div>
  );
}

export default Forbidden;
