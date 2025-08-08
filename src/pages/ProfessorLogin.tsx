import { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logoImg from '@/assets/logo.png';

const ProfessorLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/professores/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao fazer login');
      }

      // Armazenar dados do professor no localStorage
      localStorage.setItem('professorData', JSON.stringify(data.professor));
      
      console.log('Login de professor realizado com sucesso:', data);
      navigate('/professores');
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LogoWrapper>
          <Logo src={logoImg} alt="LinguaLab" />
        </LogoWrapper>
        
        <Title>Login Professor</Title>
        <Subtitle>Acesse sua área do professor</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <LoginForm onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </InputGroup>

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </LoginButton>
        </LoginForm>

        <LinksSection>
          <LoginLink as={Link} to="/login">
            Login como Aluno
          </LoginLink>
          
          <LoginLink as={Link} to="/professor/cadastro">
            Cadastrar como Professor
          </LoginLink>
        </LinksSection>
      </LoginCard>
    </LoginContainer>
  );
};

export default ProfessorLogin;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #f5f5f5;
`;

const LoginCard = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const Logo = styled.img`
  height: 6rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0B5471;
  text-align: center;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  text-align: center;
  margin: 0;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #7699a8;
  }

  &::placeholder {
    color: #999;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const LoginButton = styled.button`
  background-color: #0B5471;
  color: #ffffff;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #7699a8;
    cursor: not-allowed;
  }
`;

const LinksSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
`;

const LoginLink = styled.a`
  color: #0B5471;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: opacity 0.2s;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fde8e8;
  color: #e53e3e;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  text-align: center;
`;
