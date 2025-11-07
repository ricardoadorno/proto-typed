/**
 * Exemplo prático de uso do Redeemer
 *
 * Este arquivo demonstra como converter DSL para componentes React/shadcn
 */

import { parseAndBuildAST } from '../src/core/parser/parse-and-build-ast';
import { astToReactComponent } from '../src/core/redeemer/ast-to-react-component';

// ============================================================================
// Exemplo 1: Formulário de Login Simples
// ============================================================================

const loginFormDSL = `
Screen "Login"
  Layout container-narrow
    Layout stack
      Heading 1 "Welcome Back"
      Paragraph "Please sign in to continue"

      Input "Email" placeholder="you@example.com"
      Input "Password" placeholder="••••••••" password=true

      Layout row-between
        Checkbox "Remember me"
        Link "Forgot password?" @forgot-password

      Button "Sign In" primary i-log-in

      Separator

      Layout row-center
        Text "Don't have an account?"
        Link "Sign up" @register
`;

console.log('='.repeat(80));
console.log('EXEMPLO 1: Formulário de Login');
console.log('='.repeat(80));

try {
  const loginAST = parseAndBuildAST(loginFormDSL);
  const loginReact = astToReactComponent(loginAST, {
    componentName: 'LoginScreen',
    isClientComponent: true
  });

  console.log(loginReact);
} catch (error) {
  console.error('Error parsing login form:', error);
}

console.log('\n\n');

// ============================================================================
// Exemplo 2: Dashboard com Cards e Grid
// ============================================================================

const dashboardDSL = `
Screen "Dashboard"
  Layout container
    Layout header
      Heading 2 "Dashboard"
      Button "New Project" primary i-plus

    Layout grid-3
      Layout card
        Heading 3 "Total Users"
        Text "1,234"
        MutedText "+12% from last month"

      Layout card
        Heading 3 "Revenue"
        Text "$45,678"
        MutedText "+8% from last month"

      Layout card
        Heading 3 "Active Projects"
        Text "89"
        MutedText "+23% from last month"

    Layout stack
      Heading 3 "Recent Activity"
      List
        - Text "John Doe updated Project Alpha"
        - Text "Jane Smith created new task"
        - Text "Mike Johnson closed 3 issues"
`;

console.log('='.repeat(80));
console.log('EXEMPLO 2: Dashboard');
console.log('='.repeat(80));

try {
  const dashboardAST = parseAndBuildAST(dashboardDSL);
  const dashboardReact = astToReactComponent(dashboardAST, {
    componentName: 'DashboardScreen',
    isClientComponent: true
  });

  console.log(dashboardReact);
} catch (error) {
  console.error('Error parsing dashboard:', error);
}

console.log('\n\n');

// ============================================================================
// Exemplo 3: Modal de Configurações
// ============================================================================

const settingsModalDSL = `
Modal "Settings"
  Heading 2 "User Settings"

  Layout stack
    Input "Display Name" placeholder="John Doe"
    Input "Email" placeholder="john@example.com"

    Select "Theme" options=["Light", "Dark", "System"]
    Select "Language" options=["English", "Spanish", "French"]

    Separator

    Layout stack-tight
      Heading 4 "Notifications"
      Checkbox "Email notifications"
      Checkbox "Push notifications"
      Checkbox "SMS notifications"

    Separator

    Layout row-between
      Button "Cancel" secondary
      Button "Save Changes" primary i-check
`;

console.log('='.repeat(80));
console.log('EXEMPLO 3: Modal de Configurações');
console.log('='.repeat(80));

try {
  const settingsAST = parseAndBuildAST(settingsModalDSL);
  const settingsReact = astToReactComponent(settingsAST, {
    componentName: 'SettingsModal',
    isClientComponent: true
  });

  console.log(settingsReact);
} catch (error) {
  console.error('Error parsing settings modal:', error);
}

console.log('\n\n');

// ============================================================================
// Exemplo 4: Drawer de Navegação
// ============================================================================

const navDrawerDSL = `
Drawer "Navigation"
  Heading 3 "Menu"

  Layout stack
    Link "Dashboard" @dashboard i-home
    Link "Projects" @projects i-folder
    Link "Team" @team i-users
    Link "Settings" @settings i-settings

    Separator

    Link "Documentation" https://docs.example.com
    Link "Support" https://support.example.com

    Separator

    Button "Logout" danger i-log-out
`;

console.log('='.repeat(80));
console.log('EXEMPLO 4: Drawer de Navegação');
console.log('='.repeat(80));

try {
  const drawerAST = parseAndBuildAST(navDrawerDSL);
  const drawerReact = astToReactComponent(drawerAST, {
    componentName: 'NavigationDrawer',
    isClientComponent: true
  });

  console.log(drawerReact);
} catch (error) {
  console.error('Error parsing drawer:', error);
}

console.log('\n\n');

// ============================================================================
// Exemplo 5: Formulário Complexo de Cadastro
// ============================================================================

const signupFormDSL = `
Screen "SignUp"
  Layout container-narrow
    Layout stack
      Heading 1 "Create Account"
      Paragraph "Join thousands of users already using our platform"

      Layout grid-2
        Input "First Name" placeholder="John"
        Input "Last Name" placeholder="Doe"

      Input "Email" placeholder="you@example.com"
      Input "Password" placeholder="••••••••" password=true
      Input "Confirm Password" placeholder="••••••••" password=true

      Select "Country" options=["USA", "Canada", "UK", "Germany", "France"]
      Select "How did you hear about us?" options=["Search Engine", "Social Media", "Friend", "Advertisement"]

      Layout stack-tight
        Checkbox "I agree to the Terms of Service"
        Checkbox "I want to receive marketing emails"

      Button "Create Account" primary i-user-plus

      Layout row-center
        Text "Already have an account?"
        Link "Sign in" @login
`;

console.log('='.repeat(80));
console.log('EXEMPLO 5: Formulário de Cadastro Completo');
console.log('='.repeat(80));

try {
  const signupAST = parseAndBuildAST(signupFormDSL);
  const signupReact = astToReactComponent(signupAST, {
    componentName: 'SignUpScreen',
    isClientComponent: true
  });

  console.log(signupReact);
} catch (error) {
  console.error('Error parsing signup form:', error);
}

console.log('\n\n');
console.log('='.repeat(80));
console.log('✅ Todos os exemplos foram processados!');
console.log('='.repeat(80));
console.log('\nPara testar:');
console.log('1. npm install');
console.log('2. npm run build');
console.log('3. node examples/redeemer-example.js');
console.log('\nOu copie o código gerado diretamente para seu projeto Next.js!');
