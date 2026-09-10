import type { PublicLetterData } from "@/lib/letters/contracts";

export const demoPremiumLetter: PublicLetterData = {
  slug: "clara-e-gabriel",
  recipientName: "Gabriel",
  senderName: "Clara",
  title: "Você é o meu lugar favorito",
  message:
    "Se eu pudesse guardar cada instante nosso em uma caixinha, ela estaria cheia de risadas bobas, abraços demorados e daqueles silêncios que só ficam confortáveis quando estou com você.\n\nVocê transformou os dias comuns nas minhas lembranças preferidas. Obrigada por ser casa, aventura e calmaria ao mesmo tempo — por segurar minha mão quando tudo parece rápido demais e por celebrar comigo cada pequena alegria.\n\nQue a gente nunca perca essa vontade bonita de escolher um ao outro. Ainda temos muitos cafés sem pressa, pôr do sol, planos improvisados e histórias para viver.\n\nEu te amo por tudo o que já somos e por tudo o que ainda vamos descobrir juntos.",
  signature: "Com todo o meu amor, Clara",
  relationshipStartedAt: "2021-06-12T20:00:00-03:00",
  openingText: "Exemplo Premium · uma surpresa feita para você",
  closingText: "Em qualquer vida, meu coração encontraria o caminho até você.",
  heroImage: "/demo/clara-e-gabriel/capa.webp",
  gallery: [
    {
      id: "demo-gallery-1",
      src: "/demo/clara-e-gabriel/centro-historico.webp",
      caption: "Onde a gente vai, o caminho vira memória",
    },
    {
      id: "demo-gallery-2",
      src: "/demo/clara-e-gabriel/cafe-da-manha.webp",
      caption: "Meu jeito favorito de começar o dia",
    },
    {
      id: "demo-gallery-3",
      src: "/demo/clara-e-gabriel/praia.webp",
      caption: "Nós dois e o mundo inteiro pela frente",
    },
    {
      id: "demo-gallery-4",
      src: "/demo/clara-e-gabriel/capa.webp",
      caption: "O pôr do sol mais bonito é sempre com você",
    },
  ],
  favoritePlace: {
    name: "Praia dos Carneiros",
    caption: "Foi aqui que prometemos colecionar mais momentos do que coisas.",
    image: "/demo/clara-e-gabriel/praia.webp",
  },
  showFavoritePlace: true,
  song: {
    title: "Trevo (Tu)",
    artist: "ANAVITÓRIA & Tiago Iorc",
    spotifyUrl: "",
  },
  themeId: "vinho",
  showRelationshipTime: true,
  showMusic: true,
  quizEnabled: true,
  quiz: [
    {
      id: "demo-quiz-1",
      question: "Onde aconteceu o nosso primeiro encontro?",
      options: ["Na livraria", "Em uma cafeteria", "Na praia", "Em um show"],
      correctIndex: 1,
    },
    {
      id: "demo-quiz-2",
      question: "Qual é o nosso programa favorito de domingo?",
      options: ["Cozinhar juntos", "Correr no parque", "Ir ao cinema", "Dormir até tarde"],
      correctIndex: 0,
    },
    {
      id: "demo-quiz-3",
      question: "Quem disse “eu te amo” primeiro?",
      options: ["Clara", "Gabriel", "Os dois juntos", "Ninguém lembra"],
      correctIndex: 2,
    },
  ],
  vouchersEnabled: true,
  vouchers: [
    {
      id: "demo-voucher-pix",
      title: "Vale R$ 50,00 no Pix",
      description: "Para você escolher um mimo e lembrar que merece o mundo inteiro.",
      totalUses: 1,
      usedCount: 0,
    },
    {
      id: "demo-voucher-cafe",
      title: "Café da manhã na cama",
      description: "Com direito ao seu café favorito e nenhuma hora para levantar.",
      totalUses: 1,
      usedCount: 0,
    },
    {
      id: "demo-voucher-date",
      title: "Um date surpresa",
      description: "Eu cuido de todos os detalhes. Você só precisa dizer sim.",
      totalUses: 1,
      usedCount: 0,
    },
  ],
  loveWheelEnabled: true,
  loveWheelTitle: "Roleta do nosso próximo encontro",
  loveWheelOptions: [
    { id: "demo-wheel-1", title: "Noite de massas", description: "Massa, vinho e nossa playlist favorita." },
    { id: "demo-wheel-2", title: "Piquenique ao pôr do sol", description: "Uma cesta gostosa e tempo sem pressa." },
    { id: "demo-wheel-3", title: "Cinema em casa", description: "Você escolhe o filme e eu faço a pipoca." },
    { id: "demo-wheel-4", title: "Passeio surpresa", description: "O destino é segredo, mas a companhia já está garantida." },
    { id: "demo-wheel-5", title: "Jantar à luz de velas", description: "Nosso restaurante favorito, só que em casa." },
    { id: "demo-wheel-6", title: "Dia de praia", description: "Pé na areia, água de coco e muitos abraços." },
  ],
};
