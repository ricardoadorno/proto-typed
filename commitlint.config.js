export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nova funcionalidade
        'fix', // Correção de bug
        'docs', // Documentação
        'style', // Formatação (não afeta o código)
        'refactor', // Refatoração
        'perf', // Melhoria de performance
        'test', // Adição/modificação de testes
        'build', // Sistema de build
        'ci', // CI/CD
        'chore', // Tarefas gerais
        'revert', // Reverter commit
      ],
    ],
    'subject-case': [0], // Permite qualquer case no subject
  },
}
