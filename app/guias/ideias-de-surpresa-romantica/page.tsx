import type { Metadata } from "next";
import Link from "next/link";
import {
  Callout,
  Checklist,
  ContentSection,
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

const title = "Ideias de surpresa romântica simples, criativas e à distância";
const description = "Encontre ideias de surpresa para namorado ou namorada por orçamento, perfil e ocasião. Veja opções simples, digitais, à distância e de última hora.";
const path = "/guias/ideias-de-surpresa-romantica";
const published = "2026-09-10";

export const metadata: Metadata = createPageMetadata({ title, description, path, type: "article", publishedTime: published, modifiedTime: published });

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Início", href: "/" },
  { label: "Guias", href: "/guias" },
  { label: "Ideias de surpresa romântica" },
];

const faqs: FaqItem[] = [
  {
    question: "Como fazer uma surpresa romântica simples e barata?",
    answer: "Escolha um detalhe que prove atenção: recrie um lanche marcante, esconda bilhetes pela rotina, monte uma playlist comentada ou prepare uma cartinha com fotos. Personalização e momento de entrega importam mais que quantidade de itens.",
  },
  {
    question: "Como surpreender o namorado ou a namorada à distância?",
    answer: "Planeje uma experiência simultânea. Envie uma cartinha digital para abrir em chamada, peça a entrega de uma comida ligada a uma memória e assistam ao mesmo filme, ou crie uma sequência de mensagens que termine num plano para o reencontro.",
  },
  {
    question: "O que fazer de surpresa de última hora?",
    answer: "Trabalhe com o que você já tem: selecione cinco fotos, escreva cinco lembranças, escolha uma música e monte uma apresentação ou cartinha digital. Outra opção é preparar o lugar favorito da pessoa em casa e deixar um bilhete explicando cada escolha.",
  },
  {
    question: "Como saber se a pessoa vai gostar da surpresa?",
    answer: "Observe como ela reage a atenção pública, mudanças de plano e presentes sentimentais. Se for reservada, prefira algo íntimo. Se não gosta de imprevistos, preserve horário e compromissos. Surpresa boa revela o conteúdo, não desorganiza a vida da pessoa.",
  },
  {
    question: "Surpresa romântica precisa acontecer em uma data especial?",
    answer: "Não. Um gesto em um dia comum pode ter ainda mais impacto porque não existe obrigação de calendário. Datas especiais ajudam a escolher o tema, mas não são condição para demonstrar cuidado.",
  },
];

const structuredData = createStructuredPage({ path, title, description, breadcrumbs, faqs, kind: "article", datePublished: published, dateModified: published });

const ideaGroups = [
  {
    title: "Simples e baratas",
    ideas: [
      ["Bilhetes em uma pequena rota", "Escolha três lugares da casa ou da rotina. Em cada bilhete, escreva uma lembrança e uma pista para o próximo. O último pode levar a um lanche ou à cartinha."],
      ["Playlist comentada", "Não envie apenas músicas. Acrescente uma frase explicando a memória ou o trecho que fez você pensar na pessoa."],
      ["Noite do primeiro encontro", "Recrie a comida, a música ou uma parte possível daquele dia. Se algo deu errado na ocasião original, isso pode virar o detalhe divertido."],
      ["Pote de próximos momentos", "Escreva ideias possíveis em papéis: café em um lugar novo, caminhada, receita juntos, noite sem celular. O presente vira tempo compartilhado."],
    ],
  },
  {
    title: "Digitais e interativas",
    ideas: [
      ["Cartinha digital com QR Code", "Reúna mensagem, fotos e música em uma página. Entregue o QR Code em um cartão ou envie o link com uma instrução para abrir com calma."],
      ["Quiz da história de vocês", "Use perguntas leves: quem mandou a primeira mensagem, qual foi o primeiro filme ou o que aconteceu numa viagem. Evite questões que possam virar cobrança."],
      ["Roleta para o próximo encontro", "Inclua opções que ambos gostariam: jantar, cinema, piquenique, cozinhar juntos. A graça é descobrir o próximo programa."],
      ["Linha do tempo narrada", "Selecione cinco marcos e grave um áudio curto sobre cada um. Pode ser feita numa apresentação simples ou acompanhar uma galeria de fotos."],
    ],
  },
  {
    title: "Para namoro à distância",
    ideas: [
      ["Abertura em chamada", "Marque um horário, envie o presente digital poucos minutos antes e acompanhe a descoberta. Deixe espaço para a pessoa ler sem precisar comentar tudo."],
      ["Jantar com o mesmo cardápio", "Combinem ou recebam a mesma comida e façam a chamada parecer um encontro. Uma playlist compartilhada ajuda a criar ambiente."],
      ["Caixa com continuação online", "Envie poucos objetos com significado e numere cada um. Um QR Code pode explicar a memória ligada às peças e revelar a última mensagem."],
      ["Contagem para o reencontro", "Monte um calendário curto com pequenas tarefas ou mensagens. O último dia deve apontar para um plano realista, sem prometer o que ainda não está confirmado."],
    ],
  },
];

