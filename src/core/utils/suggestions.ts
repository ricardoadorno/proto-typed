// ============================================================
// SUGGESTIONS - Heurísticas para Hints Acionáveis
// ============================================================
// Algoritmos para sugerir correções baseados em similaridade
// (Levenshtein distance para typos comuns)

// ============================================================
// Levenshtein Distance (Edit Distance)
// ============================================================

/**
 * Calcula distância de Levenshtein entre duas strings
 * Representa o número mínimo de edições (inserção, remoção, substituição)
 * necessárias para transformar uma string na outra
 * 
 * Complexidade: O(n * m) onde n e m são os tamanhos das strings
 * 
 * @param a Primeira string
 * @param b Segunda string
 * @returns Número de edições necessárias
 */
export function levenshtein(a: string, b: string): number {
  // Matriz de programação dinâmica
  const matrix: number[][] = [];

  // Inicializa primeira coluna (transformar string vazia em b)
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // Inicializa primeira linha (transformar string vazia em a)
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Preenche matriz com custos mínimos
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        // Caracteres iguais: sem custo
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        // Caracteres diferentes: mínimo entre 3 operações
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substituição
          matrix[i][j - 1] + 1, // inserção
          matrix[i - 1][j] + 1 // remoção
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// ============================================================
// Similarity-based Suggestions
// ============================================================

/**
 * Encontra a sugestão mais próxima em um dicionário
 * Útil para corrigir typos em: layout modifiers, component props, navigation targets
 * 
 * @param input String digitada pelo usuário (potencialmente com erro)
 * @param dictionary Array de strings válidas
 * @param maxDistance Distância máxima para considerar uma sugestão (default: 2)
 * @returns String mais similar ou null se nenhuma for próxima o suficiente
 * 
 * @example
 * suggestClosest('centerx', ['center', 'start', 'end']) // 'center'
 * suggestClosest('bton', ['button', 'bottom', 'button-group']) // 'button'
 */
export function suggestClosest(
  input: string,
  dictionary: string[],
  maxDistance: number = 2
): string | null {
  if (!input || dictionary.length === 0) {
    return null;
  }

  let bestMatch: string | null = null;
  let bestDistance = maxDistance + 1;

  for (const word of dictionary) {
    const distance = levenshtein(input.toLowerCase(), word.toLowerCase());

    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = word;
    }
  }

  // Retorna apenas se encontrou algo dentro do limite de distância
  return bestDistance <= maxDistance ? bestMatch : null;
}

/**
 * Encontra as N melhores sugestões ordenadas por similaridade
 * 
 * @param input String digitada pelo usuário
 * @param dictionary Array de strings válidas
 * @param topN Quantas sugestões retornar (default: 3)
 * @param maxDistance Distância máxima (default: 3)
 * @returns Array de sugestões ordenadas por similaridade
 * 
 * @example
 * suggestTopN('centr', ['center', 'central', 'between', 'start'], 3)
 * // ['center', 'central']
 */
export function suggestTopN(
  input: string,
  dictionary: string[],
  topN: number = 3,
  maxDistance: number = 3
): string[] {
  if (!input || dictionary.length === 0) {
    return [];
  }

  // Calcula distância para cada palavra
  const scored = dictionary
    .map((word) => ({
      word,
      distance: levenshtein(input.toLowerCase(), word.toLowerCase()),
    }))
    .filter((item) => item.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, topN);

  return scored.map((item) => item.word);
}

// ============================================================
// Context-Specific Helpers
// ============================================================

/**
 * Sugere layout modifier baseado em dicionário conhecido
 */
export function suggestLayoutModifier(input: string): string | null {
  const VALID_MODIFIERS = [
    // Alignment
    'center',
    'start',
    'end',
    'between',
    'around',
    'evenly',
    // Sizes
    'tight',
    'loose',
    'flush',
    'compact',
    'narrow',
    'wide',
    'full',
    // Grid
    'auto',
  ];

  return suggestClosest(input, VALID_MODIFIERS);
}

/**
 * Sugere button variant baseado em dicionário conhecido
 */
export function suggestButtonVariant(input: string): string | null {
  const VALID_VARIANTS = [
    'primary',
    'secondary',
    'outline',
    'ghost',
    'destructive',
    'link',
    'success',
    'warning',
  ];

  return suggestClosest(input, VALID_VARIANTS);
}

/**
 * Sugere button size baseado em dicionário conhecido
 */
export function suggestButtonSize(input: string): string | null {
  const VALID_SIZES = ['xs', 'sm', 'md', 'lg'];

  return suggestClosest(input, VALID_SIZES, 1); // Distância 1 (mais restritivo)
}

/**
 * Sugere input type baseado em dicionário conhecido
 */
export function suggestInputType(input: string): string | null {
  const VALID_TYPES = [
    'text',
    'email',
    'password',
    'date',
    'number',
    'textarea',
    'select',
  ];

  return suggestClosest(input, VALID_TYPES);
}

// ============================================================
// Formatting Helpers
// ============================================================

/**
 * Formata hint de sugestão para exibição
 */
export function formatSuggestionHint(
  invalidValue: string,
  suggestion: string
): string {
  return `Did you mean "${suggestion}"?`;
}

/**
 * Formata hint com lista de valores válidos
 */
export function formatValidOptionsHint(validOptions: string[]): string {
  if (validOptions.length === 0) return '';
  if (validOptions.length <= 3) {
    return `Valid options: ${validOptions.join(', ')}`;
  }
  // Se muitas opções, mostra só as 3 primeiras
  return `Valid options: ${validOptions.slice(0, 3).join(', ')}, ...`;
}

/**
 * Formata hint completo com sugestão + lista
 */
export function formatFullHint(
  invalidValue: string,
  dictionary: string[]
): string {
  const suggestion = suggestClosest(invalidValue, dictionary);

  if (suggestion) {
    return formatSuggestionHint(invalidValue, suggestion);
  }

  return formatValidOptionsHint(dictionary);
}
