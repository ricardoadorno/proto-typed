import Modal from './modal';

export default function AstModal({ ast, html }: { ast: string, html: string }) {
    return (
        <Modal
            buttonText='AST Result'
            content={
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "1rem",
                        gap: "1rem",
                    }}
                >
                    <pre
                        style={{
                            maxHeight: "80vh",
                            overflowY: "auto",
                            padding: "1rem",
                            borderRadius: "8px",
                            fontFamily: "monospace",
                            fontSize: "14px",
                        }}
                    >
                        <h2>
                            AST Result
                        </h2>
                        {ast}
                    </pre>
                    <pre
                        style={{
                            maxHeight: "80vh",
                            overflowY: "auto",
                            padding: "1rem",
                            borderRadius: "8px",
                            fontFamily: "monospace",
                            fontSize: "14px",
                        }}
                    >
                        <h2>
                            HTML Result
                        </h2>
                        {html}
                    </pre>
                </div>
            }
        />
    )
}
