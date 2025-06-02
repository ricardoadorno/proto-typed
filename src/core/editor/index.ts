import { registerDSLCompletionProvider } from './completion/dsl-completion';
import { registerDSLLanguage } from './language/dsl-language';
import { registerDSLTheme } from './theme/dsl-theme';

/**
 * Initialize Monaco DSL with dark theme only
 */
export async function initializeMonacoDSL() {
  registerDSLLanguage();
  registerDSLTheme();
  registerDSLCompletionProvider();
}
