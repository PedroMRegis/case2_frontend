import { useState, useEffect } from 'react';
import styled from 'styled-components';
import bannerAluno from '@/assets/banner_aluno.png';
import LoggedHeader from '@/components/LoggedHeader';
import Footer from '@/components/LoggedFooter';

interface Aluno {
  id: string;
  name: string;
  email: string;
}

interface Aula {
  id: string;
  date: string;
  professor_id: string;
  professor_name: string;
  aluno_id: string;
  aluno_name: string;
  status: string;
}

interface Professor {
  id: string;
  name: string;
  email: string;
  idioma: string;
  trilha: string;
}

const Alunos = () => {
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAulas, setLoadingAulas] = useState(false);
  const [editingAula, setEditingAula] = useState<Aula | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedIdioma, setSelectedIdioma] = useState('');
  const [selectedTrilha, setSelectedTrilha] = useState('');
  const [availableProfessors, setAvailableProfessors] = useState<Professor[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');

  useEffect(() => {
    console.log('Checking localStorage for alunoData...');
    const alunoDataString = localStorage.getItem('alunoData');
    console.log('alunoDataString:', alunoDataString);

    if (alunoDataString) {
      try {
        const alunoData = JSON.parse(alunoDataString);
        console.log('Parsed alunoData:', alunoData);
        setAluno(alunoData);
      } catch (error) {
        console.error('Error parsing alunoData:', error);
      }
    } else {
      console.log('No alunoData found in localStorage');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchAulas = async () => {
      setLoadingAulas(true);
      try {

        const response = await fetch('http://127.0.0.1:8000/aluno/aulas', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setAulas(data.aulas || []);
        } else {
          console.error('Failed to fetch aulas');
        }
      } catch (error) {
        console.error('Error fetching aulas:', error);
      } finally {
        setLoadingAulas(false);
      }
    };

    if (aluno) fetchAulas();
  }, [aluno]);

  const fetchProfessors = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/professores', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();

        let filteredProfessors = data.professores || [];
        if (selectedIdioma) {
          filteredProfessors = filteredProfessors.filter((prof: Professor) => prof.idioma === selectedIdioma);
        }
        if (selectedTrilha) {
          filteredProfessors = filteredProfessors.filter((prof: Professor) => prof.trilha === selectedTrilha);
        }
        setAvailableProfessors(filteredProfessors);
      }
    } catch (error) {
      console.error('Error fetching professors:', error);
    }
  };

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
        const updatedAula = await response.json();
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

  const handleScheduleAula = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/aulas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          date: scheduleDate,
          professor_id: selectedProfessor
        }),
      });

      if (response.ok) {
        const newAula = await response.json();
        
        const selectedProfessorObj = availableProfessors.find(prof => prof.id === selectedProfessor);
        
        
        const aulaWithNames = {
          ...newAula,
          professor_name: selectedProfessorObj?.name || 'Professor não encontrado',
          aluno_name: aluno?.name || 'Aluno não encontrado'
        };
        
        setAulas(prevAulas => [...prevAulas, aulaWithNames]);
        setShowScheduleModal(false);
        setSelectedIdioma('');
        setSelectedTrilha('');
        setSelectedProfessor('');
        setScheduleDate('');
        setAvailableProfessors([]);
        console.log('Aula agendada com sucesso');
      } else {
        console.error('Erro ao agendar aula');
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

  const openScheduleModal = () => {
    setShowScheduleModal(true);
  };

  if (loading) return <LoadingContainer>Carregando...</LoadingContainer>;
  if (!aluno) return <ErrorContainer>Aluno não encontrado. Faça login novamente.</ErrorContainer>;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <PageContainer>
      <LoggedHeader userName={aluno.name} />
      <BannerSection>
        <ContentWrapper>
          <GreetingText>Bem vindo, {aluno.name}!</GreetingText>
          <ActionButton onClick={openScheduleModal}>Agende sua aula agora!</ActionButton>
        </ContentWrapper>
      </BannerSection>
      <ContentSection>
        <SectionTitle>Suas Aulas</SectionTitle>
        {loadingAulas ? (
          <LoadingMessage>Carregando aulas...</LoadingMessage>
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
                        {aula.aluno_name || aula.aluno_id || 'Nome não disponível'}
                      </ParticipantName>
                    </ParticipantInfo>
                    <ParticipantInfo>
                      <ParticipantLabel>Professor</ParticipantLabel>
                      <ParticipantName>
                        {aula.professor_name || aula.professor_id || 'Nome não disponível'}
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
      <Footer />
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
      {showScheduleModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3>Agendar Nova Aula</h3>
              <CloseButton onClick={() => setShowScheduleModal(false)}>×</CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <InputGroup>
                <label>Idioma:</label>
                <select
                  value={selectedIdioma}
                  onChange={(e) => {
                    setSelectedIdioma(e.target.value);
                    setSelectedProfessor(''); 
                    setAvailableProfessors([]); 
                  }}
                >
                  <option value="">Selecione um idioma</option>
                  <option value="ingles">Inglês</option>
                  <option value="espanhol">Espanhol</option>
                </select>
              </InputGroup>

              <InputGroup>
                <label>Trilha:</label>
                <select
                  value={selectedTrilha}
                  onChange={(e) => {
                    setSelectedTrilha(e.target.value);
                    setSelectedProfessor(''); 
                    setAvailableProfessors([]); 
                  }}
                >
                  <option value="">Selecione uma trilha</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="corporativo">Corporativo</option>
                </select>
              </InputGroup>

              {(selectedIdioma || selectedTrilha) && (
                <InputGroup>
                  <label>Professor:</label>
                  <select
                    value={selectedProfessor}
                    onChange={(e) => setSelectedProfessor(e.target.value)}
                    onFocus={fetchProfessors}
                  >
                    <option value="">Selecione um professor</option>
                    {availableProfessors.map((professor) => (
                      <option key={professor.id} value={professor.id}>
                        {professor.name} - {professor.trilha} ({professor.idioma})
                      </option>
                    ))}
                  </select>
                </InputGroup>
              )}

              {selectedProfessor && (
                <InputGroup>
                  <label>Data e Horário:</label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </InputGroup>
              )}
            </ModalBody>
            
            <ModalFooter>
              <CancelButton onClick={() => setShowScheduleModal(false)}>
                Cancelar
              </CancelButton>
              <SaveButton 
                onClick={handleScheduleAula}
                disabled={!selectedProfessor || !scheduleDate}
              >
                Agendar Aula
              </SaveButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default Alunos;


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
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ActionButton = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
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
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
`;

const AulaCard = styled.div`
  background: white;
  border-radius: 1.25rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid #f0f0f0;
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
  margin-left: 1rem;
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
