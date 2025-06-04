/**
 * Back Navigation Example
 * Demonstrates how to use the -1 navigation feature to go back to previous screens
 */

export const backNavigationExample = `
@screen Home:
  col:
    # Tela Principal
    > Bem-vindo ao sistema de navegação com histórico!
    
    @[Ir para Página 1](Page1)
    @[Ir para Página 2](Page2)
    @[Ir para Configurações](Settings)

@screen Page1:
  col:
    # Página 1
    > Esta é a primeira página do exemplo.
    
    @[Ir para Página 2](Page2)
    @[Ir para Configurações](Settings)
    @[Voltar](-1)
    @[Ir para Home](Home)

@screen Page2:
  col:
    # Página 2
    > Esta é a segunda página do exemplo.
    
    @[Ir para Página 1](Page1)
    @[Ir para Configurações](Settings)
    @[Voltar](-1)
    @[Ir para Home](Home)

@screen Settings:
  col:
    # Configurações
    > Página de configurações do sistema.
    
    row:
      ## Opções
      [X] Notificações habilitadas
      [ ] Modo escuro
      [ ] Som ativado
    
    @[Ir para Página 1](Page1)
    @[Ir para Página 2](Page2)
    @[Voltar](-1)
    @[Ir para Home](Home)
`;

/**
 * Advanced Back Navigation Example with Modal
 * Shows how back navigation works with modals and drawers
 */
export const advancedBackNavigationExample = `
@screen MainApp:
  col:
    # App Principal
    > Demonstração avançada de navegação com histórico
    
    row:
      @[Abrir Menu](toggleDrawer())
      @[Configurações](SettingsPage)
      @[Perfil](ProfilePage)
    
    row:
      ## Conteúdo Principal
      > Este é o conteúdo da página principal.
      
      @[Abrir Modal](ModalExample)

@screen SettingsPage:
  col:
    # Configurações Avançadas
    > Página de configurações com mais opções.
    
    grid:
      card:
        ## Geral
        [X] Notificações push
        [ ] Auto-sync
        ___:Nome do usuário(Digite seu nome)
      
      card:
        ## Aparência
        ( ) Tema claro
        (X) Tema escuro
        ( ) Automático
    
    row:
      @[Salvar](SaveSettings)
      @[Cancelar](-1)
      @[Voltar para Main](MainApp)

@screen ProfilePage:
  col:
    # Meu Perfil
    > Informações do usuário
    
    card:
      avatar {src: https://via.placeholder.com/100}
      ## João Silva
      > Desenvolvedor Frontend
      
      ___:Email(joao@email.com)
      ___:Telefone(+55 11 99999-9999)
    
    row:
      @[Editar Perfil](EditProfile)
      @[Voltar](-1)

@screen EditProfile:
  col:
    # Editar Perfil
    > Altere suas informações pessoais
    
    ___:Nome completo(João Silva)
    ___:Email(joao@email.com)
    ___:Telefone(+55 11 99999-9999)
    ___:Bio(Desenvolvedor Frontend apaixonado por tecnologia)
    
    row:
      @[Salvar Alterações](SaveProfile)
      @[Cancelar](-1)

modal ModalExample:
  ## Modal de Exemplo
  > Este é um modal que pode ser fechado voltando na navegação.
  
  > Conteúdo do modal aqui...
  
  row:
    @[Fechar](-1)
    @[Ir para Settings](SettingsPage)

drawer MainDrawer:
  ## Menu Principal
  
  list:
    - @[Home](MainApp)
    - @[Configurações](SettingsPage)
    - @[Perfil](ProfilePage)
    - @[Sobre](AboutPage)
  
  @[Fechar Menu](-1)

@screen AboutPage:
  col:
    # Sobre o App
    > Informações sobre o aplicativo
    
    card:
      ## Versão 1.0.0
      > Aplicativo de demonstração de navegação com histórico
      
      > Desenvolvido com React e TypeScript
    
    @[Voltar](-1)
    @[Ir para Home](MainApp)
`;
