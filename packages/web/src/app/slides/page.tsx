'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Zap,
  Code2,
  Smartphone,
  GitBranch,
  Package,
  ArrowRight,
  PackageX,
  Palette,
  Clock,
  Layers,
  Play,
  Eye,
  MousePointer,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// ==================== STATIC BACKGROUND ====================

const StaticBackground = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-900">
    {/* Geometric patterns */}
    <div className="absolute inset-0 opacity-[0.05]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
          linear-gradient(to right, rgba(139, 92, 246, 0.3) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
        `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>

    {/* Static orbs for depth */}
    <div className="absolute left-[10%] top-[20%] h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-3xl" />
    <div className="absolute right-[15%] top-[60%] h-[500px] w-[500px] rounded-full bg-pink-600/10 blur-3xl" />
    <div className="absolute left-[60%] top-[10%] h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-3xl" />

    {/* Vignette effect */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
  </div>
)

// ==================== ANIMATION VARIANTS ====================

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.32, 0.72, 0, 1] as any,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: [0.32, 0.72, 0, 1] as any,
    },
  }),
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: custom * 0.1,
      ease: [0.32, 0.72, 0, 1] as any,
    },
  }),
}

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1] as any,
    },
  },
}

// ==================== COMPONENTS ====================

const CodeBlock = ({
  children,
  highlight = false,
}: {
  children: string
  highlight?: boolean
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
    className={`
      relative rounded-lg border p-6 font-mono text-sm
      ${highlight ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--border)] bg-[var(--card)]'}
    `}
  >
    <pre className="overflow-x-auto">
      <code className="text-[var(--foreground)]">{children}</code>
    </pre>
  </motion.div>
)

const PhoneFrame = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
    transition={{ duration: 1, ease: [0.32, 0.72, 0, 1], delay }}
    className="relative"
    style={{ perspective: '1000px' }}
  >
    <div className="relative mx-auto h-[600px] w-[300px] rounded-[2.5rem] border-[12px] border-neutral-900 bg-neutral-900 shadow-2xl">
      {/* Notch */}
      <div className="absolute left-1/2 top-0 z-10 h-7 w-40 -translate-x-1/2 rounded-b-3xl bg-neutral-900" />

      {/* Screen */}
      <div className="h-full w-full overflow-hidden rounded-[1.5rem] bg-white">
        {/* Status bar */}
        <div className="flex items-center justify-between bg-white px-6 py-2 text-xs text-neutral-900">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="h-3 w-5 rounded-sm border border-neutral-900" />
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-28px)] overflow-y-auto bg-white p-4">
          {children}
        </div>
      </div>
    </div>
  </motion.div>
)

// Rendered Preview Component
const RenderedPreview = ({
  dslCode,
  children,
  title,
}: {
  dslCode: string
  children: React.ReactNode
  title?: string
}) => (
  <div className="grid grid-cols-2 gap-8">
    {/* DSL Code */}
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex flex-col"
    >
      {title && (
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
          <Code2 className="h-4 w-4" />
          {title}
        </div>
      )}
      <CodeBlock highlight>{dslCode}</CodeBlock>
    </motion.div>

    {/* Rendered Output */}
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="flex flex-col items-center justify-center"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
        <Eye className="h-4 w-4" />
        Preview
      </div>
      <PhoneFrame delay={0.6}>{children}</PhoneFrame>
    </motion.div>
  </div>
)

const TypewriterText = ({
  text,
  delay = 0,
}: {
  text: string
  delay?: number
}) => {
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    let currentIndex = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(interval)
        }
      }, 50)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, delay])

  return <span>{displayText}</span>
}

const FlowDiagram = () => (
  <motion.div
    initial="hidden"
    animate="visible"
    className="flex items-center justify-center gap-4"
  >
    {['DSL', 'AST', 'Renderer', 'Prototype'].map((label, i) => (
      <motion.div
        key={label}
        custom={i}
        variants={fadeIn}
        className="flex items-center gap-4"
      >
        <div className="flex h-24 w-32 items-center justify-center rounded-lg border-2 border-[var(--accent)] bg-[var(--accent)]/10 font-semibold">
          {label}
        </div>
        {i < 3 && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: i * 0.2 + 0.3 }}
            className="h-0.5 w-12 bg-[var(--accent)]"
            style={{ transformOrigin: 'left' }}
          />
        )}
      </motion.div>
    ))}
  </motion.div>
)

const AnimatedCard = ({ title, subtitle, icon: Icon, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.5, delay, ease: [0.32, 0.72, 0, 1] }}
    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
  >
    <Card className="p-6 transition-all hover:shadow-lg">
      <Icon className="mb-4 h-8 w-8 text-[var(--accent)]" />
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-sm text-[var(--fg-secondary)]">{subtitle}</p>
    </Card>
  </motion.div>
)

// ==================== SLIDES ====================

const slides = [
  // Slide 0: Capa
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-6xl space-y-16 px-12 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[var(--accent)] blur-3xl opacity-30" />
            <div className="relative rounded-3xl border-4 border-[var(--accent)] bg-gradient-to-br from-[var(--accent)]/20 to-purple-600/20 p-10">
              <Code2 className="h-32 w-32 text-[var(--accent)]" />
            </div>
          </div>
        </motion.div>

        {/* Título */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="space-y-6"
        >
          <h1 className="bg-gradient-to-r from-[var(--accent)] via-purple-500 to-pink-500 bg-clip-text text-7xl sm:text-8xl md:text-9xl font-bold text-transparent">
            Proto-Typed
          </h1>
          <div className="flex items-center justify-center gap-4 text-2xl sm:text-3xl md:text-4xl font-light text-[var(--fg-secondary)]">
            <span>Text first</span>
            <ArrowRight className="h-8 w-8" />
            <span>UI prototyping</span>
          </div>
        </motion.div>

        {/* Linha extra da capa (mantida como frase, não como subtítulo de seção) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-2xl text-[var(--foreground)]/70"
        >
          Uma linguagem textual para prototipar interfaces navegáveis em
          segundos
        </motion.p>

        {/* DSL Preview chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-5"
        >
          {['screen', 'container:', '## Title', '@[Button]'].map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 + i * 0.1 }}
              className="rounded-lg border-2 border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 sm:px-5 py-2.5 sm:py-3 font-mono text-sm sm:text-base backdrop-blur-sm"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* Hint para navegação */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="flex items-center justify-center gap-2 pt-8 text-sm text-[var(--fg-secondary)]"
        >
          <span>Pressione</span>
          <kbd className="rounded border border-[var(--border)] bg-[var(--card)] px-2 py-1 font-mono">
            →
          </kbd>
          <span>para avançar</span>
        </motion.div>
      </div>
    </div>
  ),

  // Slide 1: Contexto e motivação
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-6xl space-y-12 px-8 text-center">
        {/* Título padronizado */}
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl font-bold"
        >
          <span className="bg-gradient-to-r from-[var(--accent)] to-purple-600 bg-clip-text text-transparent">
            Contexto
          </span>
        </motion.h2>

        {/* Conteúdo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-6"
        >
          <div className="text-2xl sm:text-3xl font-light text-[var(--fg-secondary)]">
            Prototipagem de interfaces ainda é centrada em editores visuais
          </div>
          <p className="text-base sm:text-xl text-[var(--foreground)]/70">
            Figma, ferramentas de design e código boilerplate funcionam bem para
            alta fidelidade, mas criam atrito para explorar ideias rápidas de
            fluxo e navegação.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="space-y-6 pt-4 sm:pt-8"
        >
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {['mockups', 'fluxos', 'rótulos', 'navegação'].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                className="rounded-lg border-2 border-[var(--accent)] bg-[var(--accent)]/10 px-4 py-2 font-mono text-sm sm:text-base"
              >
                {word}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-base sm:text-lg text-[var(--fg-secondary)]"
          >
            Proto-Typed entra antes da alta fidelidade, para iterar rótulos,
            fluxos e navegação em texto.
          </motion.p>
        </motion.div>
      </div>
    </div>
  ),

  // Slide 2: Problema
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-6xl w-full space-y-12 px-8">
        {/* Título padronizado */}
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center text-5xl sm:text-6xl font-bold"
        >
          <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
            Problema
          </span>
        </motion.h2>

        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Cartões visuais */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { Icon: PackageX, text: 'Ferramentas pesadas' },
              { Icon: Palette, text: 'Foco no visual, não no fluxo' },
              { Icon: Clock, text: 'Iterações lentas' },
              { Icon: Layers, text: 'Curva de aprendizado alta' },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i + 2}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center rounded-lg border-2 border-[var(--border)] bg-gradient-to-br from-[var(--card)] to-transparent p-6 sm:p-8"
              >
                <item.Icon className="mb-4 h-10 w-10 sm:h-14 sm:w-14 text-[var(--fg-secondary)]" />
                <p className="text-center text-sm sm:text-base font-medium text-[var(--foreground)]">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Tópicos de texto */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col justify-center space-y-6"
          >
            <h3 className="mb-2 text-2xl sm:text-3xl font-semibold text-[var(--accent)]">
              Desafios observados
            </h3>
            {[
              {
                title: 'Setup e ferramentas',
                desc: 'Ambientes complexos para algo que será descartável.',
              },
              {
                title: 'Foco dividido',
                desc: 'Decisões de layout competem com decisões de fluxo.',
              },
              {
                title: 'Compartilhamento limitado',
                desc: 'Ideias ficam presas em mockups estáticos.',
              },
              {
                title: 'Baixo reaproveitamento',
                desc: 'Prototipar de novo para cada variação de fluxo.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="space-y-1"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                  <h4 className="text-base sm:text-lg font-semibold text-[var(--foreground)]">
                    {item.title}
                  </h4>
                </div>
                <p className="pl-5 text-sm sm:text-base text-[var(--fg-secondary)]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  ),

  // Slide 3: Proposta
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-6xl w-full space-y-12 px-6 lg:px-8">
        {/* Título padronizado */}
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center text-5xl sm:text-6xl font-bold"
        >
          <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
            Proposta
          </span>
        </motion.h2>

        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Fluxo visual em card */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <div className="pointer-events-none absolute -inset-8 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.15),_transparent_55%)]" />

            <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg-secondary)]">
                  Fluxo da solução
                </span>
                <span className="rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-3 py-1 text-xs font-medium text-[var(--accent)]">
                  DSL → AST → Preview
                </span>
              </div>

              <div className="flex flex-col items-center gap-10 py-4 lg:flex-row lg:justify-between">
                {/* Escreva */}
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="rounded-2xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 p-4 sm:p-5 shadow-md">
                    <Code2 className="h-12 w-12 sm:h-16 sm:w-16 text-[var(--accent)]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-bold">Escreva</h3>
                    <p className="text-sm text-[var(--fg-secondary)]">
                      Definição em texto das telas e ações.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {['screen', 'container:', '@[Next](Details)'].map(
                      (token) => (
                        <span
                          key={token}
                          className="rounded-md border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-3 py-1 text-xs font-mono"
                        >
                          {token}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Conector */}
                <div className="hidden h-24 w-px bg-gradient-to-b from-[var(--accent)]/30 via-[var(--accent)] to-[var(--accent)]/30 lg:block" />
                <ArrowRight className="block h-10 w-10 text-[var(--fg-secondary)] lg:hidden" />

                {/* Navegue */}
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="rounded-2xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 p-4 sm:p-5 shadow-md">
                    <Smartphone className="h-12 w-12 sm:h-16 sm:w-16 text-[var(--accent)]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-bold">Navegue</h3>
                    <p className="text-sm text-[var(--fg-secondary)]">
                      Protótipo navegável gerado a partir da AST.
                    </p>
                  </div>
                  <div className="mt-2 flex h-20 w-32 items-center justify-center rounded-2xl border border-[var(--border)] bg-gradient-to-b from-white to-neutral-100 text-xs text-neutral-700 shadow-inner">
                    Telas ligadas por ações.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Texto resumido em card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-stretch"
          >
            <div className="relative w-full rounded-3xl border border-[var(--border)] bg-[var(--card)]/80 p-6 sm:p-8 shadow-2xl">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--foreground)]">
                  Objetivo do trabalho
                </h3>
                <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-medium text-[var(--accent)]">
                  Visão geral
                </span>
              </div>

              <div className="space-y-5 text-sm sm:text-base">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                    <h4 className="font-semibold">Text first</h4>
                  </div>
                  <p className="pl-5 text-[var(--fg-secondary)]">
                    Definir interfaces em texto puro, com foco em telas,
                    navegação e rótulos.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                    <h4 className="font-semibold">Preview em tempo real</h4>
                  </div>
                  <p className="pl-5 text-[var(--fg-secondary)]">
                    Atualização instantânea do protótipo a cada alteração na
                    DSL.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                    <h4 className="font-semibold">Export HTML</h4>
                  </div>
                  <p className="pl-5 text-[var(--fg-secondary)]">
                    Geração de um protótipo navegável standalone em HTML para
                    compartilhamento.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-xs text-[var(--fg-secondary)]">
                <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1">
                  Baixa fidelidade
                </span>
                <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1">
                  Foco em fluxo
                </span>
                <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1">
                  Complementar a editores visuais
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  ),

  // Slide 4: DSL
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-6xl space-y-10 px-8">
        {/* Título padronizado */}
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center text-5xl sm:text-6xl font-bold"
        >
          <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
            A DSL
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <CodeBlock highlight>
                {`screen Home:
  container:
    ## Welcome
    > Prototype in seconds

    @[Next](Details)`}
              </CodeBlock>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col justify-center space-y-6"
          >
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--accent)]">
                Características
              </h3>
              {[
                {
                  title: 'Sintaxe mínima',
                  desc: 'Poucos conceitos centrais, inspirados em Markdown.',
                },
                {
                  title: 'Legível',
                  desc: 'Código próximo de documentação funcional da interface.',
                },
                {
                  title: 'Focado em fluxo',
                  desc: 'Telas, ações e alvos de navegação primeiro.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + i * 0.15 }}
                  className="space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                    <span className="font-semibold">{item.title}</span>
                  </div>
                  <p className="pl-4 text-sm text-[var(--fg-secondary)]">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  ),

  // Slide 5: Preview em tempo real
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-6xl space-y-8 px-8">
        {/* Título padronizado */}
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center text-5xl sm:text-6xl font-bold"
        >
          <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
            Preview em tempo real
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-base sm:text-lg text-[var(--fg-secondary)]"
        >
          Editor de texto e protótipo navegável lado a lado, com atualização
          instantânea.
        </motion.p>

        <div className="mx-auto w-full max-w-5xl">
          <RenderedPreview
            title="DSL Code"
            dslCode={`screen Home:
  container:
    ## Welcome to Proto-Typed
    > Your text-first prototyping tool

    @primary[Get Started]
    @outline[Learn More]`}
          >
            <div className="flex h-full flex-col items-center justify-center gap-6 p-4">
              <div className="space-y-3 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                  Welcome to Proto-Typed
                </h2>
                <p className="text-sm sm:text-base text-neutral-600">
                  Your text first prototyping tool
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4 w-full max-w-xs">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-lg bg-[var(--accent)] px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg"
                >
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-lg border-2 border-[var(--accent)] bg-transparent px-6 py-3 text-sm sm:text-base font-semibold text-[var(--accent)]"
                >
                  Learn More
                </motion.button>
              </div>
            </div>
          </RenderedPreview>
        </div>
      </div>
    </div>
  ),

  // Slide 6: Pipeline de processamento
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-6xl space-y-10 px-8">
        {/* Título padronizado */}
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center text-5xl sm:text-6xl font-bold"
        >
          <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
            Arquitetura e pipeline
          </span>
        </motion.h2>

        <FlowDiagram />

        <div className="grid grid-cols-1 gap-8 pt-2 sm:pt-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-[var(--accent)]">
              Pipeline
            </h3>
            {[
              'Lexer e parser processam a DSL.',
              'Geração de AST semântica mínima.',
              'Renderer mapeia AST para componentes React.',
              'HTML final para preview e export.',
            ].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.7 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                <p className="text-sm sm:text-base text-[var(--foreground)]">
                  {text}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-[var(--accent)]">
              Benefícios da AST
            </h3>
            {[
              'Validação de sintaxe antes da renderização.',
              'Estrutura de dados única para múltiplos renderers.',
              'Facilidade para extensões futuras da linguagem.',
              'Portabilidade do protótipo para outros alvos.',
            ].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" />
                <p className="text-sm sm:text-base text-[var(--foreground)]">
                  {text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  ),

  // Slide 7: Navegação entre telas
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-6xl space-y-8 px-8">
        {/* Título padronizado */}
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center text-5xl sm:text-6xl font-bold"
        >
          <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
            Navegação entre telas
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-base sm:text-lg text-[var(--fg-secondary)]"
        >
          Modelagem de fluxos multitelas com links explícitos na DSL.
        </motion.p>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Código DSL */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
                <Code2 className="h-4 w-4" />
                Multiple screens
              </div>
              <CodeBlock highlight>
                {`screen Home:
  container:
    ## Home Screen
    > Welcome to the app

    @[Go to Details](Details)

