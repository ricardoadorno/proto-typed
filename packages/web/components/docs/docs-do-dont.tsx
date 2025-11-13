'use client'

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { DocsCodePreview } from "./docs-code-preview"
import { DocsCodeBlock } from "./docs-code-block"
import { DSLEditor } from "@/core/editor"

type ExampleDetails = {
  title: string
  code: string
  description?: ReactNode
}

export interface DocsDoDontProps {
  dont: ExampleDetails
  do: ExampleDetails
  children?: ReactNode
  className?: string
}

const formatCode = (code: string) => code.trim().replace(/\r/g, "")

export function DocsDoDont({
  dont,
  do: doExample,
  children,
  className,
}: DocsDoDontProps) {
  return (
    <section className={cn("", className)}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[80%] w-[100%]">
        <h4>❌ Errado — {dont.title}</h4>
        <h5>{dont.description}</h5>
        <DSLEditor
          value={formatCode(dont.code)}
          options={{
            readOnly: true,                      
            domReadOnly: true,                   
            renderLineHighlight: "none",          
            readOnlyMessage: { value: "" },  
            lineNumbers: "off",
            glyphMargin: false,
            overviewRulerLanes: 0,
overviewRulerBorder: false,
          }}
        />
        </div>
        <div className="h-[80%] w-[100%]">
        <h4>✅ Correto — {doExample.title}</h4>
        <h5>{doExample.description}</h5>
        <DSLEditor
          value={formatCode(doExample.code)}
          options={{
            readOnly: true,                      
            domReadOnly: true,                   
            renderLineHighlight: "none",          
            readOnlyMessage: { value: "" },  
            lineNumbers: "off",
            glyphMargin: false,
            stickyScroll: {
              enabled: false,
            },
            overviewRulerLanes: 0,
overviewRulerBorder: false,
          }}
        />
      </div>
      </div>

      {children ? (
        <div className="text-sm text-[var(--fg-secondary)] pt-4">{children}</div>
      ) : null}
    </section>
  )
}

export default DocsDoDont
