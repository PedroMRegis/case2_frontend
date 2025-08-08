import { useState, useEffect } from 'react';
import styled from 'styled-components';
import bannerAluno from '@/assets/banner_aluno.png';
import LoggedHeader from '@/components/LoggedHeader';
import LoggedFooter from '@/components/LoggedFooter';

interface Professor {
  id: string;
  name: string;
  email: string;
  idioma: string;
  trilha: string;
}

interface Aula {
  id: string;
  date: string;
  professor_id: string;
  professor_name: string;
  aluno_id: string;
  aluno_name: string;
  aluno_email: string;
  status: string;
}

interface Aluno {
  id: string;
  name: string;
  email: string;
}

const Professores = () => {
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAulas, setLoadingAulas] = useState(false);
  const [error, setError] = useState('');
  const [editingAula, setEditingAula] = useState<Aula | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    console.log('Checking localStorage for professorData...');
    const professorDataString = localStorage.getItem('professorData');
    console.log('professorDataString:', professorDataString);

    if (professorDataString) {
      try {
        const professorData = JSON.parse(professorDataString);
        console.log('Parsed professorData:', professorData);
        setProfessor(professorData);
      } catch (error) {
        console.error('Error parsing professorData:', error);
      }
    } else {
      console.log('No professorData found in localStorage');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingAulas(true);
      try {
        const aulasRes = await fetch('http://127.0.0.1:8000/professores/aulas', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (aulasRes.ok) {
          const aulasData = await aulasRes.json();
          console.log('Aulas data:', aulasData);
          
          
          const aulas = aulasData.aulas || [];
          setAulas(Array.isArray(aulas) ? aulas : []);
        } else {
          console.error('Failed to fetch aulas, status:', aulasRes.status);
          setError('Não foi possível carregar as aulas. Verifique sua conexão.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Erro ao carregar dados');
      } finally {
        setLoadingAulas(false);
      }
    };

    if (professor) {
      fetchData();
    }
  }, [professor]);

  if (loading) return <LoadingContainer>Carregando...</LoadingContainer>;
  if (!professor) return <ErrorContainer>Professor não encontrado. Faça login novamente.</ErrorContainer>;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleEditAula = async (aulaId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/aulas/${aulaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          date: editDate,
          status: editStatus
        }),
      });

      if (response.ok) {
        setAulas(prevAulas => 
          prevAulas.map(aula => 
            aula.id === aulaId ? { ...aula, date: editDate, status: editStatus } : aula
          )
        );
        setEditingAula(null);
        console.log('Aula atualizada com sucesso');
      } else {
        console.error('Erro ao atualizar aula');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const handleDeleteAula = async (aulaId: string) => {
    if (!confirm('Tem certeza que deseja apagar esta aula?')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/aulas/${aulaId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setAulas(prevAulas => prevAulas.filter(aula => aula.id !== aulaId));
        console.log('Aula deletada com sucesso');
      } else {
        console.error('Erro ao deletar aula');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const openEditModal = (aula: Aula) => {
    setEditingAula(aula);
    setEditDate(aula.date);
    setEditStatus(aula.status);
  };

  return (
    <PageContainer>
      <LoggedHeader userName={professor.name} />
      <BannerSection>
        <ContentWrapper>
          <GreetingText>Bem vindo, Professor {professor.name}!</GreetingText>
          <ProfessorInfo>
            <InfoItem>📚 {professor.idioma} - {professor.trilha}</InfoItem>
            <InfoItem>📧 {professor.email}</InfoItem>
          </ProfessorInfo>
        </ContentWrapper>
      </BannerSection>
      
      <ContentSection>
        <SectionTitle>Suas Aulas</SectionTitle>
        
        {loadingAulas ? (
          <LoadingMessage>Carregando aulas...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : aulas.length === 0 ? (
          <EmptyMessage>Você ainda não tem aulas agendadas.</EmptyMessage>
        ) : (
          <AulasGrid>
            {aulas.map((aula) => (
              <AulaCard key={aula.id}>
                <CardTop>
                  <StatusBadge status={aula.status}>
                    {aula.status.charAt(0).toUpperCase() + aula.status.slice(1)}
                  </StatusBadge>
                  <DateChip>{formatDate(aula.date)}</DateChip>
                </CardTop>
                <CardContent>
                  <ParticipantsSection>
                    <ParticipantInfo>
                      <ParticipantLabel>Aluno</ParticipantLabel>
                      <ParticipantName>
                        {aula.aluno_name || 'Nome não disponível'}
                      </ParticipantName>
                      <ParticipantEmail>
                        📧 {aula.aluno_email || 'Email não disponível'}
                      </ParticipantEmail>
                    </ParticipantInfo>
                    <ParticipantInfo>
                      <ParticipantLabel>Professor</ParticipantLabel>
                      <ParticipantName>
                        {aula.professor_name || professor.name}
                      </ParticipantName>
                    </ParticipantInfo>
                  </ParticipantsSection>
                  <CardActions>
                    <EditButton onClick={() => openEditModal(aula)}>
                      Editar
                    </EditButton>
                    <DeleteButton onClick={() => handleDeleteAula(aula.id)}>
                      Apagar
                    </DeleteButton>
                  </CardActions>
                </CardContent>
              </AulaCard>
            ))}
          </AulasGrid>
        )}
      </ContentSection>
      
      <LoggedFooter />

      {editingAula && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3>Editar Aula</h3>
              <CloseButton onClick={() => setEditingAula(null)}>×</CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <InputGroup>
                <label>Data e Horário:</label>
                <input
                  type="datetime-local"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </InputGroup>
              
              <InputGroup>
                <label>Status:</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="agendada">Agendada</option>
                  <option value="concluida">Concluída</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </InputGroup>
            </ModalBody>
            
            <ModalFooter>
              <CancelButton onClick={() => setEditingAula(null)}>
                Cancelar
              </CancelButton>
              <SaveButton onClick={() => handleEditAula(editingAula.id)}>
                Salvar
              </SaveButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default Professores;

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
`;

const BannerSection = styled.div`
  background-image: url(${bannerAluno});
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(11, 84, 113, 0.7);
  }
`;

const ContentWrapper = styled.div`
  padding: 4rem 2rem;
  position: relative;
  z-index: 2;
`;

const GreetingText = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ProfessorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 500;
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
`;

const SectionTitle = styled.h2`
  color: #0B5471;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.1rem;
  color: #e53e3e;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #fde8e8;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.1rem;
  color: #666;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const AulasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const AulaCard = styled.div`
  background: white;
  border-radius: 1.25rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  width: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  }
`;

const CardTop = styled.div`
  background: linear-gradient(135deg, #0B5471 0%, #7699a8 100%);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  background-color: rgba(255, 255, 255, 0.9);
  color: ${props => {
    switch (props.status) {
      case 'agendada': return '#3498db';
      case 'concluida': return '#27ae60';
      case 'cancelada': return '#e74c3c';
      default: return '#95a5a6';
    }
  }};
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DateChip = styled.div`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
`;

const CardContent = styled.div`
  padding: 2rem 1.5rem;
`;

const ParticipantsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ParticipantInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ParticipantLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #7699a8;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ParticipantName = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const ParticipantEmail = styled.span`
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const EditButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  color: #0B5471;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: white;
    transform: translateY(-1px);
  }
`;

const DeleteButton = styled.button`
  background: rgba(231, 76, 60, 0.9);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(231, 76, 60, 1);
    transform: translateY(-1px);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    color: #0B5471;
    font-size: 1.25rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
  }
  
  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #0B5471;
    }
  }
`;

const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled.button`
  background: #f5f5f5;
  color: #666;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const SaveButton = styled.button`
  background: #0B5471;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: #094059;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;