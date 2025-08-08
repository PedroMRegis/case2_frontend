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

const AdminAdmins = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [searchTerm, setSearchTerm] = useState('');

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
    const fetchAdmins = async () => {
      setLoadingAdmins(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/admins', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.ok) {
          const data = await response.json();
          const adminsArray = Array.isArray(data) ? data : (data.admins || []);
          setAdmins(adminsArray);
          setFilteredAdmins(adminsArray);
        } else {
          console.error('Failed to fetch admins');
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
      } finally {
        setLoadingAdmins(false);
      }
    };

    if (admin) {
      fetchAdmins();
    }
  }, [admin]);

  useEffect(() => {
    let filtered = admins;

    if (searchTerm) {
      filtered = filtered.filter(adminItem => 
        adminItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adminItem.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAdmins(filtered);
  }, [admins, searchTerm]);

  const handleAddAdmin = async () => {
    try {
      console.log('Sending POST request to create admin...');
      const response = await fetch('http://127.0.0.1:8000/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        redirect: 'manual',
      });

      console.log('Response status:', response.status);

      if (response.status >= 300 && response.status < 400) {
        console.log('Server is trying to redirect!');
        return;
      }

      if (response.ok) {
        const responseData = await response.json();
        console.log('Response data:', responseData);
        
        
        if (Array.isArray(responseData) && responseData.length > 0) {
          setAdmins(responseData);
          setShowAddModal(false);
          setFormData({ name: '', email: '', password: '' });
          console.log('Admin added successfully, staying on page');
        } else {
          console.error('Invalid admin data structure:', responseData);
        }
      } else {
        const errorData = await response.json();
        alert(`Erro ao adicionar administrador: ${errorData.detail || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Erro de conexão ao adicionar administrador');
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (adminId === admin?.id) {
      alert('Você não pode apagar sua própria conta de administrador!');
      return;
    }

    if (!confirm('Tem certeza que deseja apagar este administrador?')) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/admins/id/${adminId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setAdmins(prev => prev.filter(adminItem => adminItem.id !== adminId));
        alert('Administrador deletado com sucesso!');
      } else if (response.status === 401) {
        alert('Não autorizado. Faça login novamente.');
      } else if (response.status === 404) {
        alert('Administrador não encontrado.');
      } else {
        const errorData = await response.json();
        alert(`Erro ao deletar administrador: ${errorData.detail || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Erro de conexão ao deletar administrador');
    }
  };

  const openAddModal = () => {
    setFormData({ name: '', email: '', password: '' });
    setShowAddModal(true);
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
            <SectionTitle>Gerenciar Administradores</SectionTitle>
            <AdminsCount>{filteredAdmins.length} administrador(es)</AdminsCount>
          </TitleSection>
          <AddButton onClick={openAddModal}>
            <AddIcon>+</AddIcon>
            Adicionar Administrador
          </AddButton>
        </Header>

        <FiltersSection>
          <SearchInput
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FiltersSection>

        {loadingAdmins ? (
          <LoadingSection>
            <LoadingSpinner />
            <LoadingText>Carregando administradores...</LoadingText>
          </LoadingSection>
        ) : filteredAdmins.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🔐</EmptyIcon>
            <EmptyTitle>Nenhum administrador encontrado</EmptyTitle>
            <EmptyDescription>
              {searchTerm 
                ? 'Tente ajustar os filtros de busca' 
                : 'Adicione o primeiro administrador ao sistema'}
            </EmptyDescription>
          </EmptyState>
        ) : (
          <AdminsGrid>
            {filteredAdmins.map((adminItem) => (
              <AdminCard key={adminItem.id}>
                <CardHeader>
                  <Avatar>
                    {adminItem.name && adminItem.name.length > 0 
                      ? adminItem.name.charAt(0).toUpperCase() 
                      : '?'}
                  </Avatar>
                  <AdminBadge>
                    {adminItem.id === admin?.id ? 'Você' : 'Admin'}
                  </AdminBadge>
                </CardHeader>
                
                <CardContent>
                  <AdminName>{adminItem.name || 'Nome não disponível'}</AdminName>
                  <AdminEmail>{adminItem.email || 'Email não disponível'}</AdminEmail>
                </CardContent>
                
                <CardActions>
                  <DeleteButton 
                    onClick={() => handleDeleteAdmin(adminItem.id)}
                    disabled={adminItem.id === admin?.id}
                  >
                    🗑️ Excluir
                  </DeleteButton>
                </CardActions>
              </AdminCard>
            ))}
          </AdminsGrid>
        )}
      </ContentSection>

      {showAddModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>➕ Adicionar Administrador</ModalTitle>
              <CloseButton onClick={() => setShowAddModal(false)}>×</CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAddAdmin();
              }}>
                <InputGroup>
                  <Label>Nome completo</Label>
                  <Input
                    type="text"
                    placeholder="Digite o nome do administrador"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </InputGroup>
                
                <InputGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="admin@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </InputGroup>
                
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
              </form>
            </ModalBody>
            
            <ModalFooter>
              <CancelButton onClick={() => setShowAddModal(false)}>
                Cancelar
              </CancelButton>
              <SaveButton onClick={handleAddAdmin}>
                Adicionar Administrador
              </SaveButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      
      <LoggedFooter />
    </PageContainer>
  );
};

export default AdminAdmins;


const AdminBadge = styled.span`
  background: #f3e5f5;
  color: #7b1fa2;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AdminsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
`;

const AdminCard = styled.div`
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

const AdminName = styled.h3`
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const AdminEmail = styled.p`
  color: #666;
  font-size: 0.95rem;
  margin: 0;
  word-break: break-word;
`;

const AdminsCount = styled.span`
  color: #666;
  font-size: 1.1rem;
  font-weight: 500;
`;

// Reuse other styles from AdminAlunos/AdminProfessores...
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

const CardContent = styled.div`
  margin-bottom: 1.5rem;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
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
  
  &:hover:not(:disabled) {
    background: #c82333;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

// Modal styles
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

