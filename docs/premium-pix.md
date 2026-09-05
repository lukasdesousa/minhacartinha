# Premium e Pix — operação

## Produto e publicação

O Grátis mantém mensagem, nomes, data especial, até 2 fotos no carrossel, link, QR Code, compartilhamento e os recursos básicos existentes. Fotos de capa e lugar favorito continuam independentes do limite do carrossel.

O Premium custa **R$ 7,90 por cartinha, uma única vez, sem assinatura**, e libera Quiz do casal e até 6 fotos no carrossel juntos. O teto de 6 preserva o limite técnico de imagens que já existia. `lib/premium.ts` define `PREMIUM_PRICE_CENTS = 790`; `lib/payments/mercado-pago.ts` usa esse valor no servidor. Nenhum preço, status ou flag de compra enviado pelo navegador autoriza publicação.

O criador guarda a edição, fotos, perguntas e um token aleatório de 256 bits no IndexedDB. Ao preparar a compra ou publicar, `/api/letters/draft` salva um rascunho privado no banco. Só o hash SHA-256 do token é armazenado como credencial no servidor. O link público da cartinha não concede acesso de edição nem acesso ao Pix. O token é enviado como Bearer em cada operação privada; não aparece em query string, links ou logs.

O token continua vinculado à mesma cartinha durante a edição. Não limpar os dados do navegador antes de concluir: o produto continua sem cadastro e não oferece recuperação em outro dispositivo. O IndexedDB preserva a edição, mas nunca serve como prova de pagamento. Depois da publicação, o criador oferece o link pronto e a opção de criar outra cartinha, com identidade e compra independentes.

`POST /api/letters` valida todos os campos, perguntas e fotos; confere propriedade e Premium no banco antes de upload e novamente na transação de publicação. Uma tentativa concorrente usa uma reserva de publicação. Repetir o envio de uma cartinha já publicada retorna seu mesmo link. Os rascunhos permanecem privados; o pagamento nunca publica nem envia o e-mail automaticamente.

Cartinhas anteriores à migração continuam `FREE` e mantêm sua galeria original (`premiumRulesVersion = 0`). Novas cartinhas usam versão 1. Reembolso/estorno revoga o Premium da compra afetada e a leitura pública limita os recursos novos; o conteúdo original é preservado no banco.

## Integração Mercado Pago

SDK oficial `mercadopago` **3.6.0**, versão estável consultada no registro npm, compatível com Node 22 do projeto. Criação pela API atual de **Orders** (`Order.create`, `/v1/orders`), processamento automático e Pix `bank_transfer`. Não existe redirecionamento para checkout externo nem SDK financeiro no navegador.

- `POST /api/payments/pix`: recebe somente a identificação da cartinha e o e-mail do pagador; grava referência, valor, data, estado e chave de idempotência antes de chamar o provedor.
- `GET /api/payments/pix?letterId=...`: requer o mesmo Bearer, consulta o estado e reconcilia com o provedor respeitando o intervalo do servidor. Respostas privadas usam `no-store`.
- `POST /api/webhooks/mercado-pago`: valida a assinatura oficial, confere a identificação assinada e busca a Order atual no Mercado Pago. O estado recebido no corpo não é usado como prova.

O QR Code em base64 e o código copia e cola vêm da transação oficial da Order correspondente. Nunca são gerados manualmente. O prazo solicitado do Pix é de 30 minutos; a data retornada pelo provedor é preservada. O modal consulta a cada 15 segundos enquanto aberto e visível, recuando em falhas.

A reconciliação usa `Order.get` e a consulta financeira oficial `Payment.get` pelo `reference_id` vinculado à Order. Essa consulta complementar confirma moeda BRL, valor, conta recebedora, ambiente real/teste, aprovação, taxas e reembolsos acumulados; a criação continua pela Orders API. Somente uma aprovação confirmada, integral e sem reembolso libera `PREMIUM` em transação no banco. Os demais estados são `FREE` ou `PAYMENT_PENDING`.

Uma chave ativa única por cartinha, bloqueios de linha e reservas temporárias no banco evitam duplicatas entre servidores. Em timeout ambíguo, a mesma chave de idempotência é reutilizada. Uma tentativa nova só é aberta após estado terminal confirmado pelo provedor. Um Pix expirado é reconciliado/cancelado no provedor antes de permitir outro. Notificações repetidas reconciliam o mesmo registro; estados antigos não regridem uma liquidação para pendente.

