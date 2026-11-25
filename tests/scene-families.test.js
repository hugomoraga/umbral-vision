import { describe, it, expect } from 'vitest';
import {
  AUDIT_DECISIONS,
  EFFECT_AUDIT,
  FAMILIES,
  FAMILY_LIST,
  validateFamilyCatalog,
  listFamilies,
  getFamily,
  getVariant,
  getDefaultVariant,
  getDefaultVariantForEffect,
  resolveVariant,
  getClassicEffects,
  isClassicEffect,
  getAudit
} from '../src/scene/families.js';

describe('family catalog', () => {
  it('es coherente y no tiene familias sin variantes', () => {
    expect(validateFamilyCatalog()).toEqual([]);
    expect(FAMILY_LIST).toHaveLength(8);
    for (const family of Object.values(FAMILIES)) {
      expect(Object.keys(family.variants).length).toBeGreaterThan(0);
      expect(family.variants[family.defaultVariant]).toBeTruthy();
    }
  });

  it('audita los 19 efectos con una decisión válida', () => {
    const effects = Object.keys(EFFECT_AUDIT);
    expect(effects).toHaveLength(19);
    for (const effect of effects) {
      const audit = getAudit(effect);
      expect(AUDIT_DECISIONS).toContain(audit.decision);
      expect(getFamily(audit.family)).toBeTruthy();
    }
  });

  it('expone 7 familias principales y Clásicos aparte', () => {
    expect(listFamilies({ includeClassics: false })).toHaveLength(7);
    expect(listFamilies()).toHaveLength(8);
    for (const family of listFamilies({ includeClassics: false })) {
      const implemented = Object.values(family.variants).filter((v) => v.implemented !== false);
      expect(implemented.length).toBeGreaterThan(0);
    }
  });

  it('resuelve variantes al efecto real', () => {
    expect(resolveVariant('fluidFields', 'torus').effect).toBe('fluidFields');
    expect(resolveVariant('fluidFields', 'ribbon').effect).toBe('fluidFields');
    expect(resolveVariant('kineticGeometry', 'spiral').effect).toBe('spiral');
    expect(resolveVariant('kineticGeometry', 'sacred').effect).toBe('sacredGeometry');
    expect(resolveVariant('fluidFields', 'nope').variantId).toBe('membrane');
  });

  it('mantiene los clásicos accesibles', () => {
    expect(isClassicEffect('matrix')).toBe(true);
    expect(isClassicEffect('melt')).toBe(true);
    expect(isClassicEffect('fluidFields')).toBe(false);
    expect(getClassicEffects()).toContain('yinYang');
    expect(getClassicEffects()).toContain('particles');
  });

  it('asigna variante por defecto a un efecto', () => {
    expect(getDefaultVariantForEffect('tunnel')).toBe('tunnel');
    expect(getDefaultVariant('fluidFields')).toBe('membrane');
    expect(getVariant('fluidFields', 'torus').structural.topology).toBe('torus');
  });
});
