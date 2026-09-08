import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { getLegalContactLabel } from "@/lib/legal/contact";
import { LEGAL_EFFECTIVE_DATE_LABEL, LEGAL_VERSIONS } from "@/lib/legal/config";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Política de Privacidade",
  description: "Como o Minha Cartinha trata dados pessoais e conteúdos enviados para criar e entregar cartinhas.",
  path: "/privacidade",
});

export default function PrivacyPage() {
  const contact = getLegalContactLabel();
  return (
    <LegalPage eyebrow="Privacidade e LGPD" title="Política de Privacidade" intro="Esta política descreve os dados efetivamente usados para criar, pagar, entregar e manter cartinhas, além dos controles disponíveis às pessoas envolvidas." version={`${LEGAL_VERSIONS.privacy} — vigente desde ${LEGAL_EFFECTIVE_DATE_LABEL}`}>
      <LegalSection title="1. A quem esta política se aplica">
        <p>Esta política se aplica a quem cria uma cartinha, a quem a recebe e a terceiros cujos dados ou imagens sejam incluídos pelo usuário. O responsável pelo tratamento deve ser contatado pelo canal informado ao final.</p>
      </LegalSection>

      <LegalSection title="2. Dados fornecidos diretamente">
        <p>Conforme os recursos escolhidos, tratamos:</p>
        <ul>
          <li>nome do remetente e do destinatário;</li>
          <li>e-mail do destinatário para entrega e e-mail do pagador para o Pix;</li>
          <li>título, mensagem, assinatura, frases, datas e informações sobre o relacionamento;</li>
          <li>fotos, legendas e informações do lugar favorito;</li>
          <li>link de faixa do Spotify;</li>
          <li>perguntas e alternativas do Quiz, Vales do Amor e opções da Roleta;</li>
          <li>URL/identificação, motivo, descrição e e-mail enviados em uma denúncia.</li>
        </ul>
        <p>Quem envia dados de outra pessoa deve ter uma justificativa legítima e as permissões necessárias, especialmente para imagens, dados íntimos ou informações cuja divulgação possa causar risco.</p>
      </LegalSection>

      <LegalSection title="3. Dados gerados pelo funcionamento">
        <p>O sistema gera identificadores da cartinha, um segredo de edição guardado no dispositivo e apenas seu hash no banco, datas de criação, atualização, publicação e expiração, estado Premium e registros de entrega por e-mail. Também registra usos de Vales e giros da Roleta quando esses recursos são acionados.</p>
        <p>Em pagamentos, são mantidos valores, moeda, estado da transação, referências do provedor, modo de operação, datas, taxas, reembolsos e estornos quando informados pelo Mercado Pago. O código do projeto não recebe nem armazena senha bancária ou dados completos de cartão; o fluxo atual usa Pix.</p>
        <p>Requisições de internet carregam dados técnicos como endereço IP e cabeçalhos até a infraestrutura que as atende. Não foi identificado armazenamento desses dados nas tabelas de negócio do Minha Cartinha. Prestadores de infraestrutura podem processar logs técnicos conforme suas configurações e políticas.</p>
      </LegalSection>

      <LegalSection title="4. Finalidades e bases legais">
        <ul>
          <li><strong>Executar o serviço:</strong> salvar o rascunho, criar, exibir, entregar e manter a cartinha e seus recursos, além de processar o Premium solicitado.</li>
          <li><strong>Atender solicitações pré-contratuais e contratuais:</strong> preparar pagamentos, confirmar a compra e prestar suporte relacionado.</li>
          <li><strong>Cumprir obrigações legais e exercer direitos:</strong> conservar registros financeiros necessários, responder autoridades e tratar contestações.</li>
          <li><strong>Legítimo interesse, com avaliação dos direitos envolvidos:</strong> prevenir fraude e abuso, manter a segurança e analisar denúncias.</li>
          <li><strong>Consentimento:</strong> carregar o player externo do Spotify quando a pessoa escolhe permitir esse conteúdo.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Com quem os dados são compartilhados">
        <p>O compartilhamento é limitado ao necessário para operar os recursos escolhidos:</p>
        <ul>
          <li><strong>PostgreSQL/Prisma:</strong> persistência dos dados da aplicação no banco configurado;</li>
          <li><strong>Cloudinary:</strong> armazenamento e entrega das imagens enviadas;</li>
          <li><strong>Resend:</strong> envio da cartinha por e-mail e aviso de denúncias, quando configurado;</li>
          <li><strong>Mercado Pago:</strong> criação, confirmação e conciliação do pagamento Pix;</li>
          <li><strong>Cloudflare:</strong> infraestrutura, execução e entrega do projeto conforme a configuração implantada;</li>
          <li><strong>Spotify:</strong> somente quando há link de música e a pessoa permite carregar o player incorporado.</li>
        </ul>
        <p>Também poderá haver compartilhamento para cumprir obrigação legal, ordem de autoridade competente, proteger direitos ou responder a incidente. Não foram identificados Analytics, redes de publicidade, AdSense ou pixels de marketing no projeto.</p>
      </LegalSection>

      <LegalSection title="6. Cartinhas compartilhadas por link">
        <p>A página <code>/c/[slug]</code> não é incluída no sitemap e solicita aos mecanismos de busca que não a indexem. Essa medida reduz descoberta pública, mas não impede que alguém com acesso ao link o copie ou encaminhe. Evite inserir dados que não devam ser vistos pelos destinatários do link.</p>
        <p>Quem entender que uma cartinha viola seus direitos pode usar o canal <Link href="/denunciar">Denunciar conteúdo</Link>.</p>
      </LegalSection>

      <LegalSection title="7. Armazenamento, retenção e exclusão">
        <p>O rascunho e a credencial de edição ficam no IndexedDB do navegador até serem substituídos ou removidos pela pessoa ou pelo próprio navegador. Uma cópia do rascunho também pode ser salva no banco para viabilizar pagamento e publicação.</p>
        <p>Cartinhas gratuitas publicadas possuem expiração operacional de 2 dias; a rotina do projeto remove registros expirados e solicita a exclusão das imagens correspondentes. Cartinhas Premium não têm data automática de expiração no modelo atual, mas podem ser removidas por solicitação válida, obrigação legal ou encerramento do serviço.</p>
        <p>Registros de pagamento, denúncias e evidências necessárias podem ser mantidos pelo tempo necessário às finalidades informadas, ao cumprimento de obrigações e ao exercício de direitos. Não foi confirmado no código um prazo único aplicável a todos esses registros, por isso esta política não promete um período artificial.</p>
      </LegalSection>

      <LegalSection title="8. Segurança">
        <p>O projeto aplica validação no servidor, limites de tamanho, identificadores não sequenciais, verificação da credencial de edição por hash e separação das chaves privadas no ambiente do servidor. Nenhuma medida elimina todos os riscos. Não afirmamos criptografia, anonimização ou localização específica de servidores além do que foi possível confirmar no código.</p>
      </LegalSection>

      <LegalSection title="9. Direitos previstos na LGPD">
        <p>Nos limites aplicáveis, o titular pode solicitar confirmação e acesso, correção, informação sobre compartilhamentos, portabilidade quando regulamentada e pertinente, revisão de decisões automatizadas quando existirem, eliminação de dados tratados com consentimento, oposição, revogação do consentimento e outras providências previstas nos artigos 18 e seguintes da LGPD.</p>
        <p>Para proteger as pessoas envolvidas, poderemos pedir informações razoáveis para verificar identidade, vínculo com a cartinha e legitimidade do pedido. Alguns dados poderão ser conservados quando houver obrigação legal ou outra hipótese autorizada pela LGPD.</p>
      </LegalSection>

      <LegalSection title="10. Cookies e conteúdo externo">
        <p>As tecnologias locais e o controle do Spotify são detalhados na <Link href="/cookies">Política de Cookies</Link>. A preferência pode ser alterada a qualquer momento pelo link “Gerenciar cookies” no rodapé.</p>
      </LegalSection>

      <LegalSection title="11. Contato e atualizações">
        <p>Para exercer direitos, pedir remoção ou esclarecer esta política, contate: <strong>{contact}</strong>. Para uma possível violação de conteúdo, prefira o formulário de <Link href="/denunciar">denúncia</Link>, que reúne os dados mínimos de análise.</p>
        <p>Alterações materiais receberão uma nova versão. O aceite registrado na publicação permite identificar quais versões foram apresentadas naquela ocasião.</p>
        <p className="rounded-2xl border border-[#ead6dc] bg-[#fff7f9] p-4">A identificação jurídica completa do controlador e a adequação final deste texto ao negócio devem ser revisadas por profissional habilitado; o código não substitui essa revisão.</p>
      </LegalSection>
    </LegalPage>
  );
}
