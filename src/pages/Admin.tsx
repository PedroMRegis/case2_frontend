import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LoggedHeader from '@/components/LoggedHeader';
import LoggedFooter from '@/components/LoggedFooter';

interface Admin {
  id: string;
  name: string;
  email: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminDataString = localStorage.getItem('adminData');
    if (adminDataString) {
      try {
        const adminData = JSON.parse(adminDataString);
        setAdmin(adminData);
      } catch (error) {
        console.error('Error parsing adminData:', error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) return <LoadingContainer>Carregando...</LoadingContainer>;
  if (!admin) return <ErrorContainer>Admin não encontrado. Faça login novamente.</ErrorContainer>;

  return (
    <PageContainer>
      <LoggedHeader userName={admin.name} />
      
      <ContentSection>
        <SectionTitle>Painel Administrativo</SectionTitle>
        <GreetingText>Bem-vindo, {admin.name}!</GreetingText>
        
        <CardsGrid>
          <ActionCard onClick={() => navigate('/admin/alunos')}>
            <CardIcon>👥</CardIcon>
            <CardTitle>Gerenciar Alunos</CardTitle>
            <CardDescription>
              Visualizar, editar, adicionar ou remover alunos do sistema
            </CardDescription>
          </ActionCard>

          <ActionCard onClick={() => navigate('/admin/professores')}>
            <CardIcon>👨‍🏫</CardIcon>
            <CardTitle>Gerenciar Professores</CardTitle>
            <CardDescription>
              Visualizar, editar, adicionar ou remover professores do sistema
            </CardDescription>
          </ActionCard>

          <ActionCard onClick={() => navigate('/admin/admins')}>
            <CardIcon>🔐</CardIcon>
            <CardTitle>Gerenciar Administradores</CardTitle>
            <CardDescription>
              Criar novos administradores
            </CardDescription>
          </ActionCard>
        </CardsGrid>
      </ContentSection>
      
      <LoggedFooter />
    </PageContainer>
  );
};

export default Admin;

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #e53e3e;
`;

const ContentSection = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  flex: 1;
`;

const SectionTitle = styled.h1`
  color: #0B5471;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
`;

const GreetingText = styled.p`
  color: #666;
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 3rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ActionCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border-color: #0B5471;
  }
`;

const CardIcon = styled.div`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  color: #0B5471;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
`;

const CardDescription = styled.p`
  color: #666;
  font-size: 1rem;
  text-align: center;
  line-height: 1.5;
  margin: 0;
`;
