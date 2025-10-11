// ============================================================
// ERROR BUS - Sistema de Pub/Sub para Erros
// ============================================================
// Singleton para centralizar coleta e distribuição de erros
// de todas as camadas do pipeline (Lexer → Parser → Builder → Renderer)

import type { ProtoError, Stage } from '../types/errors';

// ============================================================
// ErrorBus: Singleton para pub/sub de erros
// ============================================================
export class ErrorBus {
  private static instance: ErrorBus;
  private listeners: ((errors: ProtoError[]) => void)[] = [];
  private errors: ProtoError[] = [];

  // ==========================================================
  // SINGLETON PATTERN
  // ==========================================================
  private constructor() {
    // Private constructor para forçar uso de get()
  }

  static get(): ErrorBus {
    if (!ErrorBus.instance) {
      ErrorBus.instance = new ErrorBus();
    }
    return ErrorBus.instance;
  }

  // ==========================================================
  // DEDUPE: Evita duplicatas por chave composta
  // ==========================================================
  private hasDuplicate(err: ProtoError): boolean {
    const key = this.getErrorKey(err);
    return this.errors.some((e) => this.getErrorKey(e) === key);
  }

  private getErrorKey(err: ProtoError): string {
    // Chave: stage|line|column|code|messagePrefix(16 chars)
    const msgPrefix = err.message.slice(0, 16);
    return `${err.stage}|${err.line ?? '?'}|${err.column ?? '?'}|${err.code}|${msgPrefix}`;
  }

  // ==========================================================
  // EMIT: Adiciona erro único (com dedupe automático)
  // ==========================================================
  emit(err: ProtoError): void {
    if (!this.hasDuplicate(err)) {
      this.errors.push(err);
      this.notify();
    }
  }

  // ==========================================================
  // BULK: Adiciona múltiplos erros de uma vez (preferível)
  // ==========================================================
  bulk(errs: ProtoError[]): void {
    let added = false;
    for (const e of errs) {
      if (!this.hasDuplicate(e)) {
        this.errors.push(e);
        added = true;
      }
    }
    if (added) {
      this.notify();
    }
  }

  // ==========================================================
  // CLEAR: Limpa erros (tudo ou filtrado por stage)
  // ==========================================================
  clear(stage?: Stage): void {
    this.errors = stage ? this.errors.filter((e) => e.stage !== stage) : [];
    this.notify();
  }

  // ==========================================================
  // GETTERS & SUBSCRIBE
  // ==========================================================
  getAll(): ProtoError[] {
    return [...this.errors];
  }

  /**
   * Subscreve para receber notificações de mudanças nos erros
   * @returns Função unsubscribe
   */
  subscribe(cb: (errors: ProtoError[]) => void): () => void {
    this.listeners.push(cb);

    // Immediately notify the new subscriber with current snapshot so
    // late subscribers (for example Monaco mounted after errors were
    // emitted) receive the existing errors and can render markers.
    try {
      cb([...this.errors]);
    } catch (err) {
      console.error('Error in ErrorBus initial notify:', err);
    }

    // Retorna unsubscribe function
    return () => {
      const index = this.listeners.indexOf(cb);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // ==========================================================
  // HELPERS
  // ==========================================================

  /**
   * Retorna quantidade total de erros
   */
  count(): number {
    return this.errors.length;
  }

  /**
   * Retorna erros por stage
   */
  getByStage(stage: Stage): ProtoError[] {
    return this.errors.filter((e) => e.stage === stage);
  }

  /**
   * Verifica se há erros fatais
   */
  hasFatalErrors(): boolean {
    return this.errors.some((e) => e.severity === 'fatal');
  }

  // ==========================================================
  // PRIVATE: Notifica todos os subscribers
  // ==========================================================
  private notify(): void {
    // Notifica todos os subscribers com cópia imutável
    const snapshot = [...this.errors];
    this.listeners.forEach((cb) => {
      try {
        cb(snapshot);
      } catch (error) {
        console.error('Error in ErrorBus subscriber:', error);
      }
    });
  }

  // ==========================================================
  // DEBUG: Para desenvolvimento
  // ==========================================================
  debug(): void {
    console.group('🚌 ErrorBus Debug');
    console.log('Total errors:', this.count());
    console.log('Fatal errors:', this.hasFatalErrors());
    console.log('Errors by stage:', {
      lexer: this.getByStage('lexer').length,
      parser: this.getByStage('parser').length,
      builder: this.getByStage('builder').length,
      renderer: this.getByStage('renderer').length,
      editor: this.getByStage('editor').length,
    });
    console.table(this.errors);
    console.groupEnd();
  }
}

// ==========================================================
// EXPORT: Instância singleton para uso conveniente
// ==========================================================
export const errorBus = ErrorBus.get();
