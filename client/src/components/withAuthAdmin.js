import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default function withAuthAdmin(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false
      };
    }

    componentDidMount() {
      const token = localStorage.getItem('token');

      axios
        .get(`http://localhost:8080/checkTokenAdmin`, {
          headers: {
            authorization: `${token}`
          }
        })
        .then((res) => {
          this.setState({ loading: false });
        })
        .catch((error) => {
          this.setState({ loading: false, redirect: true });
        });
    }

    render() {
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to='/login' />;
      }
      return <ComponentToProtect {...this.props} />;
    }
  };
}
