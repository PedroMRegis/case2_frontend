import styled from 'styled-components';
import logoImg from '@/assets/logo.png';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <HeaderContainer>
      <Logo src={logoImg} alt="LinguaLab" />
      <LoginButton as={Link} to="/login">Login</LoginButton>
    </HeaderContainer>
  );
};

export default Header;


const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  background: #ffffff;
  z-index: 1000;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
`;

const Logo = styled.img`
  height: 5rem;
`;

const LoginButton = styled.button`
  background: #0B5471;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;
