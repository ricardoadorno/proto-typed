const headTestExample = `head:
  color:
    primary:  #0047AB
    secondary:#F4C542
    neutral: #1A1A1A
    accent:   #00AEEF

  font:
    base:
      family: Poppins

  template:
    default: $GlobalLayout


component GlobalLayout:
  container:
    header:
      >> Proto-Typed
      >>> Modern UI DSL
    
    stack:
      # Content Here
      > This is the global template


component FeatureCard:
  card:
    stack-tight:
      ## $title
      > $description
      @primary-small[$action](Details)


screen Dashboard:
  header:
    >> Dashboard
    @ghost-icon[i-Menu](MainMenu)
  
  container:
    # Welcome to Proto-Typed
    > Testing the new head configuration system
    
    >>> Custom Colors & Fonts
    
    row-between:
      card-compact:
        >> Primary Color
        >>> #0047AB
      
      card-compact:
        >> Secondary Color
        >>> #F4C542
      
      card-compact:
        >> Accent Color
        >>> #00AEEF
    
    ---
    
    ## Feature Cards
    
    list $FeatureCard:
      - Type Safety | Full TypeScript support | Learn More
      - Hot Reload | Instant feedback | Try Now
      - Theming | Custom color schemes | Customize

  navigator:
    - i-Home | Dashboard
    - i-Settings | Settings
    - i-Info | About

  fab:
    - + | CreateNew


screen Settings:
  header:
    >> Settings
    @ghost-icon[i-ArrowLeft](-1)
  
  container:
    # Application Settings
    > Configure your preferences
    
    card:
      ## Theme Configuration
      
      ___[Primary Color][#0047AB]
      ___[Secondary Color][#F4C542]
      ___[Accent Color][#00AEEF]
      
      stack-tight:
        [X] Use custom theme
        [ ] Dark mode
        [ ] High contrast
      
      row-center:
        @primary[Save Changes](Dashboard)
        @outline[Reset Defaults](Settings)


modal CreateNew:
  card:
    ## Create New Item
    >>> Enter item details
    
    ___[Item Name][Enter name] | required
    ___textarea[Description][Enter description]
    
    row-end:
      @outline[Cancel](CreateNew)
      @primary[Create](Dashboard)


drawer MainMenu:
  stack:
    # Main Menu
    ---
    > [Dashboard](Dashboard)
    > [Settings](Settings)
    > [About](About)
    ---
    @destructive[Logout](Login)


screen About:
  container:
    # About Proto-Typed
    > A modern DSL for rapid UI prototyping
    
    card:
      ## Version Information
      >>> Version: 2.0.0
      >>> Build: HEAD configuration system
      >>> Author: Proto-Typed Team
      
      stack-tight:
        >> Features:
        >>> ✓ Hierarchical head configuration
        >>> ✓ Custom color schemes
        >>> ✓ Font customization
        >>> ✓ Template system
        >>> ✓ Component composition
      
      > [Back to Dashboard](Dashboard)
`

export default headTestExample
