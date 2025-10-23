import { ExampleCategory } from '../types'

/**
 * Form and input component examples covering all input types and validation states
 */
export const formExamples: ExampleCategory = {
  title: 'Form Elements',
  examples: [
    {
      name: 'Text Inputs',
      code: `screen TextInputExample:
  # User Information Form
  ___:Username{Enter your username}
  ___:Email{user@example.com}
  ___*:Password{Enter secure password}
  ___*:Confirm Password{Confirm your password}
  ___-:User ID{12345}`,
      description:
        'Create various text input fields with labels and placeholders. Use ___* for password fields and ___- for disabled fields',
    },
    {
      name: 'Select Dropdowns',
      code: `screen SelectExample:
  # Selection Fields
  ___:Country{Select your country}[USA | Canada | Mexico | Brazil]
  ___:Language{Choose language}[English | Spanish | French | Portuguese]
  ___:Priority{Set priority}[Low | Medium | High | Critical]
  ___-:Status{Current status}[Active | Inactive | Pending]`,
      description:
        'Create dropdown select menus with pipe-separated options. Use ___- for disabled select fields',
    },
    {
      name: 'Checkboxes',
      code: `screen CheckboxExample:
  # Preferences
  [X] Enable notifications
  [X] Auto-save documents
  [ ] Share usage analytics
  [ ] Receive newsletter
  [ ] Beta features access`,
      description:
        'Create checkboxes with checked [X] or unchecked [ ] states for multiple selections',
    },
    {
      name: 'Radio Buttons',
      code: `screen RadioExample:
  # Account Type
  (X) Personal Account
  ( ) Business Account
  ( ) Enterprise Account
  
  # Theme Preference
  ( ) Light Theme
  (X) Dark Theme
  ( ) Auto Theme`,
      description:
        'Create radio button groups where only one option can be selected. Use (X) for selected and ( ) for unselected',
    },
    {
      name: 'Complete Form',
      code: `screen CompleteFormExample:
  # Registration Form
  ___:Full Name{Enter your full name}
  ___:Email{your.email@example.com}
  ___*:Password{Create strong password}
  ___:Company{Company name (optional)}
  ___:Role{Select role}[Developer | Designer | Manager | Other]
  
  ## Preferences
  [X] Email notifications
  [ ] SMS notifications
  [X] Product updates
  
  ## Account Type
  (X) Free Account
  ( ) Pro Account
  ( ) Enterprise Account
  
  @[Create Account](submit)
  @_[Cancel](cancel)`,
      description:
        'A comprehensive form example combining all input types with proper organization',
    },
  ],
}

export default formExamples
