import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/register.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useInput } from '../lib/useInput';
import axios from 'axios';

function Register() {
  const { value: passportID, bind: bindPassportID, reset: resetPassportID } = useInput(null);
  const { value: organ, bind: bindOrgan, reset: resetOrgan } = useInput(null);
  const { value: fullname, bind: bindFullname, reset: resetFullname } = useInput(null);
  const { value: secret, bind: bindSecret, reset: resetSecret } = useInput(true);
  const { value: major, bind: bindMajor, reset: resetMajor } = useInput(null);
  const { value: birthday, bind: bindBirthday, reset: resetBirthday } = useInput(null);
  const { value: address, bind: bindAddress, reset: resetAddress } = useInput(null);
  const { value: gender, bind: bindGender, reset: resetGender } = useInput(null);
  const { value: company, bind: bindCompany, reset: resetCompany } = useInput(null);
  const { value: blood, bind: bindBlood, reset: resetBlood } = useInput(null);
  const { value: height, bind: bindHeight, reset: resetHeight } = useInput(null);
  const { value: weight, bind: bindWeight, reset: resetWeight } = useInput(null);
  const { value: phone, bind: bindPhone, reset: resetPhone } = useInput(null);
  const { value: hospital, bind: bindHospital, reset: resetHospital } = useInput(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const urlServer = process.env.SERVER_URL;

    const data = {
      passportID,
      organ,
      fullname,
      secret,
      major,
      birthday,
      address,
      gender,
      company,
      blood,
      height,
      weight,
      phone,
      hospital
    };

    axios.post(`${urlServer}/register`, { data }).then((res) => {
      console.log(res);
      console.log(res.data);
    });
  };

  return (
    <div id='register' className='pt-5'>
      <h3 className='text-white mb-4'>ĐƠN KÝ NHẬN TẠNG, BỘ PHẬN CƠ THỂ Ở NGƯỜI</h3>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for='organ'>
            Bộ phận đăng ký hiến <span className='require'>* </span>
          </Label>
          <Input type='select' name='organ' id='organ' {...bindOrgan}>
            <option selected='selected'>Tim</option>
            <option>Gan</option>
            <option>Phổi</option>
            <option>Giác Mạc</option>
            <option>Thận</option>
            <option>Sụn</option>
            <option>Da</option>
            <option>Mạch máu</option>
            <option>Xương</option>
            <option>Gân</option>
            <option>Tụy</option>
            <option>Van Tim</option>
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for='fullname'>
            Họ và tên <span className='require'>*</span>
          </Label>
          <Input type='text' name='fullname' id='fullname' required {...bindFullname} />
        </FormGroup>

        <FormGroup>
          <Label for='secret'>
            Giữ bí mật ? <span className='require'>*</span>
          </Label>
          <FormGroup check>
            <Label check>
              <Input type='radio' value='true' name='secret' />
              Có
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type='radio' value='false' name='secret' {...bindSecret} /> Không
            </Label>
          </FormGroup>
        </FormGroup>

        <FormGroup>
          <Label for='birthday'>
            Ngày sinh <span className='require'>*</span>
          </Label>
          <Input type='date' name='birthday' id='birthday' required {...bindBirthday} />
        </FormGroup>

        <FormGroup>
          <Label for='gender'>Giới tính</Label>
          <Input type='select' name='gender' id='gender' {...bindGender}>
            <option>Nam</option>
            <option>Nữ</option>
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for='address'>
            Địa chỉ thường trú <span className='require'>*</span>
          </Label>
          <Input type='textarea' name='address' id='address' {...bindAddress} />
        </FormGroup>

        <FormGroup>
          <Label for='passportID'>
            Số chứng minh (căn cước) công dân <span className='require'>*</span>
          </Label>
          <Input type='number' name='passportID' id='passportID' {...bindPassportID} />
        </FormGroup>

        <FormGroup>
          <Label for='major'>Nghề nghiệp</Label>
          <Input type='text' name='major' id='major' {...bindMajor} />
        </FormGroup>

        <FormGroup>
          <Label for='company'>Công ty</Label>
          <Input type='text' name='company' id='company' {...bindCompany} />
        </FormGroup>

        <FormGroup>
          <Label for='phone'>
            Điện thoại <span className='require'>*</span>
          </Label>
          <Input type='tel' name='phone' id='phone' pattern='[0-9]{10}' required {...bindPhone} />
        </FormGroup>

        <FormGroup>
          <Label for='height'>
            Chiều cao (cm) <span className='require'>*</span>
          </Label>
          <Input type='number' name='height' id='height' required {...bindHeight} />
        </FormGroup>

        <FormGroup>
          <Label for='weight'>
            Cân nặng (kg) <span className='require'>*</span>
          </Label>
          <Input type='number' name='weight' id='weight' required {...bindWeight} />
        </FormGroup>

        <FormGroup>
          <Label for='blood'>
            Nhóm máu <span className='require'>*</span>
          </Label>
          <Input type='select' name='blood' id='blood' required {...bindBlood}>
            <option selected='selected'>AB</option>
            <option>A</option>
            <option>B</option>
            <option>O</option>
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for='weight'>
            Bệnh viện đăng ký khám <span className='require'>*</span>
          </Label>
          <Input type='select' name='hospital' id='hospital' required {...bindHospital}>
            <option selected='selected'>Bạch Mai</option>
            <option>Chợ Rẫy</option>
          </Input>
        </FormGroup>

        <Button color='primary'>Submit</Button>
      </Form>
    </div>
  );
}

export default Register;
