import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { getLegalContactLabel } from "@/lib/legal/contact";
import { LEGAL_EFFECTIVE_DATE_LABEL, LEGAL_VERSIONS } from "@/lib/legal/config";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Termos de Uso",
  description: "Regras para criar, publicar e compartilhar cartinhas no Minha Cartinha.",
  path: "/termos",
});

export default function TermsPage() {
  const contact = getLegalContactLabel();
  return (
    <LegalPage eyebrow="Informações legais" title="Termos de Uso" intro="Estes termos explicam, em linguagem direta, como funciona o Minha Cartinha e quais cuidados são necessários ao criar uma experiência que pode incluir dados, imagens e histórias de outras pessoas." version={`${LEGAL_VERSIONS.terms} — vigente desde ${LEGAL_EFFECTIVE_DATE_LABEL}`}>
      <LegalSection title="1. O serviço">
        <p>O Minha Cartinha permite criar e compartilhar, por um endereço exclusivo, cartinhas digitais personalizadas com textos, fotos, datas, música e recursos interativos disponíveis no editor, como Quiz do Casal, Vales do Amor e Roleta do Amor.</p>
        <p>Não é necessário criar uma conta. O navegador recebe uma credencial técnica para recuperar e editar o rascunho daquele dispositivo. O link da cartinha deve ser compartilhado apenas com as pessoas escolhidas pelo usuário.</p>
      </LegalSection>

      <LegalSection title="2. Gratuito e Premium">
        <p>A modalidade gratuita inclui os recursos indicados no editor e, atualmente, mantém a cartinha publicada por 2 dias. A modalidade Premium custa <strong>R$ 7,90 por cartinha</strong>, em pagamento único, e libera o conjunto de recursos Premium para aquela cartinha. Não se trata de assinatura.</p>
        <p>O pagamento é processado por Pix por meio do Mercado Pago. A liberação depende da confirmação do provedor. Um Pix pendente, expirado, rejeitado ou cancelado não libera os recursos Premium. As condições apresentadas no checkout prevalecem se a operação não puder ser concluída.</p>
        <p>15% dos ganhos do Minha Cartinha são destinados a instituições que ajudam animais de rua. Valores destinados e repasses efetivamente realizados são informações diferentes e podem ser consultados na página de <Link href="/transparencia">Transparência</Link>.</p>
      </LegalSection>

      <LegalSection title="3. Responsabilidade por conteúdo e autorizações">
        <p>Quem cria a cartinha declara que tem os direitos, permissões e autorizações necessários para enviar, publicar e compartilhar os textos, imagens, nomes, datas, dados e demais conteúdos utilizados, inclusive quando dizem respeito a terceiros.</p>
        <p>Antes de usar a imagem, dados pessoais ou conteúdo de outra pessoa, o usuário deve considerar a expectativa de privacidade dessa pessoa e obter autorização quando necessária. O Minha Cartinha não verifica previamente cada relação, autoria ou consentimento entre as pessoas retratadas.</p>
      </LegalSection>

      <LegalSection title="4. Conteúdo proibido">
        <p>Não é permitido usar o serviço para publicar:</p>
        <ul>
          <li>conteúdo ilegal, fraudulento, ameaçador, de assédio ou de discurso de ódio;</li>
          <li>dados pessoais expostos sem fundamento ou autorização adequada;</li>
          <li>obras, fotografias ou outros materiais que violem direitos autorais;</li>
          <li>imagem de terceiros usada de modo indevido;</li>
          <li>conteúdo íntimo ou sexual divulgado sem consentimento;</li>
          <li>qualquer conteúdo cuja divulgação viole direitos de terceiros.</li>
        </ul>
        <p>Também são proibidas tentativas de fraudar pagamentos, contornar limites, acessar cartinhas ou credenciais alheias, sobrecarregar o serviço, introduzir código malicioso ou explorar vulnerabilidades.</p>
      </LegalSection>

      <LegalSection title="5. Propriedade e licença limitada">
        <p>O usuário continua sendo titular de seus textos, fotos e demais conteúdos. Nenhuma disposição destes termos transfere a propriedade desse material ao Minha Cartinha.</p>
        <p>Para executar o serviço, o usuário concede somente uma autorização limitada, não exclusiva e vinculada à finalidade de <strong>armazenar, processar, exibir e transmitir</strong> o conteúdo para montar, disponibilizar e entregar a cartinha e seus recursos relacionados. Essa autorização dura enquanto o conteúdo precisar ser mantido para a prestação do serviço ou para o cumprimento de obrigações aplicáveis.</p>
        <p>A marca, identidade visual, código, interfaces e elementos próprios do Minha Cartinha permanecem protegidos pela legislação de propriedade intelectual. O uso do serviço não concede licença para copiar ou explorar esses elementos fora da finalidade normal da plataforma.</p>
      </LegalSection>

      <LegalSection title="6. Compartilhamento e acesso">
        <p>Cartinhas são acessadas por link com identificador difícil de adivinhar e ficam configuradas para não serem indexadas por mecanismos de busca. Ainda assim, um link pode ser encaminhado por quem o recebe. O modelo de acesso por link não equivale a um cofre, autenticação por senha ou garantia absoluta de confidencialidade.</p>
        <p>O usuário é responsável por escolher os destinatários e por não publicar dados cujo risco de exposição seja incompatível com esse modo de compartilhamento.</p>
      </LegalSection>

      <LegalSection title="7. Disponibilidade, moderação e remoção">
        <p>Podem ocorrer interrupções por manutenção, falhas de terceiros, segurança ou eventos fora do controle razoável. Buscamos preservar o serviço, mas não prometemos disponibilidade ininterrupta nem permanência eterna da plataforma.</p>
        <p>Conteúdos podem ser suspensos, limitados ou removidos quando houver indícios de violação destes termos, risco a pessoas, ordem de autoridade ou necessidade de proteger direitos. Solicitações podem ser apresentadas em <Link href="/denunciar">Denunciar conteúdo</Link> e serão analisadas conforme as informações disponíveis, sem promessa de resultado automático.</p>
      </LegalSection>

      <LegalSection title="8. Cancelamento e reembolso">
        <p>Pedidos relacionados a cancelamento, arrependimento ou reembolso serão avaliados conforme o Código de Defesa do Consumidor e demais normas aplicáveis, considerando a data da compra, o início da execução do serviço digital, o uso dos recursos e as circunstâncias do caso.</p>
        <p>Estes termos não excluem o direito de arrependimento quando ele for legalmente aplicável, nem direitos decorrentes de falha na prestação. Para solicitar análise, use o contato indicado ao final e informe dados suficientes para localizar a compra, sem enviar senhas ou credenciais.</p>
      </LegalSection>

      <LegalSection title="9. Privacidade e segurança">
        <p>O tratamento de dados é explicado na <Link href="/privacidade">Política de Privacidade</Link>. O usuário deve preservar a credencial de edição guardada no navegador e evitar usar dispositivos compartilhados para conteúdo sensível.</p>
      </LegalSection>

      <LegalSection title="10. Alterações destes termos">
        <p>Estes termos podem ser atualizados para refletir mudanças relevantes no serviço ou na legislação. Cada versão possui uma data. No momento da publicação, a cartinha registra a versão dos Termos e da Política de Privacidade aceita pelo usuário. Mudanças materiais serão apresentadas de forma adequada para novos aceites quando necessário.</p>
      </LegalSection>

      <LegalSection title="11. Lei aplicável e contato">
        <p>Aplicam-se as leis da República Federativa do Brasil, inclusive o Código de Defesa do Consumidor e o Marco Civil da Internet quando pertinentes. Fica preservado o foro assegurado ao consumidor pela legislação aplicável.</p>
        <p>Contato responsável: <strong>{contact}</strong>.</p>
        <p className="rounded-2xl border border-[#ead6dc] bg-[#fff7f9] p-4">Este documento foi elaborado a partir do funcionamento identificado no projeto e não substitui revisão jurídica profissional, especialmente quanto à identificação formal do responsável pelo serviço.</p>
      </LegalSection>
    </LegalPage>
  );
}
