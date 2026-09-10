import type { Metadata } from "next";
import Link from "next/link";
import {
  Callout,
  Checklist,
  ContentSection,
  ExampleBlock,
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

const title = "Aniversário de namoro: ideias para comemorar e surpreender";
const description = "Planeje um aniversário de namoro com significado: ideias simples, presentes, mensagens, surpresa à distância e um roteiro para organizar a data.";
const path = "/guias/aniversario-de-namoro";
const published = "2026-09-10";

export const metadata: Metadata = createPageMetadata({ title, description, path, type: "article", publishedTime: published, modifiedTime: published });

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Início", href: "/" },
  { label: "Guias", href: "/guias" },
  { label: "Aniversário de namoro" },
];

const faqs: FaqItem[] = [
  {
    question: "O que fazer no aniversário de namoro?",
    answer: "Escolha uma combinação de memória, presença e futuro. Vocês podem revisitar um lugar importante, trocar cartas, preparar uma refeição, montar um álbum ou cartinha digital e reservar tempo para conversar sobre o próximo ciclo.",
  },
  {
    question: "Como comemorar aniversário de namoro gastando pouco?",
    answer: "Use recursos que já existem na história de vocês: fotos, músicas, lugares públicos, receitas e lembranças. Um piquenique, noite temática em casa, carta ou passeio pelo bairro pode ser muito pessoal sem exigir grande orçamento.",
  },
  {
    question: "Qual presente dar no aniversário de namoro?",
    answer: "O melhor presente conversa com a fase atual. Pode ser uma experiência juntos, algo que a pessoa comentou que precisa, um objeto ligado a uma memória ou um presente digital com fotos, música e mensagem. Evite escolher apenas pelo número de meses ou anos.",
  },
  {
    question: "Como comemorar aniversário de namoro à distância?",
    answer: "Marquem um horário protegido, peçam ou preparem a mesma refeição, abram um presente digital em chamada e planejem uma atividade simultânea. Também vale enviar algo físico antes, desde que endereço e disponibilidade estejam confirmados.",
  },
  {
    question: "O que escrever em uma mensagem de aniversário de namoro?",
    answer: "Lembre uma cena do início, reconheça algo que amadureceu desde então e diga o que você deseja para o próximo ciclo. Troque elogios genéricos por uma atitude concreta da pessoa e termine com um plano ou promessa possível.",
  },
];

const structuredData = createStructuredPage({ path, title, description, breadcrumbs, faqs, kind: "article", datePublished: published, dateModified: published });

