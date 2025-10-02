export const formMutationDemo = `
screen UserFormPage:
  container:
    # User Form Demo
    > This demonstrates form mutations with data binding inside components.
    
    ## How it works:
    *> 1. UserForm component has inputs with %variable bindings
    *> 2. When instantiated with $UserForm(st://user), it loads data from storage
    *> 3. Submit button saves form data back to storage
    
    $UserForm(st://user-data)
    
    ---
    
    ## View Results
    $UserDisplay(st://user-data)
    
    @[Clear Data](clear-user-data)

component UserForm:
  card:
    ## User Registration
    > Fill out your information below:
    
    ___:Full Name(%name){Enter your name}
    ___:Email Address(%email){your.email@example.com}
    ___:Age(%age){25}
    ___:Bio(%bio){Tell us about yourself}
    
    [X] Subscribe to newsletter (%newsletter)
    [ ] Accept terms and conditions (%terms)
    
    row:
      @[Save User Data](st://user-data)
      @_[Clear Form](clear-form)

component UserDisplay:
  card:
    ## Current User Data
    > **Name:** %name
    > **Email:** %email
    > **Age:** %age years old
    > **Bio:** %bio
    
    > **Newsletter:** %newsletter
    > **Terms Accepted:** %terms
    
    @[Edit User](edit-user)

screen ProductFormPage:
  container:
    # Product Management
    > Manage product inventory with data persistence.
    
    row:
      col:
        $ProductForm(st://product-data)
        
      col:
        $ProductList(st://products-list)

component ProductForm:
  card:
    ## Add Product
    
    ___:Product Name(%name){iPhone 15}
    ___:Price(%price){999.99}
    ___:Category(%category){Electronics}[Electronics | Clothing | Books | Home]
    ___:Description(%description){Product description...}
    
    [ ] In Stock (%inStock)
    [ ] Featured Product (%featured)
    
    @[Add Product](st://products-list)
    @_[Clear Form](clear-product-form)

component ProductList:
  card:
    ## Products Inventory
    > Current products in storage:
    
    list:
      - %name{$%price - %category}[Edit](edit-product)[Delete](delete-product)
    
    *> Add products using the form to see them here.
    
    @_[Clear All Products](clear-products)
`;

/**
 * Complete form example with multiple data sources
 */
export const completeFormExample = `
screen Dashboard:
  container:
    # Complete Data Management Dashboard
    > Comprehensive example showing multiple forms and data sources.
    
    row:
      col:
        $UserSection(st://user-profile)
        
      col:
        $SettingsSection(st://user-settings)
    
    ---
    
    ## Recent Activity
    $ActivityLog(st://activity-log)

component UserSection:
  card:
    ## User Profile
    
    ___:Display Name(%displayName){John Doe}
    ___:Email(%email){john@example.com}
    ___:Job Title(%jobTitle){Software Engineer}
    ___:Company(%company){Tech Corp}
    
    @[Update Profile](st://user-profile)
    @[View Full Profile](profile-view)

component SettingsSection:
  card:
    ## User Settings
    
    [X] Email Notifications (%emailNotifications)
    [X] Push Notifications (%pushNotifications)
    [ ] Marketing Emails (%marketingEmails)
    
    ___:Theme(%theme){Dark}[Light | Dark | Auto]
    ___:Language(%language){English}[English | Spanish | French | German]
    
    @[Save Settings](st://user-settings)
    @_[Reset to Defaults](reset-settings)

component ActivityLog:
  card:
    ## Recent Activity
    > **Last Action:** %lastAction
    > **Timestamp:** %timestamp
    > **Status:** %status
    
    list:
      - Profile updated{%displayName}[View](view-profile)
      - Settings changed{%theme theme}[Undo](undo-settings)
      - Email verified{%email}[Resend](resend-email)
    
    @[Clear Log](st://activity-log)

screen ProfileView:
  container:
    # Complete User Profile
    > Full profile information loaded from storage.
    
    $UserProfileCard(st://user-profile)
    $UserSettingsCard(st://user-settings)
    
    @[Back to Dashboard](Dashboard)
    @[Edit Profile](Dashboard)

component UserProfileCard:
  card:
    # %displayName
    > **Contact Information**
    > Email: %email
    > Company: %company
    > Position: %jobTitle
    
    > **Account Status**
    > Email Notifications: %emailNotifications
    > Marketing: %marketingEmails
    > Theme: %theme
    > Language: %language

component UserSettingsCard:
  card:
    ## Preferences
    > **Notifications**
    > - Email: %emailNotifications
    > - Push: %pushNotifications
    > - Marketing: %marketingEmails
    
    > **Appearance**
    > - Theme: %theme
    > - Language: %language
    
    @[Modify Settings](Dashboard)
`;