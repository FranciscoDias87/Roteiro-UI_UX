import { Question } from './types';

export const questions: Question[] = [
  {
    id: 1,
    topic: "Direitos Autorais e Proteção de Marca",
    text: "O comitê organizador das Olimpíadas de Tóquio 2020 enfrentou uma grave crise quando o logotipo oficial desenhado para o evento foi acusado de ser um plágio do emblema do Théâtre de Liège, localizado na Bélgica. Após forte pressão, o logotipo japonês precisou ser descartado e refeito. Esse episódio demonstrou ao mercado criativo que:",
    options: {
      A: "Alegações de plágio em eventos esportivos não são investigadas e não geram consequências financeiras.",
      B: "A legislação de direitos autorais só possui validade territorial e não gera punições para organizações de outros continentes.",
      C: "O plágio e a violação de direitos autorais têm repercussões internacionais severas, impactando não apenas no âmbito legal, mas também na reputação da marca.",
      D: "Logotipos formados por formas geométricas não recebem nenhum tipo de proteção do direito autoral internacionalmente.",
      E: "Designers contratados por comitês globais são isentos de obrigações autorais em caso de semelhanças com obras anteriores."
    },
    correctOption: "C",
    explanation: "O caso do logotipo de Tóquio 2020 ilustra perfeitamente que o plágio no design tem repercussões severas em escala global. Além das graves e caras consequências legais, o dano à reputação de marcas institucionais e patrocinadores é enorme, afetando a credibilidade do projeto de forma permanente e exigindo o descarte e retrabalho completo."
  },
  {
    id: 2,
    topic: "Propriedade Intelectual e Proteção Visual",
    text: "Um fotógrafo especializado em eventos corporativos decidiu publicar algumas de suas melhores fotos em seu portfólio online. Antes de subir os arquivos, ele inseriu seu logotipo de forma semitransparente no centro de todas as imagens. Essa técnica, conhecida como inserção de marca d'água, tem como principal finalidade:",
    options: {
      A: "Aumentar artificialmente a resolução e a nitidez da imagem digital no site.",
      B: "Reduzir o peso do arquivo em megabytes para facilitar o carregamento rápido na web.",
      C: "Ajustar o contraste fotográfico e tornar a imagem visualmente mais atraente e profissional.",
      D: "Atender a uma exigência técnica obrigatória dos servidores de hospedagem.",
      E: "Identificar a autoria da obra visualmente e inibir o uso não autorizado da imagem por terceiros."
    },
    correctOption: "E",
    explanation: "A marca d'água semitransparente serve para indicar a autoria de uma obra de forma visível e permanente diretamente no arquivo, desestimulando cópias piratas ou publicações não autorizadas. Embora não impeça fisicamente o download, ela inibe significativamente o uso comercial impróprio."
  },
  {
    id: 3,
    topic: "Identidade de Marca e Experiência do Usuário (UX)",
    text: "Durante uma reunião de desenvolvimento de um novo aplicativo de finanças, parte da equipe sugeriu copiar integralmente a interface do principal concorrente para economizar tempo. A liderança de UI/UX foi contra, defendendo a criação de um design único. Nesse contexto, a originalidade é fundamental porque:",
    options: {
      A: "Assegura que o aplicativo terá uma estética com cores mais vibrantes.",
      B: "Elimina por completo a necessidade de realizar testes de usabilidade com os usuários.",
      C: "Substitui a necessidade de planejar a arquitetura de informação do sistema.",
      D: "Diferencia o produto no mercado, fortalece a identidade da marca e melhora a experiência específica do seu público-alvo.",
      E: "Garante que o aplicativo consumirá menos processamento nos dispositivos móveis."
    },
    correctOption: "D",
    explanation: "A originalidade no design estratégico não serve apenas para beleza. Ela é a identidade do produto frente aos concorrentes no mercado, atua na credibilidade da marca e garante que a interface seja projetada especificamente para o público e as demandas desse produto, ao invés de tentar herdar a solução dos outros."
  },
  {
    id: 4,
    topic: "Princípios de Design C-R-A-P",
    text: "Durante a avaliação de uma nova interface web para a biblioteca do CETI Moisaniel Alves de Sousa, o designer responsável percebeu que textos importantes não se destacavam em relação à cor de fundo da tela, tornando a leitura difícil. Além disso, elementos que possuíam exatamente a mesma função de busca apresentavam aparências totalmente diferentes em páginas distintas. De acordo com os princípios de design visual conhecidos pelo acrônimo C-R-A-P, quais conceitos estão sendo negligenciados neste projeto, respectivamente?",
    options: {
      A: "Contraste e Repetição.",
      B: "Alinhamento e Proximidade.",
      C: "Repetição e Proximidade.",
      D: "Contraste e Alinhamento.",
      E: "Proximidade e Contraste."
    },
    correctOption: "A",
    explanation: "A falta de destaque entre o texto e o fundo prejudica a legibilidade, tratando-se de uma falha direta de Contraste. Já o fato de elementos com funções idênticas (como as barras de busca) terem aparências totalmente desconexas em páginas diferentes viola a Repetição, princípio que garante consistência visual e previsibilidade ao usuário através de padrões reutilizáveis."
  },
  {
    id: 5,
    topic: "Heurísticas de Interface",
    text: "Avalie as afirmações abaixo sobre Visibilidade, Familiaridade e Intuição na avaliação de um produto digital e classifique-as como Verdadeiras (V) ou Falsas (F).\n\n( ) Um design intuitivo convida o usuário à ação de maneira instintiva, sem que ele precise gastar muito tempo estudando o layout.\n( ) A visibilidade assegura que os botões mais cruciais fiquem bem ocultos para não 'poluir' a interface e testar a perspicácia do usuário.\n( ) Construir consistência promove um sentimento de familiaridade no usuário, o que simplifica a experiência de navegação e reduz erros.\n\nA sequência correta é:",
    options: {
      A: "F – V – F",
      B: "F – F – V",
      C: "V – F – V",
      D: "V – V – F",
      E: "F – V – V"
    },
    correctOption: "C",
    explanation: "1- Verdadeira: O design intuitivo aproveita modelos mentais prévios do usuário para guiar a ação. \n2- Falsa: A visibilidade exige que informações e ações cruciais fiquem de fácil alcance e visíveis aos olhos do usuário; escondê-las gera barreiras e erros. \n3- Verdadeira: A familiaridade gerada por padrões consistentes reduz consideravelmente a curva de aprendizado."
  },
  {
    id: 6,
    topic: "Evolução do Design e Psicologia Cognitiva",
    text: "Considere os estudos de Boas e Más Práticas no design (observando o impacto temporal em portais clássicos da internet) e assinale verdadeiro (V) ou falso (F):\n\n( ) Ferramentas que resgatam versões antigas de sites revelam que o design de interface é estático e suas regras permaneceram imutáveis nos últimos 10 anos.\n( ) Plataformas digitais amplamente utilizadas focam hoje na redução de barreiras cognitivas, organizando catálogos extensos em divisões lógicas e bem espaçadas.\n( ) A psicologia das cores é uma prática ultrapassada, sendo o uso de cores vibrantes puramente voltado a chamar a atenção sem significados secundários.\n\nA alternativa correta, de cima para baixo, é:",
    options: {
      A: "V – F – V",
      B: "F – V – F",
      C: "V – V – F",
      D: "F – F – V",
      E: "V – F – F"
    },
    correctOption: "B",
    explanation: "1- Falsa: O design é altamente dinâmico e evolui com os dispositivos, melhorando UX ano a ano. \n2- Verdadeira: Organizar e espaçar dados ajuda a economizar processamento mental do usuário (barreira cognitiva). \n3- Falsa: A psicologia das cores é crucial e ativa hoje em dia (vermelhos para erros/urgência, verdes para sucesso, etc.), e não é apenas um adereço estético."
  },
  {
    id: 7,
    topic: "Coesão Visual e Semiótica",
    text: "Ao analisar as boas práticas do aplicativo educacional Duolingo, um aluno observou que ações rotineiras, como acessar configurações através de um ícone de 'engrenagem', dispensam longos parágrafos explicativos. Sobre o uso estratégico de ícones e cores nesse tipo de plataforma, assinale a alternativa correta:",
    options: {
      A: "A coesão visual afasta o público alvo por tornar o sistema muito infantil, exigindo que aplicativos sérios usem apenas textos densos.",
      B: "O uso consistente de ícones cria uma identidade facilmente reconhecível, eliminando a necessidade de descrições excessivas e permitindo uma navegação intuitiva.",
      C: "As cores são escolhidas de forma totalmente aleatória, já que a psicologia da cor é ineficaz para promover a concentração e o aprendizado.",
      D: "Ícones e desenhos só são eficientes se vierem obrigatoriamente acompanhados de extensos guias de usabilidade na página inicial.",
      E: "Identidades visuais sólidas não possuem impacto prático na memorização, servindo apenas para encarecer o processo de desenvolvimento."
    },
    correctOption: "B",
    explanation: "Ícones consagram convenções universais do nosso dia a dia (como a engrenagem, a lupa, a casinha). A consistência de ícones estabelece uma navegação onde o cérebro interpreta instantaneamente as opções, dispensando textos prolixos e melhorando o fluxo de e-learning."
  },
  {
    id: 8,
    topic: "Princípios de UI e UX",
    text: "Em uma equipe de alunos do curso técnico de Desenvolvimento de Sistemas que elabora um PDV (Ponto de Venda) com bancos de dados relacionais, João ficou com a responsabilidade de criar a identidade visual, definir botões e tipografia. Já Maria mapeou a jornada do usuário e garantiu que as telas fluam logicamente para que os lojistas cadastrem vendas de forma rápida. Analisando a intersecção entre UI e UX, é correto afirmar que:",
    options: {
      A: "João atua estritamente em UX (User Experience), enquanto Maria trabalha na camada de UI (User Interface).",
      B: "João e Maria exercem papéis idênticos na programação lógica do sistema, visto que UI e UX não lidam com aspectos visuais ou de jornada.",
      C: "João atua focado na Interface do Usuário (UI), moldando o design visual, ao passo que Maria concentra-se na Experiência do Usuário (UX), estruturando a funcionalidade e o fluxo.",
      D: "Ambos estão executando tarefas exclusivas de backend, e as nomenclaturas UI e UX são irrelevantes para o sucesso do PDV.",
      E: "UI refere-se à etapa de pesquisa de usuários reais, enquanto UX é a fase onde a paleta de cores é inserida no código."
    },
    correctOption: "C",
    explanation: "João lida com a camada visual (User Interface - UI), definindo guias de cores, tipografia e formato final de botões. Maria lida com a jornada de uso e lógica de navegação (User Experience - UX), que garante que o lojista encontre botões de fluxo de forma fluida, rápida e sem atritos cognitivos."
  },
  {
    id: 9,
    topic: "Processo Iterativo e Trabalho em Equipe",
    text: "Sobre as iterações e a rotina do papel do designer de UX/UI, julgue as asserções a seguir com (V) para Verdadeiras e (F) para Falsas.\n\n( ) O processo criativo do design é iterativo, significando que o profissional está em constante fase de repetição, revisão e adaptação a partir de falhas.\n( ) O trabalho em equipe entre designers e outros especialistas é altamente recomendado e vital para o sucesso produtivo.\n( ) Um bom designer deve ignorar as opiniões dos usuários, pois ouvir críticas costuma atrasar as fases do projeto.\n\nA sequência correspondente é:",
    options: {
      A: "V - V - F",
      B: "F - F - V",
      C: "V - F - V",
      D: "V - F - F",
      E: "F - V – F"
    },
    correctOption: "A",
    explanation: "O design moderno é totalmente focado nas necessidades do usuário (User-Centered Design). Logo, ignorar sua opinião ou crítica seria anular o próprio objetivo do processo UX. O design requer iterações refinadas por feedback real e trabalho interdisciplinar com desenvolvedores e stakeholders."
  },
  {
    id: 10,
    topic: "Elementos Básicos do Design",
    text: "A equipe de design do portal de notícias local 'Na Boca do Povo' está reformulando seu site para dispositivos móveis. Eles optaram por usar traços grossos para separar cadernos de notícias e linhas onduladas para sugerir dinamismo na área de entretenimento. Em relação aos elementos básicos do design, qual é a função prática principal da 'Linha' nesse contexto?",
    options: {
      A: "Subordinar a tipografia do sistema, definindo a codificação de texto a ser renderizada.",
      B: "Atuar como elemento de escala fotográfica para calcular o tamanho e resolução de mídias pesadas.",
      C: "Ser puramente decorativa, sem nenhuma função de orientação estrutural em projetos voltados para jornalismo.",
      D: "Servir como o esqueleto do layout, transmitindo ordem ou movimento, além de guiar ativamente o olhar do observador.",
      E: "Determinar qual textura será sentida no toque físico da tela do celular pelo usuário."
    },
    correctOption: "D",
    explanation: "As linhas delimitam áreas, criam subdivisões estruturadas e servem para direcionar a leitura do olho humano pela página. Linhas retas e grossas denotam estabilidade, peso e separação firme de tópicos sérios, enquanto as onduladas ou curvas acrescentam fluidez e sentimentos de entretenimento."
  }
];
