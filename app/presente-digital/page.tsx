import type { Metadata } from "next";
import Link from "next/link";
import {
  Callout,
  Checklist,
  ContentSection,
  DigitalGiftMockup,
  FaqSection,
  FinalSeoCta,
  InfoCard,
  InfoGrid,
  PageHero,
  Prose,
  RelatedGuides,
  SeoHeader,
  type BreadcrumbItem,
  type FaqItem,
} from "@/components/seo/content-page";
import { StructuredData } from "@/components/seo/structured-data";
import { createStructuredPage } from "@/lib/seo-content";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-static";

const title = "Presente digital romântico com fotos, música e QR Code";
const description = "Entenda como criar um presente digital personalizado, o que incluir e como entregar. Reúna cartinha, fotos, música e surpresas interativas em um só link.";
const path = "/presente-digital";

export const metadata: Metadata = createPageMetadata({ title, description, path });

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Início", href: "/" },
  { label: "Presente digital" },
];

const faqs: FaqItem[] = [
  {
    question: "O que é um presente digital romântico?",
    answer: "É uma experiência personalizada que a pessoa abre pelo celular. Em vez de ser apenas uma mensagem, pode reunir texto, fotos, música, contador do relacionamento e recursos interativos em uma página compartilhada por link ou QR Code.",
  },
  {
    question: "Um presente digital funciona para namoro à distância?",
    answer: "Sim. Como a entrega pode ser feita por link, a distância não impede a surpresa. Para criar expectativa, combine um horário para a abertura, faça uma chamada de vídeo ou envie primeiro uma pista e revele o link depois.",
  },
  {
    question: "Como entregar um presente digital sem parecer só um link?",
    answer: "Use o QR Code em um cartão, bilhete, envelope, caixa ou junto de um presente físico. Se a entrega for pelo WhatsApp, mande antes uma mensagem curta preparando o momento e peça que a pessoa abra com som e alguns minutos livres.",
  },
  {
    question: "Dá para criar um presente digital de última hora?",
    answer: "Dá, desde que você priorize o essencial: uma mensagem sincera, poucas fotos bem escolhidas e a música certa. Um presente curto e específico costuma ser mais marcante que uma página longa montada sem cuidado.",
  },
  {
    question: "O Minha Cartinha é gratuito?",
    answer: "Há uma opção gratuita com mensagem, nomes, data especial, até duas fotos, música, link e QR Code, disponível por dois dias após a publicação. O Premium é uma compra única por cartinha e libera permanência, até seis fotos, quiz, Vales do Amor e Roleta do Amor.",
  },
];

const structuredData = createStructuredPage({ path, title, description, breadcrumbs, faqs });

