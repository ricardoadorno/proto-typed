"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocsHeader } from "@/components/layouts/components/docs-header";
import DocsFooter from "@/components/layouts/components/docs-footer";

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  backgroundColor?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Proto-Typed",
    subtitle: "A linguagem declarativa para interfaces",
    content: (
      <div className="space-y-6">
        <p className="text-2xl text-[var(--fg-secondary)] max-w-3xl mx-auto">
          Crie interfaces complexas com uma sintaxe simples e intuitiva
        </p>
        <div className="flex gap-4 justify-center mt-12">
          <div className="px-6 py-3 bg-[var(--brand-500)] text-white rounded-lg font-medium">
            Declarativo
          </div>
          <div className="px-6 py-3 bg-[var(--brand-500)] text-white rounded-lg font-medium">
            Rápido
          </div>
          <div className="px-6 py-3 bg-[var(--brand-500)] text-white rounded-lg font-medium">
            Eficiente
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Sintaxe Simples",
    subtitle: "Escreva menos, faça mais",
    content: (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-lg p-8">
          <pre className="text-left text-lg font-mono">
            <code className="text-[var(--brand-400)]">
{`screen Welcome:
  # Bem-vindo ao Proto-Typed
  > Uma linguagem para criar interfaces

  @[Começar](next-screen)
  @_[Documentação](docs)`}
            </code>
          </pre>
        </div>
        <p className="text-xl text-[var(--fg-secondary)]">
          Sintaxe inspirada em Markdown, fácil de ler e escrever
        </p>
      </div>
    ),
  },
  {
    id: 3,
    title: "Componentes Poderosos",
    subtitle: "Tudo que você precisa, built-in",
    content: (
      <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-lg p-6 hover:border-[var(--brand-400)] transition-all">
          <h3 className="text-2xl font-semibold mb-3 text-[var(--brand-400)]">Navegação</h3>
          <p className="text-[var(--fg-secondary)]">Headers, navigators, drawers e modais</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-lg p-6 hover:border-[var(--brand-400)] transition-all">
          <h3 className="text-2xl font-semibold mb-3 text-[var(--brand-400)]">Formulários</h3>
          <p className="text-[var(--fg-secondary)]">Inputs, checkboxes, selects e validação</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-lg p-6 hover:border-[var(--brand-400)] transition-all">
          <h3 className="text-2xl font-semibold mb-3 text-[var(--brand-400)]">Layout</h3>
          <p className="text-[var(--fg-secondary)]">Cards, listas, grids e separadores</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-lg p-6 hover:border-[var(--brand-400)] transition-all">
          <h3 className="text-2xl font-semibold mb-3 text-[var(--brand-400)]">Interação</h3>
          <p className="text-[var(--fg-secondary)]">Botões, badges, tooltips e muito mais</p>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Temas Personalizáveis",
    subtitle: "Adapte ao seu design system",
    content: (
      <div className="space-y-8 max-w-4xl mx-auto">
        <p className="text-xl text-[var(--fg-secondary)]">
          Sistema de temas flexível baseado em CSS Custom Properties
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-32 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
            Oceano
          </div>
          <div className="h-32 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-semibold shadow-lg">
            Pôr do Sol
          </div>
          <div className="h-32 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-semibold shadow-lg">
            Floresta
          </div>
        </div>
        <p className="text-lg text-[var(--fg-secondary)]">
          Defina cores, tipografia e espaçamentos de forma centralizada
        </p>
      </div>
    ),
  },
  {
    id: 5,
    title: "Começe Agora",
    subtitle: "Experimente o Proto-Typed",
    content: (
      <div className="space-y-8 max-w-4xl mx-auto">
        <p className="text-2xl text-[var(--fg-secondary)]">
          Acesse o playground e comece a criar suas interfaces
        </p>
        <div className="flex flex-col gap-4 items-center mt-12">
          <Button
            size="lg"
            className="text-xl px-12 py-6 bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white"
            onClick={() => window.location.href = '/'}
          >
            Ir para o Playground
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-xl px-12 py-6"
            onClick={() => window.location.href = '/docs'}
          >
            Ver Documentação
          </Button>
        </div>
      </div>
    ),
  },
];

