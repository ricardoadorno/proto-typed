'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { ChevronLeft, ChevronRight, Download, Zap, Code2, Smartphone, GitBranch, Package, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

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

const CodeBlock = ({ children, highlight = false }: { children: string; highlight?: boolean }) => (
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

const PhoneFrame = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
    transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
    className="relative"
    style={{ perspective: '1000px' }}
  >
    <div className="relative mx-auto h-[600px] w-[300px] rounded-[2.5rem] border-8 border-neutral-800 bg-white shadow-2xl">
      <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-neutral-800" />
      <div className="h-full w-full overflow-hidden rounded-[1.8rem] bg-white p-4">
        {children}
      </div>
    </div>
  </motion.div>
)

const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
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
      <motion.div key={label} custom={i} variants={fadeIn} className="flex items-center gap-4">
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
  // Slide 1: Abertura
  () => (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="max-w-4xl space-y-8 px-8 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        >
          <h1 className="bg-gradient-to-r from-[var(--accent)] to-purple-600 bg-clip-text text-7xl font-bold text-transparent">
            Proto-Typed
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-3xl font-light text-[var(--fg-secondary)]"
        >
          Text → Prototype
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex justify-center gap-8 pt-8"
        >
          {['screen', 'Home:', 'container:', '## Welcome'].map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
              className="rounded-md border border-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 font-mono text-sm"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  ),

  // Slide 2: O Problema
  () => (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="max-w-4xl space-y-16 px-8 text-center">
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-5xl font-bold"
        >
          Prototipar rápido é difícil.
        </motion.h2>

        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: '🐌', text: 'Ferramentas pesadas' },
            { icon: '🎨', text: 'Muito visual' },
            { icon: '⏱️', text: 'Lento para iterar' },
          ].map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.1 }}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-8"
            >
              <div className="mb-4 text-5xl">{item.icon}</div>
              <p className="text-lg text-[var(--fg-secondary)]">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  ),

  // Slide 3: A Ideia
  () => (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="max-w-4xl space-y-16 px-8 text-center">
        <motion.div variants={scaleIn} initial="hidden" animate="visible" className="space-y-8">
          <h2 className="text-6xl font-bold">Escreva.</h2>
          <div className="flex items-center justify-center gap-8">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <Code2 className="h-24 w-24 text-[var(--accent)]" />
            </motion.div>
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="h-16 w-16 text-[var(--fg-secondary)]" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 0.5 }}
            >
              <Smartphone className="h-24 w-24 text-[var(--accent)]" />
            </motion.div>
          </div>
          <h2 className="text-6xl font-bold">Veja.</h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xl text-[var(--fg-secondary)]"
        >
          Preview instantâneo
        </motion.p>
      </div>
    </div>
  ),

  // Slide 4: A DSL
  () => (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="max-w-4xl space-y-12 px-8">
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center text-5xl font-bold"
        >
          A DSL
        </motion.h2>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
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
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col justify-center space-y-4"
          >
            {['Simples', 'Legível', 'Rápido'].map((word, i) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 + i * 0.2 }}
                className="flex items-center gap-3 text-2xl font-semibold"
              >
                <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                {word}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  ),

  // Slide 5: Preview em Tempo Real
  () => (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="max-w-6xl px-8">
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-12 text-center text-5xl font-bold"
        >
          Preview em tempo real
        </motion.h2>

        <div className="grid grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="space-y-4">
              <div className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-secondary)]">
                <TypewriterText text="Digite..." delay={500} />
              </div>
              <CodeBlock>
                {`screen Home:
  container:
    ## Welcome
    @primary[Next]`}
              </CodeBlock>
            </div>
          </motion.div>

          <div className="flex items-center justify-center">
            <PhoneFrame>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="flex h-full flex-col items-center justify-center gap-6"
              >
                <h2 className="text-2xl font-bold text-neutral-900">Welcome</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg bg-[var(--accent)] px-6 py-3 font-semibold text-white shadow-lg"
                >
                  Next
                </motion.button>
              </motion.div>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </div>
  ),

  // Slide 6: AST e Pipeline
  () => (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="max-w-5xl space-y-16 px-8">
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center text-5xl font-bold"
        >
          Pipeline
        </motion.h2>

        <FlowDiagram />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-center text-lg text-[var(--fg-secondary)]"
        >
          Parser robusto + AST estruturada
        </motion.div>
      </div>
    </div>
  ),

  // Slide 7: Múltiplas Telas
  () => (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="max-w-4xl space-y-12 px-8 text-center">
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-5xl font-bold"
        >
          Navegação entre telas
        </motion.h2>

        <div className="flex items-center justify-center gap-8">
          {['Home', 'Details', 'Settings'].map((screen, i) => (
            <motion.div
              key={screen}
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Card className="flex h-48 w-36 items-center justify-center border-2 border-[var(--accent)] bg-gradient-to-br from-[var(--accent)]/10 to-transparent p-4">
                <div className="text-center">
                  <Smartphone className="mx-auto mb-2 h-12 w-12 text-[var(--accent)]" />
                  <p className="font-semibold">{screen}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-xl text-[var(--fg-secondary)]"
        >
          @[Link](ScreenName)
        </motion.div>
      </div>
    </div>
  ),

  // Slide 8: Componentização
  () => (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="max-w-4xl space-y-12 px-8">
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center text-5xl font-bold"
        >
          Componentes reutilizáveis
        </motion.h2>

        <div className="grid grid-cols-2 gap-8">
          <CodeBlock>
            {`component Card:
  card:
    >> %title
    >>> %subtitle
    @outline[View]

list $Card:
  - Item 1 | Desc 1
  - Item 2 | Desc 2`}
          </CodeBlock>

          <motion.div
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center gap-4"
          >
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeIn}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="p-4">
                  <h3 className="font-semibold">Item {i}</h3>
                  <p className="text-sm text-[var(--fg-secondary)]">Desc {i}</p>
                  <button className="mt-2 text-sm text-[var(--accent)]">View</button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  ),

  // Slide 9: Export
  () => (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="max-w-4xl space-y-16 px-8 text-center">
        <motion.h2
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="text-6xl font-bold"
        >
          HTML Export
        </motion.h2>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 100 }}
          className="flex justify-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-2xl border-2 border-[var(--accent)] bg-gradient-to-br from-[var(--accent)]/20 to-transparent p-12"
          >
            <Download className="h-24 w-24 text-[var(--accent)]" />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-2xl text-[var(--fg-secondary)]"
        >
          Protótipo standalone
        </motion.p>
      </div>
    </div>
  ),

  // Slide 10: Encerramento
  () => (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="max-w-4xl space-y-12 px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="text-6xl font-bold">Itere mais rápido.</h2>
          <p className="text-3xl font-light text-[var(--fg-secondary)]">
            Text-first prototyping
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="pt-8"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="h-16 px-12 text-xl font-semibold shadow-2xl"
            >
              <Zap className="mr-2 h-6 w-6" />
              Try Proto-Typed
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center gap-12 pt-8"
        >
          {[
            { icon: Code2, label: 'DSL' },
            { icon: Zap, label: 'Fast' },
            { icon: Package, label: 'Export' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              className="flex flex-col items-center gap-2 text-[var(--fg-secondary)]"
            >
              <item.icon className="h-8 w-8" />
              <span className="text-sm">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  ),
]

// ==================== MAIN COMPONENT ====================

export default function SlidesPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)

  const paginate = (newDirection: number) => {
    const nextSlide = currentSlide + newDirection
    if (nextSlide >= 0 && nextSlide < slides.length) {
      setDirection(newDirection)
      setCurrentSlide(nextSlide)
    }
  }

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
    <div className="relative h-screen w-full overflow-hidden bg-[var(--background)]">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <CurrentSlideComponent />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => paginate(-1)}
          disabled={currentSlide === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-lg transition-opacity disabled:opacity-30"
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.button>

        <div className="flex gap-2">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setDirection(i > currentSlide ? 1 : -1)
                setCurrentSlide(i)
              }}
              whileHover={{ scale: 1.2 }}
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
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-lg transition-opacity disabled:opacity-30"
        >
          <ChevronRight className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Slide counter */}
      <div className="fixed right-8 top-8 z-50 font-mono text-sm text-[var(--fg-secondary)]">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  )
}
