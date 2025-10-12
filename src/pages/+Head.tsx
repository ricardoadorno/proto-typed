// src/pages/+Head.tsx
export function Head() {
    const href = import.meta.env.DEV
        ? '/logo.svg'
        : '/proto-typed/logo.svg'

    return (
        <>
            <link rel="icon" type="image/svg+xml" href={href} />
        </>
    )
}
