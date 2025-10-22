// ============================================================
// ERROR BUS - Sistema de Pub/Sub para Erros
// ============================================================
// Singleton para centralizar coleta e distribuição de erros
// de todas as camadas do pipeline (Lexer → Parser → Builder → Renderer)

import type { ProtoError, Stage } from '../types/errors';

/**
 * @class ErrorBus
 * @description A singleton class that implements a publish-subscribe system for handling errors.
 * It centralizes the collection and distribution of errors from all stages of the DSL processing pipeline
 * (Lexer, Parser, Builder, Renderer). This allows different parts of the application to subscribe to error
 * updates and react accordingly, for example, by displaying them in an editor.
 */
export class ErrorBus {
  private static instance: ErrorBus;
  private listeners: ((errors: ProtoError[]) => void)[] = [];
  private errors: ProtoError[] = [];

  // ==========================================================
  // SINGLETON PATTERN
  // ==========================================================
  private constructor() {
    // Private constructor to enforce the singleton pattern.
  }

  /**
   * @method get
   * @description Gets the singleton instance of the ErrorBus.
   * @static
   * @returns {ErrorBus} The singleton instance.
   */
  static get(): ErrorBus {
    if (!ErrorBus.instance) {
      ErrorBus.instance = new ErrorBus();
    }
    return ErrorBus.instance;
  }

  // ==========================================================
  // DEDUPE: Evita duplicatas por chave composta
  // ==========================================================
  /**
   * @method hasDuplicate
   * @description Checks if an error is a duplicate of an existing error in the bus.
   * @private
   * @param {ProtoError} err - The error to check.
   * @returns {boolean} True if the error is a duplicate, false otherwise.
   */
  private hasDuplicate(err: ProtoError): boolean {
    const key = this.getErrorKey(err);
    return this.errors.some((e) => this.getErrorKey(e) === key);
  }

  /**
   * @method getErrorKey
   * @description Generates a unique key for an error based on its properties.
   * This key is used for deduplication.
   * @private
   * @param {ProtoError} err - The error to generate a key for.
   * @returns {string} The unique error key.
   */
  private getErrorKey(err: ProtoError): string {
    // Chave: stage|line|column|code|messagePrefix(16 chars)
    const msgPrefix = err.message.slice(0, 16);
    return `${err.stage}|${err.line ?? '?'}|${err.column ?? '?'}|${err.code}|${msgPrefix}`;
  }

  // ==========================================================
  // EMIT: Adiciona erro único (com dedupe automático)
  // ==========================================================
  /**
   * @method emit
   * @description Adds a single error to the bus. It automatically handles deduplication.
   * @param {ProtoError} err - The error to add.
   */
  emit(err: ProtoError): void {
    if (!this.hasDuplicate(err)) {
      this.errors.push(err);
      this.notify();
    }
  }

  // ==========================================================
  // BULK: Adiciona múltiplos erros de uma vez (preferível)
  // ==========================================================
  /**
   * @method bulk
   * @description Adds multiple errors to the bus at once. This is the preferred method for adding errors.
   * @param {ProtoError[]} errs - An array of errors to add.
   */
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
  /**
   * @method clear
   * @description Clears errors from the bus. Can clear all errors or only those from a specific stage.
   * @param {Stage} [stage] - The optional stage to clear errors from.
   */
  clear(stage?: Stage): void {
    this.errors = stage ? this.errors.filter((e) => e.stage !== stage) : [];
    this.notify();
  }

  // ==========================================================
  // GETTERS & SUBSCRIBE
  // ==========================================================
  /**
   * @method getAll
   * @description Gets all the errors currently in the bus.
   * @returns {ProtoError[]} An array of all errors.
   */
  getAll(): ProtoError[] {
    return [...this.errors];
  }

  /**
   * @method subscribe
   * @description Subscribes to changes in the error list.
   * The provided callback will be called immediately with the current errors, and then again whenever the error list changes.
   * @param {(errors: ProtoError[]) => void} cb - The callback function to be called with the error list.
   * @returns {() => void} A function to unsubscribe from the updates.
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
   * @method count
   * @description Returns the total number of errors in the bus.
   * @returns {number} The total number of errors.
   */
  count(): number {
    return this.errors.length;
  }

  /**
   * @method getByStage
   * @description Returns all errors for a specific stage.
   * @param {Stage} stage - The stage to get errors for.
   * @returns {ProtoError[]} An array of errors for the specified stage.
   */
  getByStage(stage: Stage): ProtoError[] {
    return this.errors.filter((e) => e.stage === stage);
  }

  /**
   * @method hasFatalErrors
   * @description Checks if there are any fatal errors in the bus.
   * @returns {boolean} True if there is at least one fatal error, false otherwise.
   */
  hasFatalErrors(): boolean {
    return this.errors.some((e) => e.severity === 'fatal');
  }

  // ==========================================================
  // PRIVATE: Notifica todos os subscribers
  // ==========================================================
  /**
   * @method notify
   * @description Notifies all subscribers of changes to the error list.
   * @private
   */
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
  /**
   * @method debug
   * @description Logs debug information about the ErrorBus to the console.
   */
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

/**
 * @const errorBus
 * @description The singleton instance of the ErrorBus, for convenient access throughout the application.
 */
export const errorBus = ErrorBus.get();
