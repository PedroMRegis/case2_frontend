import { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logoImg from '@/assets/logo.png';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Dados do login:', { email, password });

    try {
    const response = await fetch('http://127.0.0.1:8000/alunos/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // This line allows cookies to be set
    });

      const data = await response.json();
      console.log('Resposta do servidor:', data);

      if (!response.ok) {
        console.error('Detalhes do erro:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        throw new Error(data.detail || 'Erro ao fazer login');
      }

      console.log('Login successful:', data.aluno);
      // Salvar dados do aluno no localStorage para usar na página
      localStorage.setItem('alunoData', JSON.stringify(data.aluno));
      navigate('/alunos');
      
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
        
        <Title>Login do Aluno</Title>
        <Subtitle>Entre na sua conta para continuar</Subtitle>

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

        <SignUpText>
          Ainda não tem uma conta?{' '}
          <SignUpLink as={Link} to="/cadastro">
            Cadastre-se
          </SignUpLink>
        </SignUpText>
        
        <LoginOptions>
          <LoginOptionText>
            Sou Professor?{' '}
            <LoginOptionLink as={Link} to="/professor/login">
              Acesse aqui
            </LoginOptionLink>
          </LoginOptionText>
          <LoginOptionText>
            Sou Administrador?{' '}
            <LoginOptionLink as={Link} to="/admin/login">
              Acesse aqui
            </LoginOptionLink>
          </LoginOptionText>
        </LoginOptions>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;

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

const SignUpText = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: #666;
  margin: 0;
`;

const SignUpLink = styled.a`
  color: #0B5471;
  text-decoration: none;
  font-weight: 500;
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

  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const LoginOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const LoginOptionText = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: #666;
  margin: 0;
`;

const LoginOptionLink = styled(SignUpLink)`
  
  text-align: center;
  font-size: 0.875rem;
  color: #666;
  margin: 0;
`;




