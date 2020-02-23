import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/manageDoctor.css';
import { Table } from 'reactstrap';

function ManageDoctor(props) {
  return (
    <div id='manage_doctor'>
      <Table bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope='row'>1</th>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope='row'>2</th>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope='row'>3</th>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default ManageDoctor;