export default function AniversarioDeNamoroPage() {
  return (
    <div className="min-h-screen bg-[#fcfaf8]">
      <StructuredData data={structuredData} />
      <SeoHeader />
      <main id="conteudo">
        <PageHero
          breadcrumbs={breadcrumbs}
          eyebrow="Celebre a trajetória"
          title="Aniversário de namoro: um dia com a história de vocês"
          description="Não existe uma comemoração obrigatória para cada mês ou ano. Existe a chance de olhar para o caminho, reconhecer o presente e criar uma memória nova. Aqui você encontra ideias e um roteiro para fazer isso caber no tempo e no orçamento."
          meta="Conteúdo editorial do Minha Cartinha · atualizado em 10 de setembro de 2026 · 10 min de leitura"
        />

        <ContentSection eyebrow="Ponto de partida" title="Escolha o significado deste ciclo">
          <Prose>
            <p>Antes de escolher restaurante ou presente, pense no que marcou o período que termina. Foi o primeiro ano cheio de descobertas? Um ciclo de mudanças? Uma fase em que vocês aprenderam a lidar com a distância? A resposta dá tema à comemoração.</p>
            <p>Uma data coerente não precisa resumir toda a relação. Ela pode celebrar uma coisa específica: a parceria nos dias difíceis, a leveza que voltou, os planos que ganharam forma ou os pequenos rituais que mantiveram vocês próximos.</p>
          </Prose>
          <div className="mt-8">
            <InfoGrid>
              <InfoCard title="Olhe para trás"><p>Escolha duas memórias do ciclo: uma grande e uma cotidiana. Elas podem aparecer na carta, nas fotos ou no roteiro do dia.</p></InfoCard>
              <InfoCard title="Cuide do presente"><p>Pergunte o que faria a pessoa se sentir bem agora: descanso, aventura, conversa, encontro íntimo ou tempo sem celular.</p></InfoCard>
              <InfoCard title="Aponte o futuro"><p>Inclua um próximo passo possível — uma viagem a planejar, um hábito a manter ou apenas outra manhã lenta juntos.</p></InfoCard>
            </InfoGrid>
          </div>
        </ContentSection>

        <ContentSection eyebrow="Planejamento" title="Um roteiro simples para organizar a data" intro="Você pode usar as quatro partes no mesmo dia ou espalhá-las. O importante é criar ritmo e não transformar carinho em cronograma apertado." tinted>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["1. Começo", "Uma mensagem curta de manhã, café preparado ou foto antiga com uma frase. A função é marcar o dia sem revelar tudo."],
              ["2. Memória", "Revisitem um lugar, refaçam uma receita, vejam fotos ou contem a versão de cada um sobre um momento importante."],
              ["3. Presença", "Façam algo que permita conversa e atenção. Pode ser jantar, passeio, filme escolhido juntos ou uma noite simples em casa."],
              ["4. Continuação", "Entregue a carta, revele um plano futuro ou escolha um pequeno ritual que vocês possam repetir no próximo ciclo."],
            ].map(([heading, body]) => (
              <InfoCard key={heading} title={heading}><p>{body}</p></InfoCard>
            ))}
          </div>
        </ContentSection>

        <ContentSection eyebrow="Ideias por estilo" title="Escolha o formato que combina com vocês">
          <InfoGrid columns={2}>
            <InfoCard title="Para quem ama nostalgia">
              <p>Monte um percurso por dois ou três lugares importantes, organize fotos em ordem e termine com uma carta sobre o que mudou desde o começo.</p>
            </InfoCard>
            <InfoCard title="Para quem prefere sossego">
              <p>Prepare a comida favorita, desliguem notificações, escolham um filme ligado a uma lembrança e troquem uma mensagem que possa ser guardada.</p>
            </InfoCard>
            <InfoCard title="Para quem gosta de novidade">
              <p>Façam algo que nenhum dos dois experimentou: aula curta, trilha, museu, receita diferente ou passeio por uma parte nova da cidade.</p>
            </InfoCard>
            <InfoCard title="Para quem está à distância">
              <p>Sincronizem refeição e música, abram uma cartinha digital em chamada e deixem uma atividade preparada para os dois, como quiz ou filme.</p>
            </InfoCard>
          </InfoGrid>
        </ContentSection>

        <ContentSection eyebrow="Orçamento" title="Ideias que não dependem de gastar muito" tinted>
          <Checklist items={[
            "Piquenique com comidas que já fazem parte da rotina de vocês.",
            "Caminhada por lugares importantes com uma foto em cada parada.",
            "Jantar em casa com o cardápio do primeiro encontro.",
            "Troca de cartas para ler juntos ou guardar para o próximo ano.",
            "Playlist em ordem cronológica, com uma explicação por música.",
            "Cartinha digital com fotos, mensagem, música, link e QR Code.",
            "Pote com ideias de encontros gratuitos ou baratos para o próximo ciclo.",
            "Noite sem telas, exceto para rever fotos ou abrir a surpresa preparada.",
          ]} />
          <div className="mt-8">
            <Callout title="O critério é intenção, não preço">
              <p>Gastar pouco não significa improvisar sem cuidado. Confirme horários, revise a mensagem, prepare o ambiente e escolha os detalhes com antecedência. Organização também comunica carinho.</p>
            </Callout>
          </div>
        </ContentSection>

        <ContentSection eyebrow="Presente" title="Como escolher algo que não pareça genérico">
          <Prose>
            <p>Comece por três caminhos: algo que a pessoa comentou, uma experiência que vocês querem viver ou uma memória que merece forma. Só depois escolha o objeto ou formato.</p>
            <p>Um presente útil pode ser romântico quando mostra atenção. Um presente sentimental funciona quando contém detalhes reais. E um <Link href="/presente-digital" className="font-bold text-[#8e2f4b] underline underline-offset-4">presente digital</Link> ganha força quando não é só uma galeria, mas uma narrativa com mensagem, música e ordem pensada.</p>
          </Prose>
          <div className="mt-8">
            <InfoGrid>
              <InfoCard title="Útil"><p>Algo mencionado pela pessoa, acompanhado de uma nota que mostra que você prestou atenção.</p></InfoCard>
              <InfoCard title="Experiência"><p>Um programa que respeita gostos, energia, acessibilidade e o tempo disponível dos dois.</p></InfoCard>
              <InfoCard title="Memória"><p>Fotos, carta, música, objeto simbólico ou combinação física e digital revelada por QR Code.</p></InfoCard>
            </InfoGrid>
          </div>
        </ContentSection>

        <ContentSection eyebrow="Mensagem" title="O que escrever no aniversário de namoro" tinted>
          <Prose>
            <p>Use três movimentos: lembre o começo ou uma cena deste ciclo; reconheça uma qualidade demonstrada em atitude; feche com o que você deseja viver a seguir. Nosso guia de <Link href="/guias/como-escrever-uma-carta-de-amor" className="font-bold text-[#8e2f4b] underline underline-offset-4">como escrever uma carta de amor</Link> aprofunda cada etapa.</p>
          </Prose>
          <div className="mt-8">
            <ExampleBlock label="Exemplo fictício · mensagem de aniversário de namoro" title="Memória, significado e futuro">
              <p>Meu amor, faz um ano que saímos daquele café sem perceber que a conversa ainda ia durar tantos dias. Neste ciclo, aprendi que seu carinho mora nos detalhes: no copo de água ao lado da cama, na paciência com os meus horários e no jeito de comemorar minhas pequenas vitórias. Obrigada por construir comigo um amor que também cabe na rotina. Para o próximo ano, desejo mais domingos sem pressa, novas ruas para conhecer e a mesma vontade de conversar até o lugar fechar. Feliz aniversário para nós.</p>
            </ExampleBlock>
          </div>
        </ContentSection>

        <ContentSection eyebrow="À distância" title="Como fazer a data parecer compartilhada">
          <div className="space-y-4">
            {[
              ["Antes", "Confirme um horário sem interrupções e, se houver entrega física, valide endereço e disponibilidade sem revelar o conteúdo."],
              ["Durante", "Preparem a mesma refeição ou bebida, iniciem uma playlist e abram a cartinha digital juntos em chamada."],
              ["Depois", "Façam uma atividade simultânea e terminem definindo uma coisa concreta para o reencontro. Evite prometer datas que ainda não são possíveis."],
            ].map(([heading, body], index) => (
              <article key={heading} className="grid gap-3 rounded-[1.5rem] border border-[#e5d7db] bg-white p-6 sm:grid-cols-[52px_120px_1fr] sm:items-center sm:gap-5">
                <span className="grid size-10 place-items-center rounded-full bg-[#f5e7eb] text-sm font-bold text-[#93425a]">{index + 1}</span>
                <h3 className="font-serif text-xl font-semibold text-[#542536]">{heading}</h3>
                <p className="text-sm leading-7 text-[#715963]">{body}</p>
              </article>
            ))}
          </div>
        </ContentSection>

        <ContentSection eyebrow="Checklist" title="Na semana e no dia da comemoração" tinted>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#542536]">Alguns dias antes</h3>
              <div className="mt-5"><Checklist items={[
                "Confirme a data e a disponibilidade.",
                "Defina um orçamento confortável.",
                "Faça reservas ou confirme entregas.",
                "Separe fotos e escreva a mensagem.",
              ]} /></div>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#542536]">Antes de começar</h3>
              <div className="mt-5"><Checklist items={[
                "Teste links, música e QR Code.",
                "Carregue os celulares se precisar deles.",
                "Evite encaixar atividades demais.",
                "Reserve espaço para conversar e mudar planos.",
              ]} /></div>
            </div>
          </div>
        </ContentSection>

        <ContentSection eyebrow="Evite" title="Quatro armadilhas comuns">
          <InfoGrid columns={2}>
            <InfoCard title="Comparar com outros casais"><p>A comemoração precisa servir à relação de vocês, não parecer maior ou mais fotogênica que a de alguém.</p></InfoCard>
            <InfoCard title="Transformar em teste"><p>Não use a data para medir amor pelo preço, pela reação imediata ou pela capacidade de adivinhar expectativas não conversadas.</p></InfoCard>
            <InfoCard title="Ignorar a rotina real"><p>Viagens, surpresas no trabalho e mudanças de plano exigem cuidado com compromissos, cansaço e limites.</p></InfoCard>
            <InfoCard title="Querer fazer tudo"><p>Um momento bem planejado, uma mensagem sincera e tempo presente costumam funcionar melhor que um dia sem pausa.</p></InfoCard>
          </InfoGrid>
        </ContentSection>

        <FaqSection items={faqs} />
        <RelatedGuides links={[
          { href: "/guias/ideias-de-surpresa-romantica", eyebrow: "Mais opções", title: "Ideias de surpresa romântica", description: "Encontre sugestões por perfil, orçamento, distância e tempo disponível." },
          { href: "/guias/como-escrever-uma-carta-de-amor", eyebrow: "Mensagem", title: "Como escrever uma carta de amor", description: "Crie uma mensagem pessoal com estrutura, perguntas e exemplos fictícios." },
          { href: "/presente-digital", eyebrow: "Presente", title: "Presente digital romântico", description: "Descubra como combinar cartinha, fotos, música e QR Code em uma experiência." },
        ]} />
        <FinalSeoCta title="Transforme este ciclo em uma lembrança de vocês" description="Monte uma cartinha com a mensagem, as fotos e a música que contam essa fase. Compartilhe por link ou entregue como surpresa pelo QR Code." />
      </main>
    </div>
  );
}
