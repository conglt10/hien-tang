import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/admin.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useInput } from '../lib/useInput';
import axios from 'axios';

function Admin() {
  const { value: username, bind: bindUsername, reset: resetUsername } = useInput(null);
  const { value: password, bind: bindPassword, reset: resetPassword } = useInput(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const urlServer = process.env.SERVER_URL;

    const data = {
      username,
      password
    };

    axios.post(`${urlServer}/auth/login`, { data }).then((res) => {
      console.log(res);
      console.log(res.data);
    });
  };

  return (
    <div id='admin' className='pt-5'>
      <h3 className='text-white mb-4'>ĐĂNG NHẬP VỚI TÀI KHOẢN BỆNH VIỆN</h3>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for='username'>
            Tên đăng nhập <span className='require'>*</span>
          </Label>
          <Input type='text' name='username' id='username' required {...bindUsername} />
        </FormGroup>

        <FormGroup>
          <Label for='password'>
            Mật khẩu <span className='require'>*</span>
          </Label>
          <Input type='password' name='password' id='password' required {...bindPassword} />
        </FormGroup>

        <Button color='primary'>Đăng nhập</Button>
      </Form>
    </div>
  );
}

export default Admin;
