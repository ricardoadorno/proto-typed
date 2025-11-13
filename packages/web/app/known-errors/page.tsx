"use client";

import {
  AlertTriangleIcon,
  BugIcon,
  FileWarningIcon,
  RefreshCcwIcon,
  WrenchIcon,
  InfoIcon,
  ExternalLinkIcon,
} from "lucide-react";
import Link from "next/link";

import { Badge, GlowCard, SectionHeader, Button } from "@/components/ui";
import { DocsHeader } from "@/components/layouts/components/docs-header";
import DocsFooter from "@/components/layouts/components/docs-footer";

type KnownError = {
  title: string;
  description: string;
    cause: string;
    fix?: string;
    status: string;
    severity: "high" | "medium" | "low";
};

const knownErrors: KnownError[] = [
  {
    title: "Erro de Indentação",
    description:
      "Quando existe uma linha em branco é entendido como fim da identação do componente pai, causando falha na renderização correta dos estilos no tema escuro.",
    cause:
      "Problema no parser que entende linhas em branco como término de bloco",
    status: "Correção em andamento",
    severity: "medium",
  }
];

const ErrorSeverityBadge = ({ level }: { level: KnownError["severity"] }) => {
  const colors: Record<string, string> = {
    high: "bg-red-500/10 text-red-400 border-red-400/20",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-400/20",
    low: "bg-green-500/10 text-green-400 border-green-400/20",
  };

  const label = level.charAt(0).toUpperCase() + level.slice(1);

  return (
    <Badge
      variant="outline"
      className={`text-xs uppercase tracking-wide ${colors[level] || ""}`}
    >
      {label}
    </Badge>
  );
};

export default function KnownErrorsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--fg-primary)]">
      <DocsHeader />
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 pt-12 sm:px-6 lg:px-10">
        <section className="space-y-8">
          <SectionHeader
            align="center"
            eyebrow="Erros conhecidos"
            title="Lista de bugs e limitações identificadas"
            description="Aqui estão os problemas conhecidos nas versões atuais do Proto-Typed. Acompanhe seu status e soluções sugeridas."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {knownErrors.map((error) => (
              <GlowCard key={error.title} hoverLift={false}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[var(--fg-primary)]">
                      {error.title}
                    </h3>
                    <ErrorSeverityBadge level={error.severity} />
                  </div>
                  <p className="text-sm text-[var(--fg-secondary)]">
                    {error.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-start gap-2">
                      <BugIcon className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                      <span>
                        <strong>Causa:</strong> {error.cause}
                      </span>
                    </p>
                    {error.fix && <p className="flex items-start gap-2">
                      <WrenchIcon className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                      <span>
                        <strong>Correção:</strong> {error.fix}
                      </span>
                    </p>}
                    <p className="flex items-start gap-2">
                      <RefreshCcwIcon className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                      <span>
                        <strong>Status:</strong> {error.status}
                      </span>
                    </p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl space-y-6 border-t border-[var(--border-muted)] pt-10 text-center">
          <InfoIcon className="mx-auto h-8 w-8 text-[var(--accent)]" />
          <h2 className="text-2xl font-semibold text-[var(--fg-primary)]">
            Encontrou um novo problema?
          </h2>
          <p className="text-[var(--fg-secondary)] max-w-xl mx-auto">
            Relate um bug ou comportamento inesperado para que possamos
            investigar e corrigir o mais rápido possível.
          </p>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link
              href="https://github.com/ricardoadorno/proto-typed/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon className="h-5 w-5" />
              Abrir issue no GitHub
            </Link>
          </Button>
        </section>
      </main>
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-10">
        <DocsFooter />
      </div>
    </div>
  );
}
