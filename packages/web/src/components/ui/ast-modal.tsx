import Modal from './modal'

/**
 * @interface AstModalProps
 * @description The props for the AstModal component.
 *
 * @property {string} ast - The Abstract Syntax Tree as a JSON string.
 * @property {string} html - The generated HTML string.
 */
export interface AstModalProps {
  ast: string
  html: string
}

/**
 * @function AstModal
 * @description A component that displays the generated Abstract Syntax Tree (AST) and HTML in a modal.
 *
 * @param {AstModalProps} props - The props for the component.
 * @param {string} props.ast - The AST to display.
 * @param {string} props.html - The HTML to display.
 * @returns {React.ReactElement} The rendered modal component.
 */
export default function AstModal({ ast, html }: AstModalProps) {
  return (
    <Modal
      buttonText="View AST/HTML"
      buttonVariant="outline"
      header={
        <h2 className="text-xl font-semibold text-[var(--fg-primary)]">
          AST & HTML Output
        </h2>
      }
      content={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[var(--brand-400)]"></div>
              <h3 className="text-lg font-medium text-[var(--fg-primary)]">
                Abstract Syntax Tree
              </h3>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface)]">
              <pre className="max-h-96 overflow-auto p-4 text-sm font-mono leading-relaxed text-[var(--accent)]">
                {ast || 'No AST generated yet...'}
              </pre>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[var(--info)]"></div>
              <h3 className="text-lg font-medium text-[var(--fg-primary)]">
                Generated HTML
              </h3>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface)]">
              <pre className="max-h-96 overflow-auto p-4 text-sm font-mono leading-relaxed text-[var(--info)]">
                {html || 'No HTML generated yet...'}
              </pre>
            </div>
          </div>
        </div>
      }
    />
  )
}