screen Details:
  container:
    ## Details
    > More information here

    @outline[Back](Home)`}
              </CodeBlock>
            </div>
          </motion.div>

          {/* Preview multi tela */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex items-center justify-center"
          >
            <div className="flex items-center justify-center gap-6 overflow-x-auto pb-2">
              {/* Home */}
              <div className="flex flex-col items-center gap-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-secondary)]">
                  Home
                </div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="relative"
                >
                  <div className="relative mx-auto h-[360px] w-[180px] sm:h-[400px] sm:w-[200px] rounded-[1.5rem] border-8 border-neutral-900 bg-neutral-900 shadow-xl">
                    <div className="h-full w-full overflow-hidden rounded-[0.8rem] bg-white p-3">
                      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                        <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
                          Home Screen
                        </h3>
                        <p className="text-xs text-neutral-600">
                          Welcome to the app
                        </p>
                        <button className="mt-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white">
                          Go to Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <ArrowRight className="hidden sm:block h-8 w-8 text-[var(--accent)]" />

              {/* Details */}
              <div className="flex flex-col items-center gap-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-secondary)]">
                  Details
                </div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="relative"
                >
                  <div className="relative mx-auto h-[360px] w-[180px] sm:h-[400px] sm:w-[200px] rounded-[1.5rem] border-8 border-neutral-900 bg-neutral-900 shadow-xl">
                    <div className="h-full w-full overflow-hidden rounded-[0.8rem] bg-white p-3">
                      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                        <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
                          Details
                        </h3>
                        <p className="text-xs text-neutral-600">
                          More information here
                        </p>
                        <button className="mt-2 rounded-lg border-2 border-[var(--accent)] bg-transparent px-4 py-2 text-xs font-semibold text-[var(--accent)]">
                          Back
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  ),

  // Slide 8: Componentização
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-6xl space-y-8 px-8">
        {/* Título padronizado */}
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center text-5xl sm:text-6xl font-bold"
        >
          <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
            Componentes reutilizáveis
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-base sm:text-lg text-[var(--fg-secondary)]"
        >
          Definição de componentes na DSL e instanciação em listas e telas.
        </motion.p>

        <div className="mx-auto w-full max-w-5xl">
          <RenderedPreview
            title="Component Definition"
            dslCode={`component ProductCard:
  card:
    >> %title
    >>> %description
    > Price: %price

    @primary[Buy Now]
    @outline[Details]

