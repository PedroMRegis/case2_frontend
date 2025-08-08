import styled from 'styled-components';
import logoImg from '@/assets/logo.png';
import { User } from "@phosphor-icons/react";

interface LoggedHeaderProps {
  userName: string;
}

const LoggedHeader = ({ userName }: LoggedHeaderProps) => {
  return (
    <HeaderContainer>
      <Logo src={logoImg} alt="LinguaLab" />
      <HeaderActions>
        <UserName>{userName}</UserName>
        <ProfileButton>
          <User size={32} weight="regular" />
        </ProfileButton>
      </HeaderActions>
    </HeaderContainer>
  );
};

export default LoggedHeader;

const HeaderContainer = styled.div`
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.img`
  height: 5rem;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  color: #0B5471;
  font-size: 1.1rem;
  font-weight: 500;
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 50%;
  transition: background-color 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0B5471;

  &:hover {
    background-color: #f0f7fa;
  }
`;