export default function PresenteDigitalPage() {
  return (
    <div className="min-h-screen bg-[#fcfaf8]">
      <StructuredData data={structuredData} />
      <SeoHeader />
      <main id="conteudo">
        <PageHero
          breadcrumbs={breadcrumbs}
          eyebrow="Guia + ferramenta"
          title="Presente digital romântico: uma surpresa feita da história de vocês"
          description="Um bom presente digital não é um cartão genérico na tela. É uma experiência pessoal com palavras, memórias e pequenos detalhes que só fazem sentido para quem recebe. Veja como planejar, criar e entregar a sua."
          primaryCta="Criar meu presente digital"
        >
          <DigitalGiftMockup />
        </PageHero>

        <ContentSection
          eyebrow="Antes de começar"
          title="O que transforma uma página em presente"
          intro="A tecnologia é só a embalagem. O valor está na seleção: por que aquela foto, por que aquela música e o que você decidiu dizer agora."
        >
          <InfoGrid>
            <InfoCard number="1" title="Tem intenção">
              <p>Escolha a emoção central: agradecer, celebrar uma data, matar a saudade, fazer um pedido ou simplesmente lembrar que a pessoa é importante.</p>
            </InfoCard>
            <InfoCard number="2" title="Tem detalhes reais">
              <p>Apelidos, cenas cotidianas, lugares e piadas internas fazem a pessoa perceber que aquilo não poderia ter sido criado para mais ninguém.</p>
            </InfoCard>
            <InfoCard number="3" title="Tem um momento de entrega">
              <p>O link, o QR Code, um bilhete e o horário escolhido formam a revelação. Planejar a abertura faz parte do presente.</p>
            </InfoCard>
          </InfoGrid>
          <div className="mt-8">
            <Callout title="Presente digital não precisa competir com o físico">
              <p>Ele pode ser o presente principal ou a camada emocional de uma caixa, flores, chocolate, livro ou jantar. Um QR Code dentro do envelope cria surpresa; a página guarda o conteúdo que não caberia no papel.</p>
            </Callout>
          </div>
        </ContentSection>

        <ContentSection
          eyebrow="Escolha com propósito"
          title="Quando essa ideia funciona melhor"
          intro="O formato é especialmente útil quando você quer personalização, entrega rápida ou uma experiência que possa ser revisitada."
          tinted
        >
          <div className="overflow-hidden rounded-[1.6rem] border border-[#e3d4d8] bg-white">
            <div className="hidden grid-cols-3 gap-px bg-[#e9dde0] md:grid">
              {['Ocasião', 'Boa direção', 'Detalhe que muda tudo'].map((heading) => (
                <div key={heading} className="bg-[#f4e8ec] px-5 py-4 text-sm font-bold text-[#633345]">{heading}</div>
              ))}
            </div>
            <div className="divide-y divide-[#e9dde0]">
              {[
                ["Aniversário de namoro", "Recontar a trajetória", "Uma memória de cada fase"],
                ["Namoro à distância", "Diminuir a sensação de distância", "Abrir juntos em chamada"],
                ["Aniversário", "Celebrar a pessoa, não só o casal", "Qualidades e desejos para o novo ciclo"],
                ["Pedido de namoro", "Criar uma sequência até a pergunta", "Resposta deve acontecer sem pressão"],
                ["Dia comum", "Surpreender sem obrigação de calendário", "Uma cena recente que fez você sorrir"],
              ].map(([occasion, direction, detail]) => (
                <article key={occasion} className="grid gap-4 px-5 py-5 md:grid-cols-3 md:gap-0 md:px-0 md:py-0">
                  {[["Ocasião", occasion], ["Boa direção", direction], ["Detalhe que muda tudo", detail]].map(([label, value], index) => (
                    <div key={label} className={`text-sm leading-6 md:px-5 md:py-4 ${index === 0 ? "font-semibold text-[#633345]" : "text-[#755d66]"}`}>
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#a05a6f] md:hidden">{label}</span>
                      {value}
                    </div>
                  ))}
                </article>
              ))}
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-[#755d66]">Se a ocasião for aniversário de relacionamento, veja também o guia de <Link href="/guias/aniversario-de-namoro" className="font-bold text-[#8e2f4b] underline underline-offset-4">aniversário de namoro</Link> para montar o dia inteiro, não apenas o presente.</p>
        </ContentSection>

        <ContentSection
          eyebrow="Conteúdo"
          title="O que colocar em um presente digital"
          intro="Você não precisa usar todos os recursos. Escolha os que sustentam a história e deixe espaço para cada parte respirar."
        >
          <InfoGrid columns={2}>
            <InfoCard title="Uma cartinha com voz própria">
              <p>Abra com uma cena concreta, diga o que ela representa e termine olhando para o futuro. Se estiver difícil, use nosso <Link href="/guias/como-escrever-uma-carta-de-amor" className="font-bold text-[#8e2f4b] underline underline-offset-4">passo a passo para escrever uma carta de amor</Link>.</p>
            </InfoCard>
            <InfoCard title="Fotos que contam, não repetem">
              <p>Prefira variedade: um começo, um cotidiano, uma conquista e uma imagem engraçada. Evite seis selfies quase iguais; a sequência deve avançar a narrativa.</p>
            </InfoCard>
            <InfoCard title="A música de vocês">
              <p>Escolha pela ligação com uma memória, não só pela letra romântica. Vale a música do primeiro encontro, de uma viagem ou aquela que sempre toca no carro.</p>
            </InfoCard>
            <InfoCard title="Tempo e pequenos rituais">
              <p>O contador dá contexto à trajetória. Quiz, Vales do Amor e Roleta transformam a leitura em participação e funcionam melhor quando usam referências do casal.</p>
            </InfoCard>
          </InfoGrid>
        </ContentSection>

        <ContentSection
          eyebrow="Passo a passo"
          title="Como criar sem deixar para a inspiração resolver tudo"
          intro="Separe cerca de meia hora sem interrupções. Primeiro reúna o material; só depois monte a experiência."
          tinted
        >
          <InfoGrid>
            <InfoCard number="01" title="Defina uma frase-guia">
              <p>Complete: “Quando abrir, eu quero que você sinta…”. Use a resposta para decidir o tom de todas as outras partes.</p>
            </InfoCard>
            <InfoCard number="02" title="Faça uma pasta curta">
              <p>Escolha as fotos, anote duas memórias, separe o link da música e confirme a data do relacionamento antes de abrir o editor.</p>
            </InfoCard>
            <InfoCard number="03" title="Escreva antes de decorar">
              <p>Monte a mensagem com começo, lembrança, significado e fechamento. Depois escolha cores e recursos que acompanham esse clima.</p>
            </InfoCard>
            <InfoCard number="04" title="Revise no celular">
              <p>Leia como se você fosse quem recebe. Confira nomes, datas, enquadramento das fotos e se o texto está confortável de ler.</p>
            </InfoCard>
            <InfoCard number="05" title="Planeje a revelação">
              <p>Decida entre link e QR Code, escolha o horário e evite entregar quando a pessoa estiver trabalhando, dirigindo ou sem privacidade.</p>
            </InfoCard>
            <InfoCard number="06" title="Guarde uma última surpresa">
              <p>Termine com um convite simples: uma ligação, um jantar, um passeio ou um vale que prolongue a experiência fora da tela.</p>
            </InfoCard>
          </InfoGrid>
        </ContentSection>

        <ContentSection
          eyebrow="Entrega"
          title="Cinco formas de apresentar o link ou QR Code"
          intro="A melhor entrega combina com a rotina e a personalidade de quem vai receber. Não precisa ser cara para ter intenção."
        >
          <Checklist items={[
            "Dentro de um envelope com a instrução “abra com o som ligado”.",
            "Em um cartão colocado junto de flores, chocolate ou um livro.",
            "No final de uma caça ao tesouro curta, com pistas de lugares importantes.",
            "Por mensagem, depois de um áudio explicando por que você preparou aquilo.",
            "Durante uma chamada de vídeo, para acompanhar a abertura à distância.",
            "Em um porta-retrato ou caixa, desde que o QR Code esteja nítido e testado.",
          ]} />
        </ContentSection>

        <ContentSection
          eyebrow="Revisão final"
          title="O que conferir antes de enviar"
          tinted
        >
          <Checklist items={[
            "Os nomes e a data estão corretos.",
            "A mensagem parece algo que você realmente diria.",
            "Cada foto acrescenta uma memória diferente.",
            "A música abre no conteúdo certo.",
            "O link e o QR Code foram testados em outro celular.",
            "A pessoa terá tempo e privacidade para aproveitar.",
          ]} />
          <div className="mt-8">
            <Callout title="Evite o excesso">
              <p>Texto enorme sem pausas, fotos repetidas, efeitos demais e frases copiadas disputam atenção. Uma ideia clara, bem acabada e pessoal quase sempre emociona mais.</p>
            </Callout>
          </div>
        </ContentSection>

        <ContentSection eyebrow="No Minha Cartinha" title="Da ideia ao link, sem começar com uma tela em branco">
          <Prose>
            <p>Você escolhe os nomes, a data, a mensagem, as fotos e a música; acompanha uma prévia e publica quando estiver satisfeito. A cartinha pronta pode ser compartilhada por link, QR Code ou e-mail.</p>
            <p>A opção gratuita inclui o essencial e fica disponível por dois dias depois da publicação. Para uma lembrança permanente ou uma experiência mais interativa, o Premium libera até seis fotos, Quiz do Casal, Vales do Amor e Roleta do Amor em uma compra única por cartinha.</p>
            <p>Começar grátis também é uma forma prática de testar se esse formato combina com a surpresa que você imaginou.</p>
          </Prose>
        </ContentSection>

        <FaqSection items={faqs} />
        <RelatedGuides links={[
          { href: "/guias/como-escrever-uma-carta-de-amor", eyebrow: "Escrita", title: "Como escrever uma carta de amor", description: "Um método prático, perguntas de apoio e exemplos fictícios para sair do genérico." },
          { href: "/guias/ideias-de-surpresa-romantica", eyebrow: "Inspiração", title: "Ideias de surpresa romântica", description: "Opções simples, baratas, digitais e à distância para diferentes perfis." },
          { href: "/guias/aniversario-de-namoro", eyebrow: "Ocasião", title: "Aniversário de namoro", description: "Planeje a data com significado, mesmo com pouco tempo ou orçamento." },
        ]} />
        <FinalSeoCta title="Sua história já tem tudo de que o presente precisa" description="Reúna a mensagem, as fotos e a música que fazem sentido para vocês. Você pode começar gratuitamente e compartilhar quando estiver pronto." />
      </main>
    </div>
  );
}
