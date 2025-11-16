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
  <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-900">
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
  // Slide 0: Cover/Title Slide
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-6xl space-y-16 px-12 text-center">
        {/* Logo/Icon */}
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

        {/* Title */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="space-y-6"
        >
          <h1 className="bg-gradient-to-r from-[var(--accent)] via-purple-500 to-pink-500 bg-clip-text text-9xl font-bold text-transparent">
            Proto-Typed
          </h1>
          <div className="flex items-center justify-center gap-4 text-4xl font-light text-[var(--fg-secondary)]">
            <span>Text-First</span>
            <ArrowRight className="h-8 w-8" />
            <span>Prototyping</span>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-2xl text-[var(--foreground)]/70"
        >
          Transforme ideias em protótipos interativos com uma simples linguagem
        </motion.p>

        {/* DSL Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex justify-center gap-5"
        >
          {['screen', 'container:', '## Title', '@[Button]'].map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 + i * 0.1 }}
              className="rounded-lg border-2 border-[var(--accent)]/30 bg-[var(--accent)]/10 px-5 py-3 font-mono text-base backdrop-blur-sm"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA hint */}
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
          <span>para começar</span>
        </motion.div>
      </div>
    </div>
  ),

  // Slide 1: Introdução
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-6xl space-y-12 px-12 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        >
          <h1 className="bg-gradient-to-r from-[var(--accent)] to-purple-600 bg-clip-text text-8xl font-bold text-transparent">
            Proto-Typed
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="text-4xl font-light text-[var(--fg-secondary)]">
            Text → Prototype
          </div>
          <p className="text-xl text-[var(--foreground)]/70">
            Uma ferramenta que transforma texto em protótipos interativos
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="space-y-6 pt-8"
        >
          <div className="flex justify-center gap-6">
            {['screen', 'Home:', 'container:', '## Welcome'].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                className="rounded-lg border-2 border-[var(--accent)] bg-[var(--accent)]/10 px-4 py-2 font-mono text-base"
              >
                {word}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-lg text-[var(--fg-secondary)]"
          >
            Ideal para designers, desenvolvedores e product managers que
            precisam validar ideias rapidamente
          </motion.p>
        </motion.div>
      </div>
    </div>
  ),

  // Slide 2: O Problema
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-7xl space-y-14 px-12">
        <div className="space-y-4">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center text-6xl font-bold"
          >
            O Problema
          </motion.h2>

          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-center text-2xl text-[var(--fg-secondary)]"
          >
            Prototipar rápido é difícil com ferramentas tradicionais
          </motion.p>
        </div>

        <div className="grid grid-cols-2 gap-16">
          {/* Visual Cards */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { Icon: PackageX, text: 'Ferramentas pesadas' },
              { Icon: Palette, text: 'Foco no visual' },
              { Icon: Clock, text: 'Lento para iterar' },
              { Icon: Layers, text: 'Curva de aprendizado' },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i + 2}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center rounded-lg border-2 border-[var(--border)] bg-gradient-to-br from-[var(--card)] to-transparent p-8"
              >
                <item.Icon className="mb-4 h-14 w-14 text-[var(--fg-secondary)]" />
                <p className="text-center text-base font-medium text-[var(--foreground)]">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Text Topics */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col justify-center space-y-6"
          >
            <h3 className="mb-2 text-3xl font-semibold text-[var(--accent)]">
              Desafios comuns:
            </h3>
            {[
              {
                title: 'Setup complexo',
                desc: 'Instalar dependências, configurar ambiente',
              },
              {
                title: 'Foco dividido',
                desc: 'Tempo gasto com design em vez de UX',
              },
              {
                title: 'Difícil compartilhar',
                desc: 'Ideias ficam presas em mockups estáticos',
              },
              {
                title: 'Alto overhead',
                desc: 'Muito esforço para protótipos descartáveis',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="space-y-1"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                  <h4 className="text-lg font-semibold text-[var(--foreground)]">
                    {item.title}
                  </h4>
                </div>
                <p className="pl-5 text-[var(--fg-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  ),

  // Slide 3: A Solução
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-7xl space-y-16 px-12">
        <div className="space-y-4">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center text-6xl font-bold"
          >
            <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
              A Solução
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-xl text-[var(--fg-secondary)]"
          >
            Foque no que importa: a experiência do usuário
          </motion.p>
        </div>

        <div className="grid grid-cols-2 gap-16">
          {/* Visual Flow */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center space-y-16"
          >
            <div className="space-y-6 text-center">
              <h3 className="text-5xl font-bold">Escreva</h3>
              <Code2 className="mx-auto h-32 w-32 text-[var(--accent)]" />
            </div>

            <ArrowRight className="h-20 w-20 text-[var(--fg-secondary)]" />

            <div className="space-y-6 text-center">
              <h3 className="text-5xl font-bold">Veja</h3>
              <Smartphone className="mx-auto h-32 w-32 text-[var(--accent)]" />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col justify-center space-y-6"
          >
            <h3 className="text-2xl font-semibold">
              Simplifique seu workflow:
            </h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  <h4 className="text-lg font-semibold">Foco no conteúdo</h4>
                </div>
                <p className="pl-5 text-[var(--fg-secondary)]">
                  Escreva a estrutura e fluxo em texto puro, sem se preocupar
                  com design ou código
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  <h4 className="text-lg font-semibold">
                    Feedback instantâneo
                  </h4>
                </div>
                <p className="pl-5 text-[var(--fg-secondary)]">
                  Cada mudança no código reflete imediatamente no preview,
                  acelerando iterações
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  <h4 className="text-lg font-semibold">Menos fricção</h4>
                </div>
                <p className="pl-5 text-[var(--fg-secondary)]">
                  Zero setup, zero dependências. Abra e comece a prototipar em
                  segundos
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  ),

  // Slide 4: A DSL
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-7xl space-y-12 px-12">
        <div className="space-y-4">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center text-6xl font-bold"
          >
            A DSL
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-2xl text-[var(--fg-secondary)]"
          >
            Domain-Specific Language otimizada para criar protótipos rapidamente
          </motion.p>
        </div>

        <div className="grid grid-cols-2 gap-12">
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
              <h3 className="text-xl font-semibold text-[var(--accent)]">
                Características:
              </h3>
              {[
                { title: 'Simples', desc: 'Sintaxe minimalista e intuitiva' },
                { title: 'Legível', desc: 'Código que parece documentação' },
                { title: 'Rápido', desc: 'Escreva menos, faça mais' },
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

  // Slide 5: Preview em Tempo Real
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-6xl space-y-8 px-8">
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center text-5xl font-bold"
        >
          <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
            Preview em tempo real
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-lg text-[var(--fg-secondary)]"
        >
          Veja suas mudanças instantaneamente
        </motion.p>

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
              <h2 className="text-3xl font-bold text-neutral-900">
                Welcome to Proto-Typed
              </h2>
              <p className="text-neutral-600">
                Your text-first prototyping tool
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-lg bg-[var(--accent)] px-8 py-3 font-semibold text-white shadow-lg"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-lg border-2 border-[var(--accent)] bg-transparent px-8 py-3 font-semibold text-[var(--accent)]"
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </RenderedPreview>
      </div>
    </div>
  ),

  // Slide 6: AST e Pipeline
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-6xl space-y-12 px-8">
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center text-5xl font-bold"
        >
          <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
            Pipeline de Processamento
          </span>
        </motion.h2>

        <FlowDiagram />

        <div className="grid grid-cols-2 gap-8 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-[var(--accent)]">
              Como funciona:
            </h3>
            {[
              'Parser robusto processa DSL',
              'Gera AST (Abstract Syntax Tree)',
              'Renderer transforma em componentes',
              'Protótipo interativo final',
            ].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.7 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                <p className="text-[var(--foreground)]">{text}</p>
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
              Benefícios:
            </h3>
            {[
              'Validação automática de sintaxe',
              'Estrutura de dados consistente',
              'Fácil manutenção e extensão',
              'Otimização no build',
            ].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.0 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" />
                <p className="text-[var(--foreground)]">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  ),

  // Slide 7: Múltiplas Telas e Navegação
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-7xl space-y-10 px-12">
        <div className="space-y-4">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center text-5xl font-bold"
          >
            <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
              Navegação entre telas
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-lg text-[var(--fg-secondary)]"
          >
            Modele fluxos completos de usuário com múltiplas telas e navegação
            interativa
          </motion.p>
        </div>

        <div className="grid grid-cols-2 gap-12">
          {/* DSL Code */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
                <Code2 className="h-4 w-4" />
                Multiple Screens
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

          {/* Preview - Multiple Phones */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex items-center justify-center gap-6"
          >
            {/* Home Screen */}
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
                <div className="relative mx-auto h-[400px] w-[200px] rounded-[1.5rem] border-8 border-neutral-900 bg-neutral-900 shadow-xl">
                  <div className="h-full w-full overflow-hidden rounded-[0.8rem] bg-white p-3">
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                      <h3 className="text-xl font-bold text-neutral-900">
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

            {/* Arrow */}
            <div>
              <ArrowRight className="h-8 w-8 text-[var(--accent)]" />
            </div>

            {/* Details Screen */}
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
                <div className="relative mx-auto h-[400px] w-[200px] rounded-[1.5rem] border-8 border-neutral-900 bg-neutral-900 shadow-xl">
                  <div className="h-full w-full overflow-hidden rounded-[0.8rem] bg-white p-3">
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                      <h3 className="text-xl font-bold text-neutral-900">
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
          </motion.div>
        </div>
      </div>
    </div>
  ),

  // Slide 8: Componentização
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-7xl space-y-8 px-12">
        <div className="space-y-3">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center text-5xl font-bold"
          >
            <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
              Componentes reutilizáveis
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-lg text-[var(--fg-secondary)]"
          >
            Defina uma vez, use em qualquer lugar. Crie bibliotecas de
            componentes para seus protótipos.
          </motion.p>
        </div>

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
                  <h3 className="text-lg font-bold text-neutral-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600">{item.desc}</p>
                  <p className="mt-1 text-sm text-neutral-500">
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
  ),

  // Slide 9: Export
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-5xl space-y-12 px-8">
        <motion.h2
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="text-center text-5xl font-bold"
        >
          <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
            Export & Compartilhamento
          </span>
        </motion.h2>

        <div className="grid grid-cols-2 gap-12">
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
            <div className="relative rounded-2xl border-2 border-[var(--accent)] bg-gradient-to-br from-[var(--accent)]/20 to-transparent p-12 shadow-lg">
              <Download className="h-20 w-20 text-[var(--accent)]" />
              <div className="absolute inset-0 rounded-2xl bg-[var(--accent)]/10" />
            </div>
            <p className="mt-6 text-center text-xl font-semibold">
              Protótipo standalone
            </p>
            <p className="text-center text-[var(--fg-secondary)]">
              HTML completo, sem dependências
            </p>
          </motion.div>

          {/* Topics */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col justify-center space-y-6"
          >
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-[var(--accent)]">
                Recursos:
              </h3>
              {[
                {
                  title: 'HTML Self-contained',
                  desc: 'Tudo em um único arquivo',
                },
                {
                  title: 'Zero Dependências',
                  desc: 'Funciona em qualquer navegador',
                },
                {
                  title: 'Compartilhamento Fácil',
                  desc: 'Email, Slack, ou hospede online',
                },
                {
                  title: 'Interativo',
                  desc: 'Navegação entre telas funcional',
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

  // Slide 10: Encerramento
  () => (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="max-w-6xl space-y-12 px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 text-center"
        >
          <h2 className="text-6xl font-bold">Itere mais rápido</h2>
          <p className="text-2xl font-light text-[var(--fg-secondary)]">
            Text-first prototyping para desenvolvedores
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-12">
          {/* Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center justify-center gap-8"
          >
            <div className="flex gap-8">
              {[
                { Icon: Code2, label: 'DSL Simples' },
                { Icon: Zap, label: 'Preview Rápido' },
                { Icon: Package, label: 'HTML Export' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.15 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="rounded-full border-2 border-[var(--accent)] bg-[var(--accent)]/10 p-4">
                    <item.Icon className="h-8 w-8 text-[var(--accent)]" />
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
                  className="h-14 px-10 text-lg font-semibold shadow-xl"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Experimente Proto-Typed
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Recap */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col justify-center space-y-6"
          >
            <h3 className="text-2xl font-semibold text-[var(--accent)]">
              Recapitulando:
            </h3>
            <div className="space-y-4">
              {[
                '✓ Sintaxe simples e intuitiva',
                '✓ Preview instantâneo em tempo real',
                '✓ Navegação entre múltiplas telas',
                '✓ Componentes reutilizáveis',
                '✓ Export standalone sem dependências',
                '✓ Perfeito para validação rápida de ideias',
              ].map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + i * 0.1 }}
                  className="text-lg text-[var(--foreground)]"
                >
                  {text}
                </motion.div>
              ))}
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
