import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FiLogIn, FiLogOut, FiUserPlus, FiUser } from "react-icons/fi";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
} from "reactstrap";

import { AppContext } from "../contexts/app.context";
import { formatAmount } from "../utils/helpers";

const Header = () => {
  const { user, signOut } = useContext(AppContext);
  const isUnauthenticated = !user;
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="header">
      <Navbar className="header" expand="md">
        <NavbarBrand>
          <Link to="/">
            <img src="/images/header-logo.png" width={200} />
          </Link>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar className="w-100">
          {!isUnauthenticated && (
            <Nav navbar>
              <NavItem>
                <NavLink>
                  <Link to="/">
                    <h5 className="mb-0 mr-4">TRANG CHỦ</h5>
                  </Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  <Link to="/deposit">
                    <h5 className="mb-0 mr-4">NẠP VÀNG</h5>
                  </Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  <Link to="/withdraw">
                    <h5 className="mb-0">RÚT VÀNG</h5>
                  </Link>
                </NavLink>
              </NavItem>
            </Nav>
          )}
          {isUnauthenticated ? (
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink>
                  <Link to="/login">
                    <Button outline className="mr-2">
                      <FiLogIn className="mr-2" color="#fff" />
                      ĐĂNG NHẬP
                    </Button>
                  </Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  <Link to="/sign-up">
                    <Button outline>
                      <FiUserPlus className="mr-2" color="#fff" />
                      ĐĂNG KÝ
                    </Button>
                  </Link>
                </NavLink>
              </NavItem>
            </Nav>
          ) : (
            <Nav className="ml-auto" navbar>
              <NavItem className="d-flex align-items-center mr-3">
                <FiUser size={25} color="#fff" className="mr-2" />
                <span className="text-white font-weight-bold">
                  Số dư: {formatAmount(user.amount)}
                </span>
              </NavItem>
              <Button outline className="mr-2" onClick={signOut}>
                <FiLogOut className="mr-2" color="#fff" />
                ĐĂNG XUẤT
              </Button>
            </Nav>
          )}
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
