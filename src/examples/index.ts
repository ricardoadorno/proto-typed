// Barrel export for all examples
import login from './login';
import dashboard from './dashboard';
import mobileComplete from './mobile-complete';
import namedElementsExample from './named-elements';
import contactsAppExample from './contacts-app';
import backNavigationExample from './back-navigation';
import { mobileTest } from './mobile-test';

// Example configuration for UI
export const exampleConfigs = [
  { label: "Login Example", code: login },
  { label: "Dashboard Example", code: dashboard },
  { label: "Mobile Example", code: mobileComplete },
  { label: "Mobile Test", code: mobileTest },
  { label: "Named Elements", code: namedElementsExample },
  { label: "Back Navigation Test", code: backNavigationExample },
  { label: "Contacts App", code: contactsAppExample },
] ;

