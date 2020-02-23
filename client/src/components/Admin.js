import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/admin.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useInput } from '../lib/useInput';
import axios from 'axios';

function Admin(props) {
  const { value: username, bind: bindUsername } = useInput(null);
  const { value: password, bind: bindPassword } = useInput(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    //const urlServer = process.env.SERVER_URL;

    axios.post(`http://localhost:8080/auth/login`, { username, password }).then((res) => {
      localStorage.setItem('token', res.data.token);
      props.history.push('/dashboard');
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
