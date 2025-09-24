// Barrel export for all examples
import login from './login';
import dashboard from './dashboard';
import mobileComplete from './mobile-complete';
import namedElementsExample from './named-elements';
import contactsAppExample from './contacts-app';
import backNavigationExample from './back-navigation';
import { mobileTest } from './mobile-test';
import { buttonVariantsExample } from './button-variants';
import listsExample from './lists';
import { modalDrawerTest } from './modal-drawer-test';

// Example configuration for UI
export const exampleConfigs = [
  { label: "Login Example", code: login },
  { label: "Dashboard Example", code: dashboard },
  { label: "Mobile Example", code: mobileComplete },
  { label: "Modal/Drawer Test", code: modalDrawerTest },
  { label: "Mobile Test", code: mobileTest },
  { label: "Named Elements", code: namedElementsExample },
  { label: "Button Variants", code: buttonVariantsExample },
  { label: "Lists Example", code: listsExample },
  { label: "Back Navigation Test", code: backNavigationExample },
  { label: "Contacts App", code: contactsAppExample },
] ;