Logs registram evento, identificador interno e código de erro seguro. Não imprimem tokens, e-mail do pagador, resposta completa do SDK nem Pix completo. Falhas transitórias no webhook retornam HTTP 503 para que o Mercado Pago tente novamente; HTTP 200 só ocorre após a conciliação aplicável. A assinatura não impõe uma janela curta que descartaria retentativas legítimas; uma repetição válida apenas consulta novamente o estado atual no provedor.

## Configuração antes de receber pagamentos

1. Aplicar a migração `20260905120000_premium_pix_transparency` com `npm run db:deploy` no banco do ambiente e gerar o cliente com `npm run db:generate`. As migrações não foram aplicadas automaticamente ao banco configurado em `.env`.
2. No Mercado Pago, criar/configurar a aplicação para Checkout Transparente com Orders e cadastrar uma chave Pix na conta recebedora.
3. Configurar as variáveis privadas abaixo no servidor/Worker. Em Cloudflare, cadastrar como secrets em Settings → Variables and Secrets. O arquivo `.env` não é levado automaticamente para os secrets do Worker.
4. Em **Suas integrações → aplicação → Webhooks**, cadastrar a URL HTTPS pública `https://SEU_DOMINIO/api/webhooks/mercado-pago`, selecionar o evento **Order** (tópico `order`) para o ambiente correspondente e copiar a chave secreta de assinatura. Não configurar somente o tópico legado `payment`.
5. Garantir que essa rota aceite POST público do Mercado Pago, sem login, desafio interativo, redirecionamento ou cache da CDN. A autenticação da notificação é a assinatura. A URL de desenvolvimento localhost requer túnel HTTPS para receber notificações.
6. Homologar com as credenciais/cenários de teste oficiais e `MERCADO_PAGO_LIVE_MODE=false`. Confirmar criação, copia e cola, aprovação e retentativa do webhook no ambiente configurado. Pagamentos de teste não entram na página de transparência.
7. Para receber dinheiro real, usar as credenciais da conta correta, webhook de produção e `MERCADO_PAGO_LIVE_MODE=true`. Validar um Pix de ponta a ponta na conta antes de abrir vendas e conferir aprovação no banco, publicação e e-mail. Nenhuma cobrança real foi criada durante a implementação.

| Variável | Uso |
| --- | --- |
| `MERCADO_PAGO_ACCESS_TOKEN` | Access Token privado do ambiente da aplicação. |
| `MERCADO_PAGO_WEBHOOK_SECRET` | Segredo oficial de assinatura do webhook daquele ambiente. |
| `MERCADO_PAGO_COLLECTOR_ID` | ID numérico da conta Mercado Pago recebedora; deve corresponder ao token e pagamento. |
| `MERCADO_PAGO_LIVE_MODE` | `false` para teste, `true` para dinheiro real; valor explícito obrigatório. |
| `ANIMAL_CAUSE_ALLOCATION_BASIS` | `GROSS_AFTER_REFUNDS` por padrão; alternativa `NET_AFTER_FEES`. Ver `transparency.md`. |
| `NEXT_PUBLIC_APP_URL` | Origem HTTPS definitiva do site para canonical, links e QR Code da cartinha. |

Permanecem necessárias as configurações existentes de `DATABASE_URL`, Cloudinary e Resend para armazenamento de fotos e entrega por e-mail. Não é necessário Public Key do Mercado Pago neste fluxo de Pix próprio, sem captura de cartão.

Verificar notificações e falhas de conciliação no painel do Mercado Pago. A página financeira reflete o estado reconciliado no banco; uma notificação que ainda não foi entregue/processada pode atrasar um ajuste. É possível reenviar notificações pelo painel e a consulta autenticada do checkout também reconcilia. Não alterar `premiumStatus` manualmente para simular uma aprovação.

## Verificações locais

`npm test` cobre validação, autorização, estados financeiros, assinatura, cálculo da causa e entrada administrativa. `npm run test:e2e` inicia um servidor isolado e usa Chrome instalado para verificar os fluxos de interface com APIs simuladas, sem acesso ao banco ou dinheiro real. `npm run typecheck`, `npm run lint` e `npm run build` verificam o código e o pacote Cloudflare. Esses testes não substituem a homologação das credenciais e do webhook público na conta Mercado Pago.

## Documentação oficial consultada

- [SDK oficial Node.js](https://github.com/mercadopago/sdk-nodejs)
- [Pix pela Orders API](https://www.mercadopago.com.br/developers/pt/docs/checkout-api-orders/payment-integration/pix)
- [Notificações de Orders](https://www.mercadopago.com.br/developers/pt/docs/checkout-api-orders/notifications)
