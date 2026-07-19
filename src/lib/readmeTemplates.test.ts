import { describe, it, expect, beforeEach } from 'vitest';
import {
  README_TEMPLATES,
  applyTemplate,
  type ReadmeTemplate,
} from './readmeTemplates';
import type { Block } from '@/types/ast';

describe('readmeTemplates', () => {
  describe('README_TEMPLATES', () => {
    it('should have at least 3 templates', () => {
      expect(README_TEMPLATES.length).toBeGreaterThanOrEqual(3);
    });

    it('should have unique template ids', () => {
      const ids = README_TEMPLATES.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have all required properties', () => {
      README_TEMPLATES.forEach((template) => {
        expect(template).toHaveProperty('id');
        expect(template).toHaveProperty('name');
        expect(template).toHaveProperty('description');
        expect(template).toHaveProperty('blocks');
        expect(Array.isArray(template.blocks)).toBe(true);
        expect(template.blocks.length).toBeGreaterThan(0);
      });
    });
  });

  describe('minimal template', () => {
    let minimalTemplate: ReadmeTemplate;

    beforeEach(() => {
      minimalTemplate = README_TEMPLATES.find((t) => t.id === 'minimal')!;
    });

    it('should exist', () => {
      expect(minimalTemplate).toBeDefined();
    });

    it('should have 3-4 blocks', () => {
      expect(minimalTemplate.blocks.length).toBeGreaterThanOrEqual(3);
      expect(minimalTemplate.blocks.length).toBeLessThanOrEqual(4);
    });

    it('should include hero-bio block', () => {
      const hasHeroBio = minimalTemplate.blocks.some(
        (b) => b.kind === 'hero-bio'
      );
      expect(hasHeroBio).toBe(true);
    });

    it('should include markdown-custom block', () => {
      const hasMarkdown = minimalTemplate.blocks.some(
        (b) => b.kind === 'markdown-custom'
      );
      expect(hasMarkdown).toBe(true);
    });
  });

  describe('developer template', () => {
    let developerTemplate: ReadmeTemplate;

    beforeEach(() => {
      developerTemplate = README_TEMPLATES.find((t) => t.id === 'developer')!;
    });

    it('should exist', () => {
      expect(developerTemplate).toBeDefined();
    });

    it('should include hero-bio block', () => {
      const hasHeroBio = developerTemplate.blocks.some(
        (b) => b.kind === 'hero-bio'
      );
      expect(hasHeroBio).toBe(true);
    });

    it('should include tech-stack block', () => {
      const hasTechStack = developerTemplate.blocks.some(
        (b) => b.kind === 'tech-stack'
      );
      expect(hasTechStack).toBe(true);
    });

    it('should include github-stats block', () => {
      const hasGithubStats = developerTemplate.blocks.some(
        (b) => b.kind === 'github-stats'
      );
      expect(hasGithubStats).toBe(true);
    });
  });

  describe('project template', () => {
    let projectTemplate: ReadmeTemplate;

    beforeEach(() => {
      projectTemplate = README_TEMPLATES.find((t) => t.id === 'project')!;
    });

    it('should exist', () => {
      expect(projectTemplate).toBeDefined();
    });

    it('should include hero-bio block', () => {
      const hasHeroBio = projectTemplate.blocks.some(
        (b) => b.kind === 'hero-bio'
      );
      expect(hasHeroBio).toBe(true);
    });

    it('should include tech-stack block', () => {
      const hasTechStack = projectTemplate.blocks.some(
        (b) => b.kind === 'tech-stack'
      );
      expect(hasTechStack).toBe(true);
    });

    it('should include multiple markdown sections', () => {
      const markdownBlocks = projectTemplate.blocks.filter(
        (b) => b.kind === 'markdown-custom'
      );
      expect(markdownBlocks.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('applyTemplate', () => {
    it('should return blocks with unique IDs', () => {
      const blocks = applyTemplate('minimal');
      const ids = blocks.map((b) => b.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should assign correct grid positions', () => {
      const blocks = applyTemplate('minimal');
      blocks.forEach((block, index) => {
        expect(block.position).toBeDefined();
        expect(block.position!.x).toBe(0);
        expect(block.position!.y).toBe(index * 2);
        expect(block.position!.w).toBe(12);
      });
    });

    it('should return deep copies of blocks', () => {
      const blocks1 = applyTemplate('minimal');
      const blocks2 = applyTemplate('minimal');

      blocks1.forEach((b, i) => {
        expect(b.id).not.toBe(blocks2[i].id);
        expect(b.kind).toBe(blocks2[i].kind);
      });
    });

    it('should throw for invalid template id', () => {
      expect(() => applyTemplate('nonexistent')).toThrow();
    });

    it('should work with all template ids', () => {
      README_TEMPLATES.forEach((template) => {
        const blocks = applyTemplate(template.id);
        expect(Array.isArray(blocks)).toBe(true);
        expect(blocks.length).toBe(template.blocks.length);
      });
    });

    it('should preserve block content structure', () => {
      const blocks = applyTemplate('minimal');
      blocks.forEach((block) => {
        expect(block).toHaveProperty('kind');
        expect(block).toHaveProperty('content');
        expect(block).toHaveProperty('position');
        expect(block).toHaveProperty('id');
      });
    });
  });
});
