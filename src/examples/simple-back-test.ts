/**
 * Teste Simples de Navegação de Volta
 * Exemplo básico para demonstrar a funcionalidade -1 
 */

const simpleBackTest = `
@screen Inicio:
  container:
    # 🏠 Página Inicial
    > Esta é a página inicial do teste de navegação.
    
    card:
      ## Como testar:
      > 1. Clique em "Página A" ou "Página B"
      > 2. Na próxima tela, clique em "Voltar (-1)"
      > 3. Você voltará para esta tela
    
    row:
      @[Ir para Página A](PaginaA)
      @[Ir para Página B](PaginaB)

@screen PaginaA:
  container:
    # 📄 Página A
    > Você está na Página A.
    
    card:
      ## Teste de Navegação
      > Clique em "Voltar (-1)" para retornar à página anterior.
      > Ou navegue para outras páginas para criar mais histórico.
    
    row:
      @[Voltar](-1)
      @[Ir para Página B](PaginaB)
      @[Ir para Início](Inicio)

@screen PaginaB:
  container:
    # 📋 Página B
    > Você está na Página B.
    
    card:
      ## Teste Avançado
      > Navegue entre as páginas e use sempre o botão "Voltar (-1)".
      > O sistema mantém o histórico de navegação automaticamente.
    
    row:
      @[Voltar](-1)
      @[Ir para Página A](PaginaA)
      @[Ir para Início](Inicio)
`;

export default simpleBackTest;