export default function SlidePresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev" | null>(null);

  const goToNextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setSlideDirection("next");
      setCurrentSlide(currentSlide + 1);
    }
  }, [currentSlide]);

  const goToPrevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setSlideDirection("prev");
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          goToNextSlide();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goToPrevSlide();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Home":
          e.preventDefault();
          setSlideDirection("prev");
          setCurrentSlide(0);
          break;
        case "End":
          e.preventDefault();
          setSlideDirection("next");
          setCurrentSlide(slides.length - 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, goToNextSlide, goToPrevSlide]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--fg-primary)] flex flex-col">
      {!isFullscreen && <DocsHeader />}

      <main className="flex-1 flex flex-col">
        {/* Slide Container */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-[var(--bg-main)] to-[var(--bg-surface)]">
          {/* Slide Content */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center p-8 md:p-16 transition-all duration-500 ease-in-out ${
              slideDirection === "next"
                ? "animate-slide-in-right"
                : slideDirection === "prev"
                ? "animate-slide-in-left"
                : ""
            }`}
            key={slide.id}
          >
            <div className="max-w-6xl w-full space-y-8 text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-[var(--fg-primary)] leading-tight">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-2xl md:text-3xl text-[var(--brand-400)] font-medium">
                  {slide.subtitle}
                </p>
              )}
              <div className="mt-12">
                {slide.content}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-8 md:px-16 pointer-events-none">
            <Button
              onClick={goToPrevSlide}
              disabled={currentSlide === 0}
              variant="ghost"
              size="lg"
              className="pointer-events-auto bg-[var(--bg-surface)]/80 backdrop-blur-sm hover:bg-[var(--bg-surface)] border border-[var(--border-muted)] disabled:opacity-30"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              onClick={goToNextSlide}
              disabled={currentSlide === slides.length - 1}
              variant="ghost"
              size="lg"
              className="pointer-events-auto bg-[var(--bg-surface)]/80 backdrop-blur-sm hover:bg-[var(--bg-surface)] border border-[var(--border-muted)] disabled:opacity-30"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Slide Counter & Controls */}
          <div className="absolute top-8 right-8 flex items-center gap-4">
            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="sm"
              className="bg-[var(--bg-surface)]/80 backdrop-blur-sm hover:bg-[var(--bg-surface)] border border-[var(--border-muted)]"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <div className="bg-[var(--bg-surface)]/80 backdrop-blur-sm border border-[var(--border-muted)] px-4 py-2 rounded-lg font-mono text-sm">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-[var(--bg-surface)]/50">
            <div
              className="h-full bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-400)] transition-all duration-500 ease-out"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            />
          </div>

          {/* Slide Dots */}
          <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setSlideDirection(index > currentSlide ? "next" : "prev");
                  setCurrentSlide(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-[var(--brand-500)] w-8"
                    : "bg-[var(--border-muted)] hover:bg-[var(--brand-400)]"
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts Help */}
        {!isFullscreen && (
          <div className="bg-[var(--bg-surface)] border-t border-[var(--border-muted)] px-8 py-4">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--fg-secondary)]">
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-[var(--bg-main)] border border-[var(--border-muted)] rounded">←</kbd>
                <kbd className="px-2 py-1 bg-[var(--bg-main)] border border-[var(--border-muted)] rounded">→</kbd>
                Navegar
              </span>
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-[var(--bg-main)] border border-[var(--border-muted)] rounded">F</kbd>
                Tela cheia
              </span>
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-[var(--bg-main)] border border-[var(--border-muted)] rounded">Home</kbd>
                <kbd className="px-2 py-1 bg-[var(--bg-main)] border border-[var(--border-muted)] rounded">End</kbd>
                Primeiro/Último
              </span>
            </div>
          </div>
        )}
      </main>

      {!isFullscreen && <DocsFooter />}

      <style jsx global>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
