// Barrel export for all examples
import login from './login'
import todoListExample from './todo-list'
import notesAppExample from './notes-app'
import weatherAppExample from './weather-app'
import contactsAppExample from './contacts-app'
import headTestExample from './head-test'

// Example configuration for UI
// Ordered from simplest to most complex
export const exampleConfigs = [
  { label: 'Login', code: login },
  { label: 'Todo List', code: todoListExample },
  { label: 'Notes App', code: notesAppExample },
  { label: 'Weather', code: weatherAppExample },
  { label: 'Contacts', code: contactsAppExample },
  { label: 'Advanced', code: headTestExample },
]
