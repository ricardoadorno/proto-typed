const contactsAppExample = `screen ContactsList:
  header:
    > Lista de Contatos
    @[☰](MainDrawer)

  col:
    > Seus contatos estão organizados aqui
    
    card:
      > João Silva
      > (11) 99999-9999
      > joao@email.com
      row:
        @[✏️](EditContact)
        @[🗑️](ConfirmDelete)
    
    card:
      > Maria Santos
      > (11) 88888-8888
      > maria@email.com
      row:
        @[✏️](EditContact)
        @[🗑️](ConfirmDelete)
    
    card:
      > Pedro Oliveira
      > (11) 77777-7777
      > pedro@email.com
      row:
        @[✏️](EditContact)
        @[🗑️](ConfirmDelete)
    
    card:
      > Ana Costa
      > (11) 66666-6666
      > ana@email.com
      row:
        @[✏️](EditContact)
        @[🗑️](ConfirmDelete)


modal CreateContact:
    # Novo Contato
    
    ___:Nome{Digite o nome}
    ___:Telefone{(11) 99999-9999}
    ___:Email{email@exemplo.com}
    
    row:
      @[Cancelar](ContactsList)
      @[Salvar](ContactsList)

modal EditContact:
    # Editar Contato
    
    ___:Nome{João Silva}
    ___:Telefone{(11) 99999-9999}
    ___:Email{joao@email.com}
    
    row:
      @[Cancelar](ContactsList)
      @[Salvar](ContactsList)

modal ConfirmDelete:
    # Confirmar Exclusão
    > Tem certeza que deseja excluir este contato?
    
    *> Esta ação não pode ser desfeita.
    
    row:
      @[Cancelar](ContactsList)
      @[Excluir](ContactsList)

drawer MainDrawer:
  # Menu
  
  drawer_item [Contatos]{👥}(ContactsList)
  drawer_item [Favoritos]{⭐}(Favorites)
  drawer_item [Grupos]{👨‍👩‍👧‍👦}(Groups)
  drawer_item [Configurações]{⚙️}(Settings)
  
  > ────────────────
  
  drawer_item [Sobre]{ℹ️}(About)
  drawer_item [Ajuda]{❓}(Help)

screen Favorites:
  header:
    > Favoritos
    @[☰](MainDrawer)

  col:
    *> Nenhum contato favoritado ainda
    
    > Adicione contatos aos favoritos tocando na estrela ao lado do nome.

screen Groups:
  header:
    > Grupos
    @[☰](MainDrawer)

  col:
    > Organize seus contatos em grupos
    
    card:
      > Família
      > "5 contatos"
    
    card:
      > Trabalho
      > "12 contatos"
    
    card:
      > Amigos
      > "8 contatos"

screen Settings:
  header:
    > Configurações
    @[☰](MainDrawer)

  col:
    # Configurações da Conta
    
    list:
      - Sincronização
      - Backup automático
      - Importar contatos
      - Exportar contatos
    
    # Aparência
    
    list:
      - Tema escuro
      - Tamanho da fonte
      - Idioma

screen About:
  header:
    > Sobre
    @[☰](MainDrawer)

  col:
    # Contatos App
    
    > Versão 1.0.0
    
    > Desenvolvido para gerenciar seus contatos de forma simples e eficiente.
    
    *> © 2025 Todos os direitos reservados

screen Help:
  header:
    > Ajuda
    @[☰](MainDrawer)

  col:
    # Como usar
    
    card:
      > ## Adicionar contato
      > Toque no botão + para criar um novo contato
    
    card:
      > ## Editar contato
      > Toque no ícone de edição ao lado do contato
    
    card:
      > ## Excluir contato
      > Toque no ícone da lixeira e confirme a exclusão
    
    card:
      > ## Organizar em grupos
      > Acesse a seção Grupos no menu lateral
`;

export default contactsAppExample;