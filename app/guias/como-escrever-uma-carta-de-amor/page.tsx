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

const title = "Como escrever uma carta de amor: guia com exemplos";
const description = "Aprenda como começar, desenvolver e terminar uma carta de amor sincera. Use perguntas, estrutura prática, exemplos fictícios e uma revisão simples.";
const path = "/guias/como-escrever-uma-carta-de-amor";
const published = "2026-09-10";

export const metadata: Metadata = createPageMetadata({ title, description, path, type: "article", publishedTime: published, modifiedTime: published });

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Início", href: "/" },
  { label: "Guias", href: "/guias" },
  { label: "Como escrever uma carta de amor" },
];

const faqs: FaqItem[] = [
  {
    question: "Como começar uma carta de amor sem parecer artificial?",
    answer: "Comece por uma cena ou uma verdade concreta. Você pode lembrar o instante em que percebeu algo especial, contar por que decidiu escrever naquele dia ou usar um apelido que só vocês usam. A especificidade tira o texto do genérico.",
  },
  {
    question: "O que escrever quando faltam palavras?",
    answer: "Responda primeiro em tópicos: qual memória faz você sorrir, o que mudou desde que a pessoa chegou, qual qualidade aparece nos dias difíceis e o que você ainda quer viver com ela. Depois transforme uma resposta por vez em parágrafo.",
  },
  {
    question: "Qual é o tamanho ideal de uma carta de amor?",
    answer: "Não existe medida obrigatória. Para a maioria das ocasiões, quatro a sete parágrafos curtos permitem contar uma memória, explicar o sentimento e fechar com intenção sem repetir ideias. Uma carta curta e específica é melhor que uma longa e vaga.",
  },
  {
    question: "Como terminar uma carta de amor?",
    answer: "Feche com uma pequena promessa, um desejo possível ou um convite ligado à história de vocês. Depois assine do jeito como a pessoa reconhece você. Evite introduzir um assunto totalmente novo na última linha.",
  },
  {
    question: "Posso usar um exemplo pronto?",
    answer: "Use exemplos para entender estrutura e tom, não para copiar. Troque qualquer frase genérica por uma memória, hábito ou expressão de vocês. Se a mesma carta servir para qualquer casal, ainda falta personalização.",
  },
  {
    question: "É melhor entregar no papel ou online?",
    answer: "O papel oferece presença física e caligrafia; o digital permite combinar texto, fotos, música, link e QR Code, além de chegar na hora a quem está longe. Também é possível unir os dois: um bilhete ou cartão físico pode revelar a carta digital.",
  },
];

const structuredData = createStructuredPage({
  path,
  title,
  description,
  breadcrumbs,
  faqs,
  kind: "article",
  datePublished: published,
  dateModified: published,
});

