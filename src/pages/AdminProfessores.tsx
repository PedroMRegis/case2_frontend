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

interface Professor {
  id: string;
  name: string;
  email: string;
  idioma: 'ingles' | 'espanhol';
  trilha: 'financeiro' | 'corporativo';
}

const AdminProfessores = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [filteredProfessores, setFilteredProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProfessores, setLoadingProfessores] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', idioma: 'ingles', trilha: 'financeiro' });
  const [searchTerm, setSearchTerm] = useState('');
  const [idiomaFilter, setIdiomaFilter] = useState('todos');
  const [trilhaFilter, setTrilhaFilter] = useState('todos');

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

  useEffect(() => {
    const fetchProfessores = async () => {
      setLoadingProfessores(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/professores', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.ok) {
          const data = await response.json();
          const professoresArray = Array.isArray(data) ? data : (data.professores || []);
          setProfessores(professoresArray);
          setFilteredProfessores(professoresArray);
        } else {
          console.error('Failed to fetch professores');
        }
      } catch (error) {
        console.error('Error fetching professores:', error);
      } finally {
        setLoadingProfessores(false);
      }
    };

    if (admin) {
      fetchProfessores();
    }
  }, [admin]);

  useEffect(() => {
    let filtered = professores;

    if (searchTerm) {
      filtered = filtered.filter(professor => 
        professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (idiomaFilter !== 'todos') {
      filtered = filtered.filter(professor => professor.idioma === idiomaFilter);
    }

    if (trilhaFilter !== 'todos') {
      filtered = filtered.filter(professor => professor.trilha === trilhaFilter);
    }

    setFilteredProfessores(filtered);
  }, [professores, searchTerm, idiomaFilter, trilhaFilter]);

  const handleAddProfessor = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/professores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newProfessor = await response.json();
        setProfessores(prev => [...prev, newProfessor]);
        setShowAddModal(false);
        setFormData({ name: '', email: '', password: '', idioma: 'ingles', trilha: 'financeiro' });
      } else {
        const errorData = await response.json();
        alert(`Erro ao adicionar professor: ${errorData.detail || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Error adding professor:', error);
      alert('Erro de conexão ao adicionar professor');
    }
  };

  const handleEditProfessor = async () => {
    if (!editingProfessor) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/professores/${editingProfessor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setProfessores(prev => prev.map(professor => 
          professor.id === editingProfessor.id 
            ? { ...professor, name: formData.name, email: formData.email, idioma: formData.idioma as 'ingles' | 'espanhol', trilha: formData.trilha as 'financeiro' | 'corporativo' }
            : professor
        ));
        setEditingProfessor(null);
        setFormData({ name: '', email: '', password: '', idioma: 'ingles', trilha: 'financeiro' });
      }
    } catch (error) {
      console.error('Error editing professor:', error);
    }
  };

  const handleDeleteProfessor = async (professorId: string) => {
    if (!confirm('Tem certeza que deseja apagar este professor?')) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/professores/${professorId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setProfessores(prev => prev.filter(professor => professor.id !== professorId));
      }
    } catch (error) {
      console.error('Error deleting professor:', error);
    }
  };

  const openAddModal = () => {
    setFormData({ name: '', email: '', password: '', idioma: 'ingles', trilha: 'financeiro' });
    setShowAddModal(true);
  };

  const openEditModal = (professor: Professor) => {
    setFormData({ name: professor.name, email: professor.email, password: '', idioma: professor.idioma, trilha: professor.trilha });
    setEditingProfessor(professor);
  };

  if (loading) return <LoadingContainer>Carregando...</LoadingContainer>;
  if (!admin) return <ErrorContainer>Admin não encontrado. Faça login novamente.</ErrorContainer>;

  return (
    <PageContainer>
      <LoggedHeader userName={admin.name} />
      
      <ContentSection>
        <BackButton onClick={() => navigate('/admin')}>
          ← Voltar
        </BackButton>
        
        <Header>
          <TitleSection>
            <SectionTitle>Gerenciar Professores</SectionTitle>
            <ProfessoresCount>{filteredProfessores.length} professor(es)</ProfessoresCount>
          </TitleSection>
          <AddButton onClick={openAddModal}>
            <AddIcon>+</AddIcon>
            Adicionar Professor
          </AddButton>
        </Header>

        <FiltersSection>
          <SearchInput
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <FilterSelect
            value={idiomaFilter}
            onChange={(e) => setIdiomaFilter(e.target.value)}
          >
            <option value="todos">Todos os idiomas</option>
            <option value="ingles">Inglês</option>
            <option value="espanhol">Espanhol</option>
          </FilterSelect>

          <FilterSelect
            value={trilhaFilter}
            onChange={(e) => setTrilhaFilter(e.target.value)}
          >
            <option value="todos">Todas as trilhas</option>
            <option value="financeiro">Financeiro</option>
            <option value="corporativo">Corporativo</option>
          </FilterSelect>
        </FiltersSection>

        {loadingProfessores ? (
          <LoadingSection>
            <LoadingSpinner />
            <LoadingText>Carregando professores...</LoadingText>
          </LoadingSection>
        ) : filteredProfessores.length === 0 ? (
          <EmptyState>
            <EmptyIcon>👨‍🏫</EmptyIcon>
            <EmptyTitle>Nenhum professor encontrado</EmptyTitle>
            <EmptyDescription>
              {searchTerm || idiomaFilter !== 'todos' || trilhaFilter !== 'todos'
                ? 'Tente ajustar os filtros de busca' 
                : 'Adicione o primeiro professor ao sistema'}
            </EmptyDescription>
          </EmptyState>
        ) : (
          <ProfessoresGrid>
            {filteredProfessores.map((professor) => (
              <ProfessorCard key={professor.id}>
                <CardHeader>
                  <Avatar>{professor.name.charAt(0).toUpperCase()}</Avatar>
                  <BadgesContainer>
                    <IdiomaBadge idioma={professor.idioma}>
                      {professor.idioma === 'ingles' ? 'Inglês' : 'Espanhol'}
                    </IdiomaBadge>
                    <TrilhaBadge trilha={professor.trilha}>
                      {professor.trilha === 'financeiro' ? 'Financeiro' : 'Corporativo'}
                    </TrilhaBadge>
                  </BadgesContainer>
                </CardHeader>
                
                <CardContent>
                  <ProfessorName>{professor.name}</ProfessorName>
                  <ProfessorEmail>{professor.email}</ProfessorEmail>
                </CardContent>
                
                <CardActions>
                  <EditButton onClick={() => openEditModal(professor)}>
                    ✏️ Editar
                  </EditButton>
                  <DeleteButton onClick={() => handleDeleteProfessor(professor.id)}>
                    🗑️ Excluir
                  </DeleteButton>
                </CardActions>
              </ProfessorCard>
            ))}
          </ProfessoresGrid>
        )}
      </ContentSection>

      {(showAddModal || editingProfessor) && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{editingProfessor ? '✏️ Editar Professor' : '➕ Adicionar Professor'}</ModalTitle>
              <CloseButton onClick={() => {
                setShowAddModal(false);
                setEditingProfessor(null);
              }}>×</CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <form onSubmit={(e) => {
                e.preventDefault();
                editingProfessor ? handleEditProfessor() : handleAddProfessor();
              }}>
                <InputGroup>
                  <Label>Nome completo</Label>
                  <Input
                    type="text"
                    placeholder="Digite o nome do professor"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </InputGroup>
                
                <InputGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="professor@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </InputGroup>
                
                {!editingProfessor && (
                  <InputGroup>
                    <Label>Senha inicial</Label>
                    <Input
                      type="password"
                      placeholder="Digite uma senha"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </InputGroup>
                )}
                
                <InputGroup>
                  <Label>Idioma</Label>
                  <Select
                    value={formData.idioma}
                    onChange={(e) => setFormData({ ...formData, idioma: e.target.value })}
                    required
                  >
                    <option value="ingles">Inglês</option>
                    <option value="espanhol">Espanhol</option>
                  </Select>
                </InputGroup>

                <InputGroup>
                  <Label>Trilha</Label>
                  <Select
                    value={formData.trilha}
                    onChange={(e) => setFormData({ ...formData, trilha: e.target.value })}
                    required
                  >
                    <option value="financeiro">Financeiro</option>
                    <option value="corporativo">Corporativo</option>
                  </Select>
                </InputGroup>
              </form>
            </ModalBody>
            
            <ModalFooter>
              <CancelButton onClick={() => {
                setShowAddModal(false);
                setEditingProfessor(null);
              }}>
                Cancelar
              </CancelButton>
              <SaveButton onClick={editingProfessor ? handleEditProfessor : handleAddProfessor}>
                {editingProfessor ? 'Salvar Alterações' : 'Adicionar Professor'}
              </SaveButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      
      <LoggedFooter />
    </PageContainer>
  );
};

export default AdminProfessores;

// Reuse styles from AdminAlunos with some modifications
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
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
  max-width: 1400px;
  margin: 0 auto;
  flex: 1;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 1.5rem; 
  left: 0;
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;

  &:hover {
    background: #f8f9fa;
    color: #0B5471;
    border-color: #0B5471;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 4rem;
  margin-top: 3rem;
  gap: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 2rem;
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionTitle = styled.h1`
  color: #0B5471;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
`;

const ProfessoresCount = styled.span`
  color: #666;
  font-size: 1.1rem;
  font-weight: 500;
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #0B5471 0%, #7699a8 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(11, 84, 113, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(11, 84, 113, 0.4);
  }
`;

const AddIcon = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
`;

const FiltersSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 2;
  padding: 1rem 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #0B5471;
    box-shadow: 0 0 0 3px rgba(11, 84, 113, 0.1);
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const FilterSelect = styled.select`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #0B5471;
    box-shadow: 0 0 0 3px rgba(11, 84, 113, 0.1);
  }
`;

const LoadingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #e9ecef;
  border-top: 4px solid #0B5471;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin: 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
`;

const EmptyTitle = styled.h3`
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const EmptyDescription = styled.p`
  color: #666;
  font-size: 1rem;
  margin: 0;
  max-width: 400px;
`;

const ProfessoresGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
`;

const ProfessorCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: #0B5471;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0B5471 0%, #7699a8 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
`;

const BadgesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
`;

const IdiomaBadge = styled.span<{ idioma: string }>`
  background: ${props => props.idioma === 'ingles' ? '#e3f2fd' : '#fff3e0'};
  color: ${props => props.idioma === 'ingles' ? '#1976d2' : '#f57c00'};
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TrilhaBadge = styled.span<{ trilha: string }>`
  background: ${props => props.trilha === 'financeiro' ? '#f3e5f5' : '#e8f5e8'};
  color: ${props => props.trilha === 'financeiro' ? '#7b1fa2' : '#2e7d32'};
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardContent = styled.div`
  margin-bottom: 1.5rem;
`;

const ProfessorName = styled.h3`
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const ProfessorEmail = styled.p`
  color: #666;
  font-size: 0.95rem;
  margin: 0;
  word-break: break-word;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const EditButton = styled.button`
  flex: 1;
  background: #0B5471;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #094059;
    transform: translateY(-1px);
  }
`;

const DeleteButton = styled.button`
  flex: 1;
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #c82333;
    transform: translateY(-1px);
  }
`;

// Modal styles (same as AdminAlunos)
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 2px solid #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #0B5471;
  font-size: 1.5rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #adb5bd;
  transition: color 0.2s ease;
  
  &:hover {
    color: #495057;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #0B5471;
    box-shadow: 0 0 0 3px rgba(11, 84, 113, 0.1);
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #0B5471;
    box-shadow: 0 0 0 3px rgba(11, 84, 113, 0.1);
  }
`;

const ModalFooter = styled.div`
  padding: 1rem 2rem 2rem 2rem;
  border-top: 2px solid #f8f9fa;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #5a6268;
    transform: translateY(-1px);
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #0B5471 0%, #7699a8 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(11, 84, 113, 0.4);
  }
`;