export default function IdeiasDeSurpresaRomanticaPage() {
  return (
    <div className="min-h-screen bg-[#fcfaf8]">
      <StructuredData data={structuredData} />
      <SeoHeader />
      <main id="conteudo">
        <PageHero
          breadcrumbs={breadcrumbs}
          eyebrow="Ideias com intenção"
          title="Surpresa romântica não é sobre exagero. É sobre atenção."
          description="A melhor ideia para surpreender namorado ou namorada é aquela que combina com a pessoa, cabe na realidade de vocês e carrega um detalhe impossível de comprar pronto. Use este guia para escolher e adaptar."
          meta="Conteúdo editorial do Minha Cartinha · atualizado em 10 de setembro de 2026 · 11 min de leitura"
        />

        <ContentSection eyebrow="Escolha melhor" title="Comece pelo perfil, não pela lista de presentes">
          <Prose>
            <p>Antes de copiar uma ideia, pense em como a pessoa gosta de receber carinho. Alguém reservado pode se sentir desconfortável com músicos no trabalho; alguém que ama memórias talvez prefira fotos e uma carta a um objeto útil.</p>
            <p>A surpresa está no <em>que</em> será revelado. O restante deve transmitir segurança: respeitar horários, limites, privacidade e preferências.</p>
          </Prose>
          <div className="mt-8">
            <InfoGrid>
              <InfoCard title="Gosta de intimidade"><p>Faça a entrega a sós, com carta, música e tempo para conversar depois.</p></InfoCard>
              <InfoCard title="Gosta de experiências"><p>Planeje uma atividade e use o presente como pista: passeio, oficina, jantar ou jogo.</p></InfoCard>
              <InfoCard title="Gosta de lembranças"><p>Selecione fotos, recupere uma data e conte por que aquele momento permaneceu com você.</p></InfoCard>
            </InfoGrid>
          </div>
        </ContentSection>

        <ContentSection eyebrow="Filtro rápido" title="Qual ideia cabe no seu momento?" intro="Tempo e orçamento ajudam a reduzir opções, mas não medem o carinho. Escolha uma direção que você consiga finalizar bem." tinted>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Tenho até uma hora", "Cartinha digital curta, playlist comentada, cinco fotos com memórias ou um jantar simples preparado em casa."],
              ["Tenho um dia", "Caça ao tesouro curta, noite temática, roteiro por lugares do casal ou caixa física com continuação por QR Code."],
              ["Estamos à distância", "Abertura em chamada, entrega local combinada, jantar simultâneo ou contagem regressiva para o reencontro."],
              ["Quero gastar pouco", "Invista em seleção e escrita: bilhetes, receita favorita, fotos já existentes, passeio gratuito e tempo sem distrações."],
            ].map(([heading, body]) => (
              <article key={heading} className="rounded-[1.5rem] border border-[#e3d4d8] bg-white p-6">
                <h3 className="font-serif text-2xl font-semibold text-[#542536]">{heading}</h3>
                <p className="mt-3 text-sm leading-7 text-[#715963]">{body}</p>
              </article>
            ))}
          </div>
        </ContentSection>

        {ideaGroups.map((group, groupIndex) => (
          <ContentSection
            key={group.title}
            eyebrow={`${String(groupIndex + 1).padStart(2, "0")} · ideias`}
            title={group.title}
            tinted={groupIndex % 2 === 1}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {group.ideas.map(([idea, explanation], index) => (
                <InfoCard key={idea} number={String(index + 1).padStart(2, "0")} title={idea}>
                  <p>{explanation}</p>
                </InfoCard>
              ))}
            </div>
          </ContentSection>
        ))}

        <ContentSection eyebrow="Ocasiões" title="Ajuste a surpresa ao motivo">
          <InfoGrid columns={2}>
            <InfoCard title="Aniversário da pessoa">
              <p>Fale também da individualidade dela: qualidades, conquistas e desejos para o novo ciclo. Não transforme tudo em celebração do casal.</p>
            </InfoCard>
            <InfoCard title="Aniversário de namoro">
              <p>Use o tempo como narrativa: começo, mudanças, fase atual e planos. O guia de <Link href="/guias/aniversario-de-namoro" className="font-bold text-[#8e2f4b] underline underline-offset-4">aniversário de namoro</Link> ajuda a organizar a data.</p>
            </InfoCard>
            <InfoCard title="Pedido de namoro">
              <p>Construa o clima, mas faça a pergunta de forma clara. Escolha um contexto privado e permita uma resposta livre, sem plateia ou pressão.</p>
            </InfoCard>
            <InfoCard title="Sem data especial">
              <p>Conte por que aquele dia comum mereceu um gesto. Uma observação recente ou gratidão específica funciona melhor que inventar solenidade.</p>
            </InfoCard>
          </InfoGrid>
        </ContentSection>

        <ContentSection eyebrow="Projeto pronto" title="Uma surpresa digital em seis etapas" tinted>
          <div className="space-y-4">
            {[
              ["Escolha a emoção", "Saudade, gratidão, celebração ou convite para uma nova fase."],
              ["Separe a matéria-prima", "Uma mensagem, até seis fotos realmente diferentes, a música e a data importante."],
              ["Organize a ordem", "Abra com contexto, avance pelas memórias e deixe a parte interativa ou convite para o final."],
              ["Crie a experiência", "Monte a cartinha, revise a prévia no celular e teste os elementos antes de publicar."],
              ["Prepare a entrega", "Use link para rapidez ou QR Code dentro de um cartão, caixa, flor ou pequeno objeto."],
              ["Reserve o depois", "Planeje tempo para conversar, fazer uma chamada ou começar o programa revelado pela surpresa."],
            ].map(([heading, body], index) => (
              <article key={heading} className="grid gap-3 rounded-[1.4rem] border border-[#e3d4d8] bg-white p-5 sm:grid-cols-[52px_210px_1fr] sm:items-center sm:gap-5">
                <span className="grid size-10 place-items-center rounded-full bg-[#f5e7eb] text-sm font-bold text-[#93425a]">{index + 1}</span>
                <h3 className="font-serif text-xl font-semibold text-[#542536]">{heading}</h3>
                <p className="text-sm leading-7 text-[#715963]">{body}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-[#755d66]">Veja em detalhes como funciona um <Link href="/presente-digital" className="font-bold text-[#8e2f4b] underline underline-offset-4">presente digital personalizado</Link> e o que vale a pena incluir.</p>
        </ContentSection>

        <ContentSection eyebrow="Cuidados" title="Erros que transformam surpresa em desconforto">
          <Checklist items={[
            "Expor a pessoa em público sem saber se ela gosta.",
            "Aparecer no trabalho, faculdade ou casa sem combinar limites básicos.",
            "Usar a surpresa para pressionar uma resposta ou reconciliação.",
            "Gastar além do que cabe e criar expectativa de compensação.",
            "Copiar uma ideia viral sem adaptar à personalidade do casal.",
            "Planejar tantos elementos que nenhum deles fica bem terminado.",
          ]} />
          <div className="mt-8">
            <Callout title="Surpresa segura, consentimento preservado">
              <p>Você não precisa revelar o conteúdo para confirmar contexto. Perguntar se a pessoa estará livre, se pode receber algo no endereço e se prefere comemorações íntimas protege o momento sem estragar a descoberta.</p>
            </Callout>
          </div>
        </ContentSection>

        <ContentSection eyebrow="Última hora" title="Um plano possível para fazer hoje" tinted>
          <Prose>
            <p>Escolha cinco fotos: começo, riso, passeio, cotidiano e uma imagem recente. Para cada uma, escreva uma frase sobre o que você lembra. Junte uma música e termine com um convite simples, como jantar em chamada ou caminhar no fim do dia.</p>
            <p>Monte tudo em uma cartinha digital, revise no celular e envie com uma mensagem de preparação: “Fiz uma coisa para você. Abra quando tiver dez minutos e puder ouvir música”. O cuidado com o momento evita que a pessoa veja correndo entre outras tarefas.</p>
          </Prose>
        </ContentSection>

        <FaqSection items={faqs} />
        <RelatedGuides links={[
          { href: "/presente-digital", eyebrow: "Experiência", title: "Presente digital romântico", description: "Entenda o formato e monte uma surpresa com fotos, música, cartinha e QR Code." },
          { href: "/guias/como-escrever-uma-carta-de-amor", eyebrow: "Mensagem", title: "Como escrever uma carta de amor", description: "Organize suas memórias e sentimentos numa mensagem pessoal, sem copiar frases prontas." },
          { href: "/guias/aniversario-de-namoro", eyebrow: "Data especial", title: "Aniversário de namoro", description: "Planeje uma comemoração coerente com a trajetória e a fase de vocês." },
        ]} />
        <FinalSeoCta title="Faça a surpresa ter a cara de vocês" description="Comece pela mensagem e pelas memórias. O Minha Cartinha reúne texto, fotos, música, contador e detalhes interativos em um link fácil de entregar." />
      </main>
    </div>
  );
}
