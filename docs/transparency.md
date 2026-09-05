# Transparência da causa animal

A iniciativa destina 15% de uma base operacional explícita. **Destinação calculada não é doação realizada.** `/transparencia` consulta registros reais no servidor; falha de banco produz estado indisponível, nunca números zero inventados.

## Critério financeiro

`ANIMAL_CAUSE_ALLOCATION_BASIS` aceita:

- `GROSS_AFTER_REFUNDS` (padrão): receita bruta dos pagamentos Premium reais aprovados, menos reembolsos e estornos, sem deduzir taxas.
- `NET_AFTER_FEES`: a mesma receita após deduzir também as taxas reais do vendedor (`fee_payer: collector`) informadas pelo Mercado Pago. Taxas do pagador não são deduzidas. Se a taxa ainda não estiver disponível ou seu responsável não estiver identificado, o pagamento aguarda conciliação e a página informa isso.

O padrão é um critério operacional provisório, **não uma definição contábil formal de “ganhos” ou lucro**. Confirmar esse critério com o responsável financeiro antes de produção. Cada pagamento guarda `allocationBasis` e `allocationRateBps = 1500`; mudar a variável só afeta novas compras. A página apresenta o critério atual e as bases efetivamente consideradas no histórico.

Valores são inteiros em centavos. Aplicam-se 15% por pagamento, com arredondamento ao centavo mais próximo (meio centavo para cima); a página soma esses valores. Por exemplo matemático, 790 centavos geram 119 centavos destinados no critério bruto sem reembolso. Isso é apenas explicação de cálculo; nenhum pagamento ou doação de exemplo é inserido.

Pagamentos de teste, pendentes, expirados, rejeitados e cancelados não contam. Reembolso parcial reduz a base; reembolso total e chargeback excluem o pagamento. A atualização depende da conciliação com Mercado Pago por webhook/consulta. O saldo reservado é `max(destinado - doado comprovado, 0)`, um compromisso contábil; não é uma alegação de conta bancária segregada. Se doações já realizadas superarem a destinação após ajustes, a diferença é exibida separadamente, sem apagar os repasses históricos.

## Cadastro simples, sem painel público

Use `scripts/manage-donations.mjs` no ambiente de operação com acesso ao banco. Não existe endpoint administrativo público. A ferramenta utiliza `pg` já presente no projeto, transações e parâmetros SQL; não é necessário editar páginas para cadastrar novas instituições ou doações.

Crie um JSON local com:

- `institution`: `id` estável (3–100 letras, números, `_` ou `-`), `name`, `websiteUrl` HTTPS opcional.
- `donation` opcional: `id` estável, `amountCents` inteiro positivo, `donatedAt` no formato `AAAA-MM-DD`, `description`, `receiptUrl` HTTPS opcional para rascunho, `note` opcional e `receiptPrivacyReviewed` booleano.

Use apenas dados reais. Uma instituição pode ser cadastrada sozinha; ela só aparece na lista pública depois de receber uma doação publicada com comprovante. O mesmo ID atualiza o mesmo registro: não gere novo ID para reimportar o mesmo repasse.

Validar sem consultar nem escrever no banco:

```powershell
node scripts/manage-donations.mjs --input "C:\operacao\doacao.json" --dry-run
```

Salvar instituição e doação como rascunho:

```powershell
node scripts/manage-donations.mjs --input "C:\operacao\doacao.json"
```

Após revisar o comprovante real, marcar `receiptPrivacyReviewed: true` no JSON e publicar:

```powershell
node scripts/manage-donations.mjs --input "C:\operacao\doacao.json" --publish --dry-run
node scripts/manage-donations.mjs --input "C:\operacao\doacao.json" --publish
```

`--publish` registra os instantes de revisão e publicação. Sem essa opção, a doação fica em rascunho, **inclusive ao reimportar uma doação já publicada**; isso permite corrigir ou retirar um registro da página até uma nova revisão. Não execute a ferramenta em produção só para testar: use `--dry-run` e um banco de desenvolvimento para o ensaio completo. `DATABASE_URL` (ou o alias legado `database_url`) é exigido apenas para gravar.

## Revisão e comprovantes

Antes de publicar:

1. Confirme instituição, data, valor e efetivação real do repasse.
2. Gere uma cópia pública do recibo com CPF, endereço, dados bancários, chaves Pix pessoais, telefone, e-mail e outros dados privados removidos. Para PDFs, use redação definitiva e remova metadados; cobrir visualmente texto sem removê-lo não é suficiente.
3. Revise também descrição, observação, nome do arquivo e URL. Não inclua dados pessoais nesses campos.
4. Hospede **somente a versão revisada** em armazenamento público HTTPS. Use URL permanente, sem credenciais, parâmetros, fragmentos ou token temporário. Mantenha o original privado fora do repositório e do armazenamento público.
5. Abra o link em sessão anônima, confira o arquivo e confirme a revisão pelo campo `receiptPrivacyReviewed`.

A ferramenta valida os campos e a declaração de revisão; **não reconhece a autenticidade do arquivo nem oculta dados automaticamente**. A revisão humana é necessária. A página só soma/exibe registros com data de publicação e revisão, data do repasse não futura e URL pública válida. Não há instituições, doações, comprovantes ou números fictícios de demonstração.
