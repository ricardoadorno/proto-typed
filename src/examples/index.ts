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
import metadataDemo from './metadata-demo';
import { layoutModifiersExample } from './layout-modifiers';
import componentPropsDemo from './component-props-demo';

// Example configuration for UI
export const exampleConfigs = [
  { label: "Login Example", code: login },
  { label: "Dashboard Example", code: dashboard },
  { label: "Mobile Example", code: mobileComplete },
  { label: "Mobile Test", code: mobileTest },
  { label: "Named Elements", code: namedElementsExample },
  { label: "Button Variants", code: buttonVariantsExample },
  { label: "Lists Example", code: listsExample },
  { label: "Metadata Demo", code: metadataDemo },
  { label: "Layout Modifiers Demo", code: layoutModifiersExample },
  { label: "Component Props Demo", code: componentPropsDemo },
  { label: "Back Navigation Test", code: backNavigationExample },
  { label: "Contacts App", code: contactsAppExample },
] ;

