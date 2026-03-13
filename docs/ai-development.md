# AI Development Workflow

This project uses the Gemini CLI to assist in development, reviews, and automation.

## Running Gemini CLI

To start the Gemini interactive session, run:
```bash
gemini
```

## Common Workflows

### 1. Code Review
To review your current changes:
```bash
gemini "Review my current changes for performance and adherence to GEMINI.md"
```

### 2. Screen/Component Generation
```bash
gemini "Generate a new screen for 'Favorite Notes' using Expo Router and Context API"
```

### 3. Architecture Analysis
```bash
gemini "Analyze the current project structure and suggest improvements for offline sync"
```

## Sandboxing
The project is configured to use Docker-based sandboxing for secure AI-guided edits.
To enable:
```bash
GEMINI_SANDBOX=docker gemini
```

## Preflight Checks
Before every commit, the project runs:
```bash
npm run preflight
```
This ensures:
- ✅ Code lints correctly
- ✅ TypeScript types are valid
- ✅ All unit tests pass
