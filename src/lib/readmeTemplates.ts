import type { Block } from "@/types/ast";

/**
 * Generate a unique ID using timestamp and random string
 */
function generateId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export interface ReadmeTemplate {
  id: string;
  name: string;
  description: string;
  blocks: Block[];
}

/**
 * Minimal template: Name, tagline, description, and links
 * Ideal for quick portfolio setup
 */
const MINIMAL_TEMPLATE: ReadmeTemplate = {
  id: "minimal",
  name: "Minimal",
  description: "Simple profile with name, tagline, and description",
  blocks: [
    {
      id: "block-minimal-hero",
      kind: "hero-bio",
      content: {
        name: "Your Name",
        tagline: "Your professional tagline",
        avatarUrl: "",
      },
    },
    {
      id: "block-minimal-links",
      kind: "social-links",
      content: {
        links: [
          { platform: "github", username: "yourname" },
          { platform: "linkedin", username: "yourname" },
          { platform: "twitter", username: "yourname" },
        ],
      },
    },
    {
      id: "block-minimal-about",
      kind: "markdown-custom",
      content: {
        markdown: `## About Me

Add your personal story here. Tell visitors what you do, what you're passionate about, and what makes you unique.

### Key Highlights

- Point 1
- Point 2
- Point 3`,
      },
    },
  ],
};

/**
 * Developer template: Hero, tech stack, GitHub stats, and custom sections
 * Perfect for developer portfolios
 */
const DEVELOPER_TEMPLATE: ReadmeTemplate = {
  id: "developer",
  name: "Developer",
  description: "Portfolio for developers with tech stack and GitHub stats",
  blocks: [
    {
      id: "block-dev-hero",
      kind: "hero-bio",
      content: {
        name: "Your Name",
        tagline: "Full Stack Developer | Open Source Enthusiast",
        avatarUrl: "",
      },
    },
    {
      id: "block-dev-tech",
      kind: "tech-stack",
      content: {
        technologies: [
          "TypeScript",
          "React",
          "Node.js",
          "Python",
          "PostgreSQL",
          "Docker",
        ],
      },
    },
    {
      id: "block-dev-stats",
      kind: "github-stats",
      content: {
        username: "your-github-username",
        showPrivate: false,
        showLangs: true,
        showTrophies: false,
        showVisitorCounter: false,
        theme: "dark",
        useMetrics: false,
      },
    },
    {
      id: "block-dev-about",
      kind: "markdown-custom",
      content: {
        markdown: `## About Me

I'm a passionate developer building elegant solutions to complex problems.

### What I Do

- **Full Stack Development**: React, Node.js, and modern web technologies
- **Open Source**: Contributor to various open-source projects
- **Problem Solving**: Enjoy tackling challenging technical problems`,
      },
    },
    {
      id: "block-dev-projects",
      kind: "markdown-custom",
      content: {
        markdown: `## Featured Projects

### Project One
A brief description of your first project and its impact.

### Project Two
Another project showcase with key features and technologies.`,
      },
    },
  ],
};

/**
 * Project template: Full project README with features, installation, and contribution
 * Great for project documentation
 */
const PROJECT_TEMPLATE: ReadmeTemplate = {
  id: "project",
  name: "Project",
  description: "Complete project README with features, setup, and contribution",
  blocks: [
    {
      id: "block-proj-hero",
      kind: "hero-bio",
      content: {
        name: "Project Name",
        tagline: "Brief description of what your project does",
        avatarUrl: "",
      },
    },
    {
      id: "block-proj-tech",
      kind: "tech-stack",
      content: {
        technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
      },
    },
    {
      id: "block-proj-overview",
      kind: "markdown-custom",
      content: {
        markdown: `## Overview

Provide a comprehensive overview of your project. Explain its purpose, core features, and what problems it solves.

### Key Features

- Feature one with description
- Feature two with description
- Feature three with description`,
      },
    },
    {
      id: "block-proj-install",
      kind: "markdown-custom",
      content: {
        markdown: `## Installation

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

\`\`\`bash
# Clone the repository
git clone https://github.com/username/project-name.git
cd project-name

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\``,
      },
    },
    {
      id: "block-proj-usage",
      kind: "markdown-custom",
      content: {
        markdown: `## Usage

### Basic Example

\`\`\`typescript
import { Component } from 'project-name'

const component = new Component()
component.initialize()
\`\`\`

### Configuration

Document key configuration options and how to customize the project.`,
      },
    },
    {
      id: "block-proj-contrib",
      kind: "markdown-custom",
      content: {
        markdown: `## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

### Development

\`\`\`bash
# Run tests
npm test

# Build for production
npm run build
\`\`\``,
      },
    },
    {
      id: "block-proj-license",
      kind: "markdown-custom",
      content: {
        markdown: `## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

Have questions? Open an issue or reach out via our community channels.`,
      },
    },
  ],
};

