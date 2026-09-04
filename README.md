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

Acesse [http://localhost:3000](http://localhost:3000). O editor fica em `/criar` e cada cartinha publicada é aberta em `/para/[slug]`.

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
npm run build:vinext # gera o Worker e os assets em dist/
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
- os cinco valores de `.env.example` configurados como secrets do Worker

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
Build command:  npm run build:vinext
Deploy command: npm run deploy:vinext
Root directory: /
```

Cadastre `DATABASE_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` e `CLOUDINARY_FOLDER_NAME` nos secrets do Worker. A instalação das dependências e o `prisma generate` não precisam acessar o banco. Se as migrations forem executadas no pipeline, cadastre `DATABASE_URL` também como secret do ambiente de build e rode `npm run db:deploy` antes do build de produção.

O acesso atual ao Neon usa `pg`/Prisma por TCP com `nodejs_compat`. Para um volume maior, o Hyperdrive pode ser acrescentado depois como camada de pooling regional, sem ser necessário para o primeiro deploy.

## Organização

- `app/api/letters`: publicação de cartinhas
- `app/para/[slug]`: experiência pública compartilhável
- `components/create`: editor e prévia em tempo real
- `components/letter`: página da cartinha publicada
- `lib/letters`: contratos, validação, slug e consultas
- `prisma`: schema e histórico de migrations

As imagens são otimizadas no navegador, validadas novamente no servidor e enviadas ao Cloudinary. O Neon guarda os dados da cartinha e apenas os identificadores, URLs e metadados dos arquivos.

Links de música são normalizados no servidor e exibidos pelo Embed oficial do Spotify, sem necessidade de credenciais adicionais. A data de início do relacionamento é salva como data e hora e alimenta o contador dinâmico da experiência publicada.
