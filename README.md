# Minha Cartinha

Aplicação em Next.js para criar e compartilhar cartinhas digitais personalizadas. O editor permite escrever a história, adicionar fotos, escolher o tema e publicar uma página exclusiva.

## Tecnologias

- Next.js 16 com App Router
- TypeScript
- Tailwind CSS
- Prisma 7
- PostgreSQL no Neon
- Upload de imagens no Cloudinary
- Player oficial do Spotify
- Cloudflare Workers com Wrangler e vinext

## Ambiente local

Use Node.js 22 ou superior, instale as dependências e configure a conexão:

```bash
npm install
```

Crie um arquivo `.env` a partir de `.env.example` e preencha `DATABASE_URL` com a URL do Neon, além das variáveis do Cloudinary. A aplicação também aceita a chave legada `database_url`.

Depois, aplique as migrations e inicie o projeto:

```bash
npm run db:deploy
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). O editor fica em `/criar` e cada cartinha publicada é aberta em `/c/[identificador]`. Endereços antigos em `/para/[slug]` são redirecionados automaticamente.

## Comandos

```bash
npm run dev          # desenvolvimento
npm run build        # build de produção
npm run lint         # análise estática
npm run typecheck    # gera os tipos de rotas e valida o TypeScript
npm run db:generate  # regenera o Prisma Client
npm run db:migrate   # cria/aplica migrations durante o desenvolvimento
npm run db:deploy    # aplica migrations existentes
npm run db:studio    # abre o Prisma Studio
npm run check:vinext # verifica compatibilidade com o runtime Cloudflare
npm run dev:vinext   # desenvolvimento pelo runtime vinext (porta 3001)
npm run build        # gera o Worker e os assets em dist/
npm run build:next   # valida opcionalmente o build nativo do Next.js
npm run preview:cloudflare # build + Worker local pelo Wrangler
npm run deploy:cloudflare:dry # valida o pacote sem publicar
npm run deploy:cloudflare # build + deploy do Worker
npm run cf-typegen   # atualiza os tipos dos bindings Cloudflare
```

## Deploy na Cloudflare

O projeto usa o caminho atualmente recomendado pela Cloudflare para Next.js 16: `vinext` sobre Cloudflare Workers. A configuração principal está em `wrangler.jsonc`; o build gera a configuração publicável em `dist/server/wrangler.json`.

Requisitos do ambiente de deploy:

- Node.js 22 ou superior (fixado em `.node-version`)
- uma conta Cloudflare com Workers habilitado
- as migrations do Prisma aplicadas no Neon
- os valores de produção de `.env.example` configurados como secrets do Worker

Para validar tudo localmente sem publicar:

```bash
npm run check:vinext
npm run deploy:cloudflare:dry
npm run preview:cloudflare
```

No primeiro deploy feito pela sua máquina, autentique o Wrangler e envie o código e os secrets em uma única operação:

```bash
npx wrangler login
npm run db:deploy
npm run build:vinext
npx wrangler deploy --secrets-file .env --config dist/server/wrangler.json
```

O arquivo `.env` continua ignorado pelo Git e não é empacotado como asset. Nos próximos deploys, depois que os secrets já existirem no Worker, use `npm run deploy:cloudflare`.

Ao conectar o repositório ao Workers Builds, use:

```text
Build command:  npm run build
Deploy command: npm run deploy:vinext
Root directory: /
```

Cadastre `DATABASE_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER_NAME`, `RESEND_API_KEY` e `RESEND_DOMAIN` em **Settings > Variables and Secrets** do Worker. `NEXT_PUBLIC_APP_URL`, `RESEND_FROM_EMAIL` e `RESEND_REPLY_TO_EMAIL` são sobrescritas opcionais. A instalação das dependências e o `prisma generate` não precisam acessar o banco. Se as migrations forem executadas no pipeline, cadastre `DATABASE_URL` também como secret do ambiente de build e rode `npm run db:deploy` antes do build de produção.

Esses nomes não são declarados como `secrets.required` no Wrangler porque o Workers Builds valida os secrets do Worker apenas no deploy e bloqueia a primeira publicação quando um secret novo ainda não foi cadastrado. A aplicação valida as configurações no momento de uso: sem Resend, a cartinha continua salva e o usuário recebe o estado de falha do e-mail; sem banco ou Cloudinary, as operações correspondentes retornam erro controlado. Depois de cadastrar os secrets no painel, os deploys seguintes os preservam automaticamente.

Por padrão, o link público usa `https://RESEND_DOMAIN` e o remetente usa `Minha Cartinha <cartinhas@RESEND_DOMAIN>`. O domínio precisa estar verificado no Resend. Se o site usar outra origem, defina `NEXT_PUBLIC_APP_URL` sem barra final. O QR Code é gerado em memória para cada entrega e incorporado ao e-mail por CID; nenhum arquivo de QR Code é persistido.

O acesso atual ao Neon usa `pg`/Prisma por TCP com `nodejs_compat`. Para um volume maior, o Hyperdrive pode ser acrescentado depois como camada de pooling regional, sem ser necessário para o primeiro deploy.

## Organização

- `app/api/letters`: publicação de cartinhas
- `app/c/[slug]`: experiência pública compartilhável, privada para mecanismos de busca
- `app/para/[slug]`: compatibilidade e redirecionamento dos links antigos
- `lib/email`: template responsivo e integração isolada com o Resend
- `components/create`: editor e prévia em tempo real
- `components/letter`: página da cartinha publicada
- `lib/letters`: contratos, validação, identificadores públicos e consultas
- `prisma`: schema e histórico de migrations

As imagens são otimizadas no navegador, validadas novamente no servidor e enviadas ao Cloudinary. O Neon guarda os dados da cartinha e apenas os identificadores, URLs e metadados dos arquivos.

Links de música são normalizados no servidor e exibidos pelo Embed oficial do Spotify, sem necessidade de credenciais adicionais. A data de início do relacionamento é salva como data e hora e alimenta o contador dinâmico da experiência publicada.

## SEO e indexação

A Home e `/criar` possuem metadata própria, canonical no domínio sem `www`, imagem Open Graph, Twitter Card e dados estruturados coerentes com o conteúdo visível. O sitemap contém somente essas duas páginas indexáveis. Cartinhas pessoais em `/c/[slug]` permanecem fora do sitemap e usam `noindex`, `noarchive`, `nosnippet`, `no-store` e `no-referrer`; elas não são bloqueadas no `robots.txt` para que os buscadores consigam ler a diretiva `noindex`.

Checklist externo após cada deploy de produção:

- habilitar **Always Use HTTPS** na Cloudflare;
- criar o DNS de `www` e redirecioná-lo permanentemente para `https://minhacartinha.com.br`;
- cadastrar uma propriedade de domínio no Google Search Console e enviar `https://minhacartinha.com.br/sitemap.xml`;
- validar a Home no Rich Results Test e acompanhar Core Web Vitals com dados reais de campo;
- conferir se HTML público passou a receber cache no edge depois do aquecimento da nova versão.