export default function ComoEscreverCartaDeAmorPage() {
  return (
    <div className="min-h-screen bg-[#fcfaf8]">
      <StructuredData data={structuredData} />
      <SeoHeader />
      <main id="conteudo">
        <PageHero
          breadcrumbs={breadcrumbs}
          eyebrow="Guia de escrita"
          title="Como escrever uma carta de amor que pareça realmente sua"
          description="Você não precisa escrever como poeta. Precisa escolher lembranças concretas, dizer o que elas significam e deixar a pessoa reconhecer a sua voz. Este roteiro ajuda a transformar sentimentos soltos em uma carta inteira."
          meta="Conteúdo editorial do Minha Cartinha · atualizado em 10 de setembro de 2026 · 12 min de leitura"
        />

        <ContentSection eyebrow="Em uma frase" title="A estrutura mais simples que funciona">
          <Prose>
            <p>Uma boa carta de amor faz um movimento claro: <strong className="text-[#542536]">lembra algo vivido, explica o que isso despertou e olha para o que vem depois</strong>. Em vez de tentar resumir todo o relacionamento, escolha um fio condutor.</p>
            <p>Você pode escrever sobre como a relação transformou os dias comuns, sobre uma fase que vocês atravessaram, sobre saudade ou sobre a alegria de construir planos. O tema impede que a carta vire uma sequência de elogios desconectados.</p>
          </Prose>
          <div className="mt-8">
            <InfoGrid>
              <InfoCard number="1" title="Passado">
                <p>Uma cena específica: o primeiro encontro, uma conversa, uma viagem ou um dia comum que ganhou importância.</p>
              </InfoCard>
              <InfoCard number="2" title="Presente">
                <p>O que você percebe e sente hoje. Mostre a qualidade por meio de uma atitude, não apenas de um adjetivo.</p>
              </InfoCard>
              <InfoCard number="3" title="Futuro">
                <p>Um desejo possível: repetir um ritual, enfrentar uma fase juntos ou viver um plano que já faz parte das conversas.</p>
              </InfoCard>
            </InfoGrid>
          </div>
        </ContentSection>

        <ContentSection
          eyebrow="Preparação"
          title="Antes de escrever, responda a estas perguntas"
          intro="Não procure frases bonitas ainda. Anote respostas rápidas e honestas; elas serão a matéria-prima dos parágrafos."
          tinted
        >
          <Checklist items={[
            "Qual foi o momento em que você percebeu que essa pessoa era especial?",
            "Que hábito pequeno dela deixa seu dia melhor?",
            "Qual dificuldade vocês atravessaram como parceria?",
            "Que lugar, comida, música ou expressão lembra imediatamente vocês dois?",
            "O que você admira e consegue demonstrar com um exemplo?",
            "Qual plano simples você gostaria de viver ao lado dela?",
            "Por que esta carta precisa existir justamente agora?",
            "Como a pessoa chama você quando está sendo carinhosa?",
          ]} />
          <p className="mt-5 max-w-3xl text-sm leading-7 text-[#755d66]">Circule duas respostas que parecem conectadas. Por exemplo: uma viagem em que algo deu errado e a calma da pessoa nos imprevistos. Esse par já contém uma memória e uma qualidade.</p>
        </ContentSection>

        <ContentSection
          eyebrow="Passo a passo"
          title="Da primeira linha à assinatura"
          intro="Escreva o primeiro rascunho sem interromper para buscar sinônimos. A naturalidade vem antes do acabamento."
        >
          <div className="space-y-4">
            {[
              ["1. Escolha o jeito de chamar", "Use o nome, “meu amor” ou um apelido que tenha intimidade real. O vocativo define o tom: delicado, divertido, intenso ou cotidiano."],
              ["2. Abra uma porta, não faça um anúncio", "Em vez de “estou escrevendo para dizer que te amo”, entre direto numa lembrança ou motivo: “Hoje passei naquela padaria e lembrei do nosso primeiro domingo…”"],
              ["3. Conte uma cena com dois ou três detalhes", "Onde vocês estavam? O que aconteceu? Que detalhe quase ninguém notaria? Não é preciso narrar tudo; selecione o que torna a cena reconhecível."],
              ["4. Diga por que essa memória importa", "Esta é a parte que transforma relato em declaração. Explique o que você percebeu sobre a pessoa, sobre você ou sobre a relação naquele momento."],
              ["5. Traga a carta para o presente", "Mostre como o sentimento aparece hoje: num cuidado recorrente, numa conversa, na segurança de dividir silêncio ou no jeito como vocês resolvem problemas."],
              ["6. Termine apontando para algo", "Pode ser um futuro desejado, uma gratidão, uma promessa pequena ou um convite. Feche o mesmo tema que abriu para dar sensação de completude."],
            ].map(([step, body]) => (
              <article key={step} className="grid gap-3 rounded-[1.5rem] border border-[#e7dadd] bg-white p-5 sm:grid-cols-[230px_1fr] sm:gap-8 sm:p-7">
                <h3 className="font-serif text-xl font-semibold text-[#542536] sm:text-2xl">{step}</h3>
                <p className="text-sm leading-7 text-[#715963]">{body}</p>
              </article>
            ))}
          </div>
        </ContentSection>

        <ContentSection
          eyebrow="Primeira linha"
          title="Formas naturais de começar"
          intro="Use estas estruturas como impulso e substitua os espaços mentais por cenas que só vocês conhecem."
          tinted
        >
          <InfoGrid columns={2}>
            <InfoCard title="Pela memória">
              <p>“Lembra daquele dia em que a chuva mudou todos os nossos planos? Voltei a pensar nele hoje porque…”</p>
            </InfoCard>
            <InfoCard title="Pelo presente">
              <p>“Você está aí fazendo uma coisa comum, e eu estou aqui percebendo mais uma vez como…”</p>
            </InfoCard>
            <InfoCard title="Pela honestidade">
              <p>“Comecei esta carta três vezes. Talvez porque o que eu mais quero dizer pareça simples, mas…”</p>
            </InfoCard>
            <InfoCard title="Pela pergunta">
              <p>“Você sabe qual é uma das minhas versões favoritas de nós dois? É aquela em que…”</p>
            </InfoCard>
          </InfoGrid>
          <div className="mt-8">
            <Callout title="O teste da primeira linha">
              <p>Imagine que o nome foi apagado. A pessoa ainda reconheceria que aquela abertura fala de vocês? Se não, acrescente lugar, gesto, apelido ou circunstância.</p>
            </Callout>
          </div>
        </ContentSection>

        <ContentSection
          eyebrow="Exemplos de inspiração"
          title="Três cartas fictícias, com intenções diferentes"
          intro="Os exemplos abaixo não são relatos de clientes. Eles mostram como memória, significado e fechamento podem funcionar juntos."
        >
          <div className="space-y-6">
            <ExampleBlock label="Exemplo fictício · cartinha curta" title="Para um dia comum">
              <p>Meu amor, hoje vi a caneca azul esquecida na mesa e sorri. É estranho como os seus pequenos rastros fazem a casa parecer mais nossa. Obrigada por transformar pressa em café compartilhado e silêncio em companhia. Quando você voltar, quero repetir nossa noite mais simples: comida improvisada, música baixa e nós dois contando o dia. Com amor, Lia.</p>
            </ExampleBlock>
            <ExampleBlock label="Exemplo fictício · aniversário de namoro" title="Para celebrar a trajetória">
              <p>Rafa, há dois anos eu não imaginava que aquele café demorado seria o começo de tanta coisa. Ainda lembro de você empurrando o último pedaço de bolo para o meu lado, como se já soubesse cuidar de mim nos detalhes. Desde então, tivemos planos perfeitos e dias que deram completamente errado — e em todos eles encontrei parceria. Quero continuar colecionando domingos, viagens e histórias que começam com “você lembra?”. Feliz aniversário para nós. Te amo, Dani.</p>
            </ExampleBlock>
            <ExampleBlock label="Exemplo fictício · amor à distância" title="Para quando a saudade aperta">
              <p>Bia, faltam quilômetros na nossa rotina, mas não faltam sinais seus no meu dia. Você aparece na música que toca no ônibus, na foto do nosso último almoço e no horário em que o celular finalmente chama. A distância me ensinou que presença também é atenção: é lembrar da reunião, mandar a foto do céu e ficar até o sono vencer. Estou contando os dias para o próximo abraço. Até lá, guarda esta carta como um pedaço meu perto de você. Do seu Gui.</p>
            </ExampleBlock>
          </div>
        </ContentSection>

        <ContentSection eyebrow="Para namorado ou namorada" title="Personalize pela pessoa, não pelo gênero" tinted>
          <Prose>
            <p>Uma cartinha para namorado e uma cartinha para namorada não precisam seguir modelos diferentes. A diferença que importa está na personalidade, na fase da relação e na forma como a pessoa recebe afeto.</p>
            <p>Para alguém reservado, uma carta íntima e entregue sem plateia pode ser melhor que uma grande declaração pública. Para alguém brincalhão, inclua uma memória engraçada. Para quem valoriza planos, escreva sobre o que vocês estão construindo. Para quem guarda lembranças, associe a carta a fotos, uma música ou um objeto.</p>
          </Prose>
          <div className="mt-8">
            <InfoGrid>
              <InfoCard title="Pessoa prática"><p>Mostre como o cuidado aparece na rotina e termine com um plano concreto a dois.</p></InfoCard>
              <InfoCard title="Pessoa nostálgica"><p>Conte uma cena antiga e recupere detalhes sensoriais: lugar, música, comida ou clima.</p></InfoCard>
              <InfoCard title="Pessoa divertida"><p>Preserve sua linguagem, inclua uma piada interna e não force solenidade do começo ao fim.</p></InfoCard>
            </InfoGrid>
          </div>
        </ContentSection>

        <ContentSection eyebrow="Revisão" title="Sete erros que enfraquecem uma carta">
          <Checklist items={[
            "Copiar um texto inteiro e trocar apenas o nome.",
            "Empilhar elogios sem mostrar nenhuma situação real.",
            "Usar palavras que você jamais diria numa conversa.",
            "Transformar a carta em cobrança, discussão ou pedido de desculpas confuso.",
            "Contar detalhes íntimos que deixariam a pessoa desconfortável.",
            "Repetir a mesma declaração em vários parágrafos.",
            "Enviar sem reler nomes, datas e frases ambíguas.",
            "Fazer uma declaração pública sem saber se a pessoa gosta desse tipo de exposição.",
          ]} />
          <div className="mt-8">
            <Callout title="Leia em voz alta">
              <p>Você vai perceber frases longas, repetições e palavras que não combinam com seu jeito. Corte o que só enfeita e preserve o que revela uma lembrança, um sentimento ou uma intenção.</p>
            </Callout>
          </div>
        </ContentSection>

        <ContentSection eyebrow="Formato" title="No papel, online ou nos dois?" tinted>
          <InfoGrid columns={2}>
            <InfoCard title="Carta no papel">
              <p>Tem textura, caligrafia e presença física. Funciona bem para quem gosta de guardar objetos. Reserve espaço, escreva legível e leve uma segunda folha caso precise recomeçar.</p>
            </InfoCard>
            <InfoCard title="Carta de amor online">
              <p>Chega imediatamente e pode reunir fotos, música, contador e elementos interativos. É especialmente útil à distância ou quando o QR Code faz parte da surpresa.</p>
            </InfoCard>
          </InfoGrid>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-[#755d66]">Você também pode escrever um bilhete à mão e colocar nele o QR Code de um <Link href="/presente-digital" className="font-bold text-[#8e2f4b] underline underline-offset-4">presente digital com a carta completa</Link>. Assim, a abertura começa no papel e continua na tela.</p>
        </ContentSection>

        <FaqSection items={faqs} />
        <RelatedGuides links={[
          { href: "/presente-digital", eyebrow: "Formato", title: "Presente digital romântico", description: "Reúna a carta, fotos, música e QR Code em uma experiência para abrir no celular." },
          { href: "/guias/ideias-de-surpresa-romantica", eyebrow: "Entrega", title: "Ideias de surpresa romântica", description: "Encontre um jeito de entregar sua mensagem que combine com a pessoa e a ocasião." },
          { href: "/guias/aniversario-de-namoro", eyebrow: "Ocasião", title: "Aniversário de namoro", description: "Use a trajetória do casal para planejar a comemoração e escrever a mensagem." },
        ]} />
        <FinalSeoCta title="Agora a carta precisa da sua história" description="Use o roteiro para escrever com calma. Depois, transforme suas palavras em uma cartinha online com fotos, música e um link para compartilhar." />
      </main>
    </div>
  );
}
