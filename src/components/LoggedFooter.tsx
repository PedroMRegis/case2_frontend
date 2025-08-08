import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logoImg from '@/assets/logo.png';

const LoggedFooter = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('alunoData');
    navigate('/');
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <Logo src={logoImg} alt="LinguaLab" />
        </FooterSection>
        
        <FooterSection>
          <LogoutLink onClick={handleLogout}>Sair da Conta</LogoutLink>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <Copyright>
          © 2024 LinguaLab. Todos os direitos reservados.
        </Copyright>
      </FooterBottom>
    </FooterContainer>
  );
};

export default LoggedFooter;

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #0B5471 0%, #7699a8 100%);
  color: white;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FooterSection = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 5rem;
`;

const LogoutLink = styled.button`
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const FooterBottom = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem 2rem;
  text-align: center;
`;

const Copyright = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
`;

const FooterLink = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.875rem;
  text-align: left;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: white;
  }
`;


const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContactItem = styled.span`
  color: rgba(255, 255, 255, 0.8);
`;
