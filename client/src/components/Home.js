import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/home.css';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div id='home' className='pt-5'>
      <div className='title-home mb-5'>
        <h1 className='hello-title text-center mb-5'>Bạn trong tôi!</h1>
        <p className='hello-content'>
          "Hàng ngày, hàng giờ ở Việt Nam có hàng ngàn người bệnh đang mỏi mòn chờ ghép tạng nhưng
          rất ít người trong số họ có cơ may đó vì số người hiến rất khan hiếm. Do đó, cứu giúp
          người bằng cách đăng ký hiến mô, tạng sau khi qua đời là một việc làm đầy nhân văn."
        </p>
      </div>
      <div className='home-button text-center'>
        <Link to='/giver'>
          <Button color='primary'>Đăng ký hiến tạng</Button>
        </Link>

        <Link to='/receiver'>
          <Button color='warning'>Đăng ký nhận tạng</Button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