/**
 * Visual template: typing header, wave banner, skill-icons tech stack, and
 * full GitHub stats (trophies + streak + languages). Showcases every block
 * added in this plan.
 */
const VISUAL_TEMPLATE: ReadmeTemplate = {
  id: "visual",
  name: "Visual",
  description: "Animated header, wave banner, and full GitHub stats showcase",
  blocks: [
    {
      id: "block-visual-typing",
      kind: "typing-header",
      content: {
        lines: ["Hi, I'm your name 👋", "Welcome to my GitHub profile"],
        speed: 50,
        pauseMs: 1000,
        color: "#36BCF7",
        fontSize: 24,
      },
    },
    {
      id: "block-visual-capsule",
      kind: "capsule-banner",
      content: {
        type: "waving",
        color: "0d1117",
        text: "",
        height: 180,
        fontColor: "ffffff",
        section: "header",
      },
    },
    {
      id: "block-visual-tech",
      kind: "tech-stack",
      content: {
        technologies: ["TypeScript", "React", "Node.js", "Docker", "PostgreSQL"],
        iconStyle: "skill-icons",
      },
    },
    {
      id: "block-visual-stats",
      kind: "github-stats",
      content: {
        username: "your-github-username",
        showPrivate: false,
        showLangs: true,
        showStreak: true,
        showTrophies: true,
        showVisitorCounter: true,
        theme: "dark",
      },
    },
    {
      id: "block-visual-links",
      kind: "social-links",
      content: {
        links: [
          { platform: "github", username: "yourname" },
          { platform: "linkedin", username: "yourname" },
        ],
      },
    },
  ],
};

/**
 * All available README templates
 */
export const README_TEMPLATES: ReadmeTemplate[] = [
  MINIMAL_TEMPLATE,
  DEVELOPER_TEMPLATE,
  PROJECT_TEMPLATE,
  VISUAL_TEMPLATE,
];

/**
 * Apply a template by ID, generating unique IDs and grid positions for all blocks
 * @param templateId The ID of the template to apply
 * @returns Array of blocks with generated IDs and positions
 * @throws Error if template ID is not found
 */
export function applyTemplate(templateId: string): Block[] {
  const template = README_TEMPLATES.find((t) => t.id === templateId);

  if (!template) {
    throw new Error(`Template "${templateId}" not found`);
  }

  return template.blocks.map((block, index) => {
    // Create a deep copy of the block
    const newBlock = JSON.parse(JSON.stringify(block)) as Block;

    // Generate unique ID
    newBlock.id = generateId();

    // Assign grid position: full width (12), stacking vertically (y = index * 2)
    newBlock.position = {
      x: 0,
      y: index * 2,
      w: 12,
      h: 10,
    };

    return newBlock;
  });
}

/**
 * Get template by ID
 * @param templateId The ID of the template
 * @returns The template or undefined if not found
 */
export function getTemplate(templateId: string): ReadmeTemplate | undefined {
  return README_TEMPLATES.find((t) => t.id === templateId);
}

/**
 * Get all template IDs
 * @returns Array of template IDs
 */
export function getTemplateIds(): string[] {
  return README_TEMPLATES.map((t) => t.id);
}
