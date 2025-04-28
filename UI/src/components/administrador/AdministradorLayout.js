import React from 'react';
import { Row, Col } from 'react-bootstrap';
import SidebarAdministrador from './SidebarAdministrador';
import './AdministradorLayout.css';

const AdministradorLayout = ({ children }) => {
  return (
    <Row className="m-0 p-0">
      <Col xs={12} md={3} lg={2} className="p-0 position-fixed sidebar-container">
        <SidebarAdministrador />
      </Col>
      <Col xs={12} md={{ span: 9, offset: 3 }} lg={{ span: 10, offset: 2 }} className="p-0 main-content">
        {children}
      </Col>
    </Row>
  );
};

export default AdministradorLayout;