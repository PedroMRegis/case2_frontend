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

interface Aluno {
  id: string;
  name: string;
  email: string;
  plano: 'individual' | 'em_grupo';
}

const AdminAlunos = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', plano: 'individual' });
  const [searchTerm, setSearchTerm] = useState('');
  const [planoFilter, setPlanoFilter] = useState('todos');

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
    const fetchAlunos = async () => {
      setLoadingAlunos(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/alunos', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.ok) {
          const data = await response.json();
          const alunosArray = Array.isArray(data) ? data : (data.alunos || []);
          setAlunos(alunosArray);
          setFilteredAlunos(alunosArray);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch alunos, status:', response.status);
          console.error('Error response:', errorText);
        }
      } catch (error) {
        console.error('Error fetching alunos:', error);
      } finally {
        setLoadingAlunos(false);
      }
    };

    if (admin) {
      fetchAlunos();
    }
  }, [admin]);


  useEffect(() => {
    let filtered = alunos;

    if (searchTerm) {
      filtered = filtered.filter(aluno => 
        aluno.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aluno.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (planoFilter !== 'todos') {
      filtered = filtered.filter(aluno => aluno.plano === planoFilter);
    }

    setFilteredAlunos(filtered);
  }, [alunos, searchTerm, planoFilter]);

  const handleAddAluno = async () => {
    try {
      console.log('Adding aluno with data:', formData);
      
      const response = await fetch('http://127.0.0.1:8000/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      console.log('Add response status:', response.status);

      if (response.ok) {
        const newAluno = await response.json();
        console.log('New aluno created:', newAluno);
        setAlunos(prev => [...prev, newAluno]);
        setShowAddModal(false);
        setFormData({ name: '', email: '', password: '', plano: 'individual' });
      } else {
        const errorData = await response.json();
        console.error('Add aluno error:', errorData);
        alert(`Erro ao adicionar aluno: ${errorData.detail || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Error adding aluno:', error);
      alert('Erro de conexão ao adicionar aluno');
    }
  };

  const handleEditAluno = async () => {
    if (!editingAluno) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/alunos/${editingAluno.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setAlunos(prev => prev.map(aluno => 
          aluno.id === editingAluno.id 
            ? { ...aluno, name: formData.name, email: formData.email, plano: formData.plano as 'individual' | 'em_grupo' }
            : aluno
        ));
        setEditingAluno(null);
        setFormData({ name: '', email: '', password: '', plano: 'individual' });
      }
    } catch (error) {
      console.error('Error editing aluno:', error);
    }
  };

  const handleDeleteAluno = async (alunoId: string) => {
    if (!confirm('Tem certeza que deseja apagar este aluno?')) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/alunos/${alunoId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setAlunos(prev => prev.filter(aluno => aluno.id !== alunoId));
      }
    } catch (error) {
      console.error('Error deleting aluno:', error);
    }
  };

  const openAddModal = () => {
    setFormData({ name: '', email: '', password: '', plano: 'individual' });
    setShowAddModal(true);
  };

  const openEditModal = (aluno: Aluno) => {
    setFormData({ name: aluno.name, email: aluno.email, password: '', plano: aluno.plano });
    setEditingAluno(aluno);
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
            <SectionTitle>Gerenciar Alunos</SectionTitle>
            <AlunosCount>{filteredAlunos.length} aluno(s)</AlunosCount>
          </TitleSection>
          <AddButton onClick={openAddModal}>
            <AddIcon>+</AddIcon>
            Adicionar Aluno
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
            value={planoFilter}
            onChange={(e) => setPlanoFilter(e.target.value)}
          >
            <option value="todos">Todos os planos</option>
            <option value="individual">Individual</option>
            <option value="em_grupo">Em Grupo</option>
          </FilterSelect>
        </FiltersSection>

        {loadingAlunos ? (
          <LoadingSection>
            <LoadingSpinner />
            <LoadingText>Carregando alunos...</LoadingText>
          </LoadingSection>
        ) : filteredAlunos.length === 0 ? (
          <EmptyState>
            <EmptyIcon>👥</EmptyIcon>
            <EmptyTitle>Nenhum aluno encontrado</EmptyTitle>
            <EmptyDescription>
              {searchTerm || planoFilter !== 'todos' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Adicione o primeiro aluno ao sistema'}
            </EmptyDescription>
          </EmptyState>
        ) : (
          <AlunosGrid>
            {filteredAlunos.map((aluno) => (
              <AlunoCard key={aluno.id}>
                <CardHeader>
                  <Avatar>{aluno.name.charAt(0).toUpperCase()}</Avatar>
                  <PlanoBadge plano={aluno.plano}>
                    {aluno.plano === 'individual' ? 'Individual' : 'Em Grupo'}
                  </PlanoBadge>
                </CardHeader>
                
                <CardContent>
                  <AlunoName>{aluno.name}</AlunoName>
                  <AlunoEmail>{aluno.email}</AlunoEmail>
                </CardContent>
                
                <CardActions>
                  <EditButton onClick={() => openEditModal(aluno)}>
                    ✏️ Editar
                  </EditButton>
                  <DeleteButton onClick={() => handleDeleteAluno(aluno.id)}>
                    🗑️ Excluir
                  </DeleteButton>
                </CardActions>
              </AlunoCard>
            ))}
          </AlunosGrid>
        )}
      </ContentSection>
      
      <LoggedFooter />
    </PageContainer>
  );
};

export default AdminAlunos;

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
    margin-bottom: 2rem;

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

const AlunosCount = styled.span`
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
  flex: 1;
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

const AlunosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
`;

const AlunoCard = styled.div`
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
  align-items: center;
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

const PlanoBadge = styled.span<{ plano: string }>`
  background: ${props => props.plano === 'individual' ? '#e3f2fd' : '#fff3e0'};
  color: ${props => props.plano === 'individual' ? '#1976d2' : '#f57c00'};
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardContent = styled.div`
  margin-bottom: 1.5rem;
`;

const AlunoName = styled.h3`
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const AlunoEmail = styled.p`
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


