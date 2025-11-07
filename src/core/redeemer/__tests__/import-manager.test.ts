import { describe, test, expect, beforeEach } from '@jest/globals';
import { ImportManager } from '../infrastructure/import-manager';

describe('ImportManager', () => {
  let importManager: ImportManager;

  beforeEach(() => {
    importManager = new ImportManager();
  });

  test('should add React imports', () => {
    importManager.addReactImport('useState');
    importManager.addReactImport('useEffect');

    const imports = importManager.generateImports();

    expect(imports).toContain('import { useState, useEffect } from \'react\'');
  });

  test('should add shadcn components', () => {
    importManager.addShadcnComponent('Button');
    importManager.addShadcnComponent('Input');

    const imports = importManager.generateImports();

    expect(imports).toContain('import { Button } from \'@/components/ui/button\'');
    expect(imports).toContain('import { Input } from \'@/components/ui/input\'');
  });

  test('should add Lucide icons', () => {
    importManager.addLucideIcon('Home');
    importManager.addLucideIcon('User');

    const imports = importManager.generateImports();

    expect(imports).toContain('import { Home, User } from \'lucide-react\'');
  });

  test('should add Next.js imports', () => {
    importManager.addNextImport('Link');
    importManager.addNextImport('Image');

    const imports = importManager.generateImports();

    expect(imports).toContain('import Link from \'next/link\'');
    expect(imports).toContain('import Image from \'next/image\'');
  });

  test('should handle multiple component types', () => {
    importManager.addReactImport('useState');
    importManager.addShadcnComponent('Button');
    importManager.addLucideIcon('Home');
    importManager.addNextImport('Link');

    const imports = importManager.generateImports();

    expect(imports).toContain('react');
    expect(imports).toContain('Button');
    expect(imports).toContain('Home');
    expect(imports).toContain('Link');
  });

  test('should group Select components correctly', () => {
    importManager.addShadcnComponent('Select');
    importManager.addShadcnComponent('SelectTrigger');
    importManager.addShadcnComponent('SelectContent');

    const imports = importManager.generateImports();

    // All Select components should use the same import path
    const selectImports = imports.match(/import.*from.*select/g);
    expect(selectImports).toHaveLength(3);
    selectImports?.forEach(imp => {
      expect(imp).toContain('@/components/ui/select');
    });
  });

  test('should reset correctly', () => {
    importManager.addReactImport('useState');
    importManager.addShadcnComponent('Button');

    importManager.reset();

    const imports = importManager.generateImports();

    expect(imports).toBe('');
  });

  test('should not duplicate imports', () => {
    importManager.addReactImport('useState');
    importManager.addReactImport('useState'); // duplicate

    const imports = importManager.generateImports();

    expect(imports.match(/useState/g)).toHaveLength(1);
  });

  test('should sort imports alphabetically', () => {
    importManager.addReactImport('useEffect');
    importManager.addReactImport('useState');
    importManager.addReactImport('useCallback');

    const imports = importManager.generateImports();

    expect(imports).toContain('useCallback, useEffect, useState');
  });
});
