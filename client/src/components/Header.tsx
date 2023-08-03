import React from 'react';
import { Twitter } from 'react-bootstrap-icons';

const Header = () => {
  return (
    <div className="container bg-light d-flex justify-content-center align-items-center" style={{ height: '4rem' }}>
      <a href="#" className="text-decoration-none text-dark">
        <Twitter width="24" height="24" />
      </a>
    </div>
  );
};

export default Header;
