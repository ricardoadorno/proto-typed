/**
 * Back Navigation Example
 * Demonstrates how to use the -1 navigation feature to go back to previous screens
 */
const backNavigationExample = `
screen Home:
  col:
    # Tela Principal
    > Bem-vindo ao sistema de navegação com histórico!
    
    @primary[Ir para Página 1](Page1)
    @primary[Ir para Página 2](Page2)
    @primary[Ir para Configurações](Settings)

screen Page1:
  col:
    # Página 1
    > Esta é a primeira página do exemplo.
    
    @primary[Ir para Página 2](Page2)
    @primary[Ir para Configurações](Settings)
    @secondary[Voltar](-1)
    @outline[Ir para Home](Home)

screen Page2:
  col:
    # Página 2
    > Esta é a segunda página do exemplo.
    
    @primary[Ir para Página 1](Page1)
    @primary[Ir para Configurações](Settings)
    @secondary[Voltar](-1)
    @outline[Ir para Home](Home)

screen Settings:
  col:
    # Configurações
    > Página de configurações do sistema.
    
    row:
      ## Opções
      [X] Notificações habilitadas
      [ ] Modo escuro
      [ ] Som ativado
    
    @primary[Ir para Página 1](Page1)
    @primary[Ir para Página 2](Page2)
    @secondary[Voltar](-1)
    @outline[Ir para Home](Home)
`;

export default backNavigationExample;
