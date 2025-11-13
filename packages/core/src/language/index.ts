export {
  createEngine,
  TRIGGER_CHARACTERS,
  type LanguageEngine,
  type LanguageHost,
} from './engine/engine.js'
export {
  getTextMateGrammar,
  getLanguageConfiguration,
} from './grammar/index.js'
export { activateVSCodeAdapter } from './adapters/vscode.js'
export { attachToMonaco, type MonacoAdapterOptions } from './adapters/monaco.js'