screen Shop:
  list $ProductCard:
    - Laptop | Powerful machine | $999
    - Phone | Latest model | $699
    - Tablet | Portable device | $499`}
          >
            <div className="flex h-full flex-col gap-3 overflow-y-auto p-2">
              {[
                { title: 'Laptop', desc: 'Powerful machine', price: '$999' },
                { title: 'Phone', desc: 'Latest model', price: '$699' },
                { title: 'Tablet', desc: 'Portable device', price: '$499' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.15 }}
                >
                  <div className="rounded-lg border-2 border-neutral-200 bg-white p-4 shadow-sm">
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600">
                      {item.desc}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm text-neutral-500">
                      Price: {item.price}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white">
                        Buy Now
                      </button>
                      <button className="flex-1 rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700">
                        Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </RenderedPreview>
        </div>
      </div>
    </div>
  ),

  // Slide 9: Export
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-6xl space-y-10 px-8">
        {/* Título padronizado */}
        <motion.h2
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="text-center text-5xl sm:text-6xl font-bold"
        >
          <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
            Export e compartilhamento
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Visual */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              type: 'spring',
              stiffness: 100,
            }}
            className="flex flex-col items-center justify-center"
          >
            <div className="relative rounded-2xl border-2 border-[var(--accent)] bg-gradient-to-br from-[var(--accent)]/20 to-transparent p-10 sm:p-12 shadow-lg">
              <Download className="h-16 w-16 sm:h-20 sm:w-20 text-[var(--accent)]" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[var(--accent)]/10" />
            </div>
            <p className="mt-6 text-center text-xl font-semibold">
              Protótipo standalone
            </p>
            <p className="text-center text-sm sm:text-base text-[var(--fg-secondary)]">
              Arquivo HTML único, pronto para enviar ou hospedar.
            </p>
          </motion.div>

          {/* Tópicos */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col justify-center space-y-6"
          >
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--accent)]">
                Recursos
              </h3>
              {[
                {
                  title: 'HTML self-contained',
                  desc: 'CSS e JavaScript embutidos, nenhum build externo.',
                },
                {
                  title: 'Zero dependências',
                  desc: 'Abre em qualquer navegador moderno.',
                },
                {
                  title: 'Compartilhamento simples',
                  desc: 'Anexe em e-mail, Slack ou publique em páginas estáticas.',
                },
                {
                  title: 'Navegação funcional',
                  desc: 'Links e botões seguem os alvos definidos na DSL.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                    <span className="font-semibold">{item.title}</span>
                  </div>
                  <p className="pl-4 text-sm text-[var(--fg-secondary)]">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  ),

  // Slide 10: Conclusões e próximos passos
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-6xl space-y-10 px-8">
        {/* Título padronizado */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center text-5xl sm:text-6xl font-bold"
        >
          <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
            Conclusões
          </span>
        </motion.h2>

        <p className="text-center text-lg sm:text-2xl font-light text-[var(--fg-secondary)]">
          Proto-Typed como caminho rápido para iterar rótulos, fluxos e
          navegação em texto.
        </p>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Ícones de features chave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center justify-center gap-8"
          >
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              {[
                { Icon: Code2, label: 'DSL textual' },
                { Icon: Zap, label: 'Preview em tempo real' },
                { Icon: Package, label: 'Export HTML' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.15 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="rounded-full border-2 border-[var(--accent)] bg-[var(--accent)]/10 p-4">
                    <item.Icon className="h-7 w-7 sm:h-8 sm:w-8 text-[var(--accent)]" />
                  </div>
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-semibold shadow-xl"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Experimente Proto-Typed
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Recap mais acadêmico */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col justify-center space-y-6"
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-[var(--accent)]">
              Resumo do trabalho
            </h3>
            <div className="space-y-3 text-sm sm:text-lg text-[var(--foreground)]">
              <div>
                ✓ DSL textual para descrever telas, componentes e navegação.
              </div>
              <div>
                ✓ Pipeline Lexer Parser AST Renderer para HTML interativo.
              </div>
              <div>✓ Preview em tempo real no navegador.</div>
              <div>✓ Suporte a múltiplas telas, componentes e listas.</div>
              <div>
                ✓ Export de protótipo standalone para validação com
                stakeholders.
              </div>
              <div className="pt-3 sm:pt-4">
                Próximos passos: novos renderers, linting da DSL e integração
                mais profunda com LLMs.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  ),
]

// ==================== MAIN COMPONENT ====================

export default function SlidesPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [hideCursor, setHideCursor] = useState(false)

  const paginate = (newDirection: number) => {
    const nextSlide = currentSlide + newDirection
    if (nextSlide >= 0 && nextSlide < slides.length) {
      setDirection(newDirection)
      setCurrentSlide(nextSlide)
    }
  }

  // Auto-hide controls and cursor
  useEffect(() => {
    let timeout: NodeJS.Timeout

    const handleMouseMove = () => {
      setShowControls(true)
      setHideCursor(false)
      clearTimeout(timeout)

      timeout = setTimeout(() => {
        setShowControls(false)
        setHideCursor(true)
      }, 3000) // Hide after 3 seconds of inactivity
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Initial timeout
    timeout = setTimeout(() => {
      setShowControls(false)
      setHideCursor(true)
    }, 3000)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') paginate(1)
      if (e.key === 'ArrowLeft') paginate(-1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide])

  const CurrentSlideComponent = slides[currentSlide]

  return (
    <div
      className="relative h-screen w-full overflow-hidden"
      style={{ cursor: hideCursor ? 'none' : 'default' }}
    >
      <StaticBackground />

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 m-10"
        >
          <CurrentSlideComponent />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3"
        initial={{ opacity: 1 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => paginate(-1)}
          disabled={currentSlide === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)]/90 text-[var(--foreground)] shadow-md backdrop-blur-sm transition-opacity disabled:opacity-20"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>

        <div className="flex gap-2">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setDirection(i > currentSlide ? 1 : -1)
                setCurrentSlide(i)
              }}
              whileHover={{ scale: 1.3 }}
              className={`h-2 rounded-full transition-all ${
                i === currentSlide
                  ? 'w-8 bg-[var(--accent)]'
                  : 'w-2 bg-[var(--border)] hover:bg-[var(--accent)]/50'
              }`}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => paginate(1)}
          disabled={currentSlide === slides.length - 1}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)]/90 text-[var(--foreground)] shadow-md backdrop-blur-sm transition-opacity disabled:opacity-20"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </motion.div>

      {/* Slide counter */}
      <motion.div
        className="fixed right-8 top-8 z-50 rounded-full border border-[var(--border)] bg-[var(--card)]/90 px-4 py-2 font-mono text-sm text-[var(--fg-secondary)] shadow-md backdrop-blur-sm"
        initial={{ opacity: 1 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentSlide + 1} / {slides.length}
      </motion.div>
    </div>
  )
}
