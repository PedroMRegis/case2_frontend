import styled from 'styled-components';
import Header from '@/components/header';
import Footer from '@/components/footer';
import bannerImage from '@/assets/banner1.png';
import featureImg from '@/assets/feature.png';

const LandingPage = () => {
  return (
    <>
      <Header />

      <BannerSection id = "top">
        <BannerContent>
          <Text>
            <BannerTitle>
              Eleve sua carreira com inglês e<br />
              espanhol corporativo na LinguaLab.
            </BannerTitle>
            <BannerSubtitle>
              Metodologia prática para você se comunicar<br />
              com confiança no ambiente corporativo
            </BannerSubtitle>
            <BannerButton>Conheça nossos planos</BannerButton>
          </Text>
          <ImageWrapper>
            <BannerImage src={bannerImage} alt="Colaboradores usando laptop" />
          </ImageWrapper>
        </BannerContent>
      </BannerSection>
      <SolutionsSection id = "solutions">
        <SolutionsTitle>
          As soluções que conectam sua empresa ao mundo
        </SolutionsTitle>
        <CardsGrid>
          <Card>
            <CardTitle>Cursos de Inglês Corporativo</CardTitle>
            <CardText>
              Aulas online 100% focadas em vocabulário e práticas reais
              de negócios com apresentações, reuniões, relatórios e e‑mails
              profissionais.
            </CardText>
          </Card>
          <Card>
            <CardTitle>Cursos de Espanhol Corporativo</CardTitle>
            <CardText>
              Conteúdo personalizado para aprimorar sua comunicação oral
              e escrita em espanhol, com foco nas particularidades da Espanha
              e da América Latina, e estudos de caso reais do mercado hispânico.
            </CardText>
          </Card>
          <Card>
            <CardTitle>Aulas Online Individuais</CardTitle>
            <CardText>
              Personalização total do conteúdo e ritmo, feedback em tempo real
              para pronúncia e gramática, flexibilidade máxima de horários
              e relatórios de progresso focados nas suas metas profissionais.
            </CardText>
          </Card>
          <Card>
            <CardTitle>Aulas em Grupo</CardTitle>
            <CardText>
              Dinâmicas colaborativas com networking profissional,
              role‑plays e simulações de reuniões, negociações e apresentações,
              em um ambiente motivador e com custo‑benefício otimizado.
            </CardText>
          </Card>
        </CardsGrid>
      </SolutionsSection>
      <FeatureSection>
        <FeatureContent>
          <FeatureImage src={featureImg} alt="Profissional em reunião" />
          <FeatureText>
            <FeatureTitle>
              Você já tem os meios para impressionar em reuniões internacionais com fluência em inglês e espanhol?
            </FeatureTitle>
            <FeatureDescription>
              Nosso curso corporativo integra situações reais do seu dia a dia,
              preparando você para apresentar, negociar e liderar com confiança
              em qualquer idioma.
            </FeatureDescription>
            <FeatureButton>Conheça nossos planos</FeatureButton>
          </FeatureText>
        </FeatureContent>
      </FeatureSection>

      <PlansSection id = "plans">
        <SectionTitle>Conheça nossos planos</SectionTitle>
        <PlansGrid>
          <PlanCard>
            <PlanHeader>Assinatura Individual</PlanHeader>
            <PlanBody>
              <PlanList>
                <li>Aulas individuais</li>
                <li>Acesso a aulas gravadas</li>
                <li>Trilhas corporativas</li>
              </PlanList>
              <PlanButton>Assine já!</PlanButton>
            </PlanBody>
          </PlanCard>
          <PlanCard>
            <PlanHeader>Assinatura Em Grupo</PlanHeader>
            <PlanBody>
              <PlanList>
                <li>Aulas em grupo</li>
                <li>Acesso a aulas gravadas</li>
                <li>Trilhas corporativas</li>
                <li>Preços flexíveis</li>
                <li>Dinâmicas corporativas</li>
              </PlanList>
              <PlanButton>Assine já!</PlanButton>
            </PlanBody>
          </PlanCard>
        </PlansGrid>
      </PlansSection>

        <CTASection>
            <CTACard>
            <CTAContent>
                <CTATitle>Capacitar sua empresa nunca foi tão fácil</CTATitle>
                <CTASubtitle>
                Chegou a solução ideal para sua equipe multilíngue: aprenda com método e flexibilidade.
                </CTASubtitle>
                <CTAButton>Entre em contato!</CTAButton>
            </CTAContent>
            </CTACard>
        </CTASection>
        <Footer />
    </>
  );
};

export default LandingPage;


const BannerSection = styled.section`
  background-color: #0B5471;
  color: #ffffff;
  clip-path: ellipse(150% 90% at 50% 0);
  padding-bottom: 6rem;
`;

const BannerContent = styled.div`
  max-width: 1200px;
  margin:  auto 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 2rem;
  padding: 0 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    margin-top: 0;
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BannerTitle = styled.h1`
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 700;
`;

const BannerSubtitle = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
`;

const BannerButton = styled.button`
  background-color: #7699a8;
  color: #ffffff;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const BannerImage = styled.img`
  width: 100%;
  max-width: 400px;
  border-radius: 0.5rem;
`;

const SolutionsSection = styled.section`
  background: #ffffff;
  padding: 4rem 1rem;
`;

const SolutionsTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #f2f2f2;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const CardText = styled.p`
  font-size: 0.9375rem;
  line-height: 1.4;
`;
const FeatureSection = styled.section`
  background: #e5e5e5;
  padding: 4rem 1rem;
  border-radius: 1rem;
  max-width: 1200px;
  margin: 4rem auto;
`;

const FeatureContent = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FeatureImage = styled.img`
  width: 100%;
  max-width: 500px;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const FeatureText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const FeatureTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
`;

const FeatureButton = styled.button`
  background-color: #7699a8;
  color: #ffffff;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  align-self: center;
  transition: opacity 0.2s;


  &:hover {
    opacity: 0.85;
  }
`;

const PlansSection = styled.section`
  padding: 4rem 1rem;
  background: #ffffff;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    grid-template_COLUMNS: 1fr;
  }
`;

const PlanCard = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const PlanHeader = styled.div`
  background: #0B5471;
  color: #ffffff;
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 1.125rem;
`;

const PlanBody = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const PlanList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;

  li {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    &::before {
      content: '✔︎';
      color: #4CAF50;
      margin-right: 0.75rem;
    }
  }
`;

const PlanButton = styled.button`
  background-color: #7699a8;
  color: #ffffff;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  align-self: center;

  &:hover {
    opacity: 0.85;
  }
`;


const CTASection = styled.section`
  padding: 4rem 1rem;
`;

const CTACard = styled.div`
  background-color: #0B5471;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  padding: 2rem;
`;

const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const CTATitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
`;

const CTASubtitle = styled.p`
  font-size: 1.5rem;
  line-height: 1.6;
  color: #ffffff;
  text-align: center;
`;

const CTAButton = styled.button`
  background-color: #ffffff;
  color: #000000;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  align-self: center;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;
