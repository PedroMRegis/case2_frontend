import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import logoImg from '@/assets/logo.png';

interface Plano {
  id: string;
  nome: string;
  preco: number;
  descricao: string;
  beneficios: string[];
}

const planosDisponiveis: Plano[] = [
  {
    id: 'individual',
    nome: 'Plano Individual',
    preco: 545.00,
    descricao: 'Aulas personalizadas só para você',
    beneficios: ['Aulas particulares 1:1', 'Horários flexíveis', 'Material personalizado', 'Suporte direto com professor', 'Progressão acelerada']
  },
  {
    id: 'grupo',
    nome: 'Plano em Grupo',
    preco: 259.00,
    descricao: 'Aprenda junto com outros estudantes',
    beneficios: ['Turmas pequenas (máx. 10 alunos)', 'Interação com colegas', 'Dinâmicas de grupo', 'Preço acessível', 'Ambiente colaborativo']
  }
];

const Cadastro = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  

  const [selectedPlano, setSelectedPlano] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const planoFromUrl = searchParams.get('plano');
    if (planoFromUrl && (planoFromUrl === 'individual' || planoFromUrl === 'grupo')) {
      setSelectedPlano(planoFromUrl);
      setCurrentStep(2); // Pula direto para dados pessoais
    }
  }, [searchParams]);

  const handleNextStep = () => {
    setError('');
    
    if (currentStep === 1) {
      // Validação da primeira etapa (seleção de plano)
      if (!selectedPlano) {
        setError('Selecione um plano para continuar');
        return;
      }
      
      setCurrentStep(2);
    }
  };

  const handlePreviousStep = () => {
    setError('');
    setCurrentStep(1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      handleNextStep();
      return;
    }
    
    // Validações da segunda etapa (dados pessoais)
    if (!name || !email || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/alunos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          plano: selectedPlano 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          const errorMessages = data.detail?.map((error: any) => error.msg).join(', ') || 'Dados inválidos';
          throw new Error(errorMessages);
        }
        throw new Error(data.detail || 'Erro ao criar conta');
      }

      alert('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPlanoDetails = planosDisponiveis.find(p => p.id === selectedPlano);

  return (
    <CadastroContainer>
      <CadastroCard>
        <LogoWrapper>
          <Logo src={logoImg} alt="LinguaLab" />
        </LogoWrapper>
        
        <StepIndicator>
          <Step active={currentStep === 1} completed={currentStep > 1}>1</Step>
          <StepLine completed={currentStep > 1} />
          <Step active={currentStep === 2}>2</Step>
        </StepIndicator>

        {currentStep === 1 ? (
          <>
            <Title>Escolha seu Plano</Title>
            <Subtitle>Selecione o plano ideal para você</Subtitle>
          </>
        ) : (
          <>
            <Title>Criar Conta</Title>
            <Subtitle>Cadastre-se para começar seus estudos</Subtitle>
          </>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <CadastroForm onSubmit={handleSubmit}>
          {currentStep === 1 ? (
            // Etapa 1: Seleção de plano
            <>
              <PlanosContainer>
                {planosDisponiveis.map((plano) => (
                  <PlanoCard 
                    key={plano.id}
                    selected={selectedPlano === plano.id}
                    onClick={() => setSelectedPlano(plano.id)}
                  >
                    <PlanoHeader>
                      <PlanoNome>{plano.nome}</PlanoNome>
                      <PlanoPreco>R$ {plano.preco.toFixed(2)}/mês</PlanoPreco>
                    </PlanoHeader>
                    <PlanoDescricao>{plano.descricao}</PlanoDescricao>
                    <PlanoBeneficios>
                      {plano.beneficios.map((beneficio, index) => (
                        <Beneficio key={index}>✓ {beneficio}</Beneficio>
                      ))}
                    </PlanoBeneficios>
                  </PlanoCard>
                ))}
              </PlanosContainer>

              <CadastroButton type="submit" disabled={!selectedPlano}>
                Próximo
              </CadastroButton>
            </>
          ) : (
            // Etapa 2: Dados pessoais
            <>
              <InputGroup>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
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
                  minLength={6}
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </InputGroup>

              <ButtonGroup>
                <BackButton type="button" onClick={handlePreviousStep}>
                  Voltar
                </BackButton>
                <CadastroButton type="submit" disabled={isLoading}>
                  {isLoading ? 'Criando conta...' : 'Criar Conta'}
                </CadastroButton>
              </ButtonGroup>
            </>
          )}
        </CadastroForm>

        <LoginText>
          Já tem uma conta?{' '}
          <LoginLink as={Link} to="/login">
            Faça login
          </LoginLink>
        </LoginText>
      </CadastroCard>
    </CadastroContainer>
  );
};

export default Cadastro;

const CadastroContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #f5f5f5;
`;

const CadastroCard = styled.div`
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

const CadastroForm = styled.form`
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

const CadastroButton = styled.button`
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

const LoginText = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: #666;
  margin: 0;
`;

const LoginLink = styled.a`
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
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Step = styled.div<{ active?: boolean; completed?: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  background-color: ${props => 
    props.completed ? '#0B5471' : 
    props.active ? '#0B5471' : '#e0e0e0'
  };
  color: ${props => (props.active || props.completed) ? 'white' : '#666'};
`;

const StepLine = styled.div<{ completed?: boolean }>`
  width: 3rem;
  height: 2px;
  background-color: ${props => props.completed ? '#0B5471' : '#e0e0e0'};
`;

const PlanosContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PlanoCard = styled.div<{ selected: boolean }>`
  border: 2px solid ${props => props.selected ? '#0B5471' : '#e0e0e0'};
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.selected ? '#f8fafb' : 'white'};

  &:hover {
    border-color: #0B5471;
  }
`;

const PlanoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const PlanoNome = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #0B5471;
  margin: 0;
`;

const PlanoPreco = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
`;

const PlanoDescricao = styled.p`
  font-size: 0.875rem;
  color: #666;
  margin: 0.5rem 0;
`;

const PlanoBeneficios = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Beneficio = styled.li`
  font-size: 0.8rem;
  color: #555;
  margin: 0.25rem 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const BackButton = styled.button`
  background-color: #f5f5f5;
  color: #666;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;

  &:hover {
    background-color: #e0e0e0;
  }

`;
