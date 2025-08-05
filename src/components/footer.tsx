// src/components/Footer.tsx
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import logoImg from '@/assets/logo_footer.png';
import instagramImg from '@/assets/instagram.png';

const GlobalStyle = createGlobalStyle`
  html {
    scroll-behavior: smooth;
  }
`;

const Footer = () => (
<>
    <GlobalStyle />
    <FooterContainer>
        <FooterTop>
        <Logo src={logoImg} alt="LinguaLab" />
        <Nav>
            <NavLink href="#top">LinguaLab</NavLink>
            <NavLink href="#solutions">Serviços</NavLink>
            <NavLink href="#plans">Conheça nossos planos</NavLink>
            <NavLink href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">Contato</NavLink>
        </Nav>
        </FooterTop>
        <Separator />
        <FooterBottom>
        <Social>
            Acompanhe nossas redes sociais:
            <SocialLink href="https://instagram.com/lingua_lab_oficial" target="_blank" rel="noopener noreferrer">
            <SocialIcon src={instagramImg} alt="Instagram" />
            </SocialLink>
        </Social>
        </FooterBottom>
    </FooterContainer>
  </>
);

export default Footer;

// styled-components
const FooterContainer = styled.footer`
  background-color: #0B5471;
  color: #ffffff;
  width: 100%;
`;

const FooterTop = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;

const Logo = styled.img`
  height: 5rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled.a`
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    opacity: 0.8;
  }
`;

const Separator = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  margin: 0;
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  text-align: right;
`;

const Social = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const SocialLink = styled.a``;

const SocialIcon = styled.img`
  width: 24px;
  height: 24px;
`;
