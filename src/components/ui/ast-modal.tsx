import Modal from './modal';

export default function AstModal({ ast, html }: { ast: string, html: string }) {
    return (
        <Modal
            buttonText='View AST/HTML'
            buttonVariant='outline'
            header={
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                    AST & HTML Output
                </h2>
            }
            content={
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <h3 className="text-lg font-medium text-slate-800 dark:text-white">
                                Abstract Syntax Tree
                            </h3>
                        </div>
                        <div className="bg-slate-900 rounded-xl overflow-hidden">
                            <pre className="p-4 text-sm text-green-400 overflow-auto max-h-96 font-mono leading-relaxed">
                                {ast || 'No AST generated yet...'}
                            </pre>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <h3 className="text-lg font-medium text-slate-800 dark:text-white">
                                Generated HTML
                            </h3>
                        </div>
                        <div className="bg-slate-900 rounded-xl overflow-hidden">
                            <pre className="p-4 text-sm text-orange-400 overflow-auto max-h-96 font-mono leading-relaxed">
                                {html || 'No HTML generated yet...'}
                            </pre>
                        </div>
                    </div>
                </div>
            }
        />
    )
}
