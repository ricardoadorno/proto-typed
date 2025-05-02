import React, { useState } from 'react';

interface ModalProps {
    buttonText: string;
    header?: React.ReactNode;
    content?: React.ReactNode;
    actions?: React.ReactNode;
}

export default function Modal({ buttonText, content, header, actions }: ModalProps) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <dialog
                open={isOpen}
            >
                <article
                    style={{
                        maxWidth: "1200px"
                    }}
                >
                    <header>
                        <button aria-label="Close" rel="prev"
                            onClick={() => setIsOpen(false)}
                        ></button>
                        {header}
                    </header>
                    <div
                        style={{ padding: "1rem" }}
                    >{content}</div>
                    <footer>
                        {actions}
                        <button onClick={() => setIsOpen(false)} style={{ marginTop: "1rem" }}>Close</button>
                    </footer>
                </article>
            </dialog>

            <button onClick={
                () => setIsOpen(true)
            }>
                {buttonText}
            </button>
        </>
    )
}
