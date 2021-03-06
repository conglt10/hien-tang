import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/giver.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useInput } from '../lib/useInput';
import axios from 'axios';

function Giver() {
  const { value: formality, bind: bindFormality } = useInput(null);
  const { value: passportID, bind: bindPassportID } = useInput(null);
  const { value: organ, bind: bindOrgan } = useInput('Tim');
  const { value: fullname, bind: bindFullname } = useInput(null);
  const { value: secret, bind: bindSecret } = useInput(true);
  const { value: major, bind: bindMajor } = useInput(null);
  const { value: birthday, bind: bindBirthday } = useInput(null);
  const { value: address, bind: bindAddress } = useInput(null);
  const { value: gender, bind: bindGender } = useInput('Nam');
  const { value: company, bind: bindCompany } = useInput(null);
  const { value: blood, bind: bindBlood } = useInput('AB');
  const { value: height, bind: bindHeight } = useInput(null);
  const { value: weight, bind: bindWeight } = useInput(null);
  const { value: phone, bind: bindPhone } = useInput(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    //const urlServer = process.env.SERVER_URL;

    const data = {
      formality,
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
      passportID
    };

    axios
      .post(`http://localhost:8080/register/giver`, { data })
      .then((res) => {
        toast.success('Đăng ký thành công', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      })
      .catch((error) => {
        if (error.response.status === 409) {
          toast.error('Bạn đã đăng ký với hệ thống', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
        } else {
          toast.error('Đăng ký không thành công', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
        }
      });
  };

  return (
    <div id='giver' className='pt-5'>
      <h3 className='text-white mb-4'>ĐƠN TỰ NGUYỆN HIẾN MÔ, BỘ PHẬN CƠ THỂ Ở NGƯỜI</h3>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
      <Form onSubmit={handleSubmit}>
        {/* <FormGroup>
          <Label for='formality'>Hình thức đăng ký hiến</Label>
          <Input type='select' name='formality' id='formality' {...bindFormality}>
            <option>Hiến mô tạng sau khi chết não</option>
            <option>Hiến mô tạng khi còn sống</option>
          </Input>
        </FormGroup> */}

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

        <Button color='primary'>Submit</Button>
      </Form>
    </div>
  );
}

export default Giver;
