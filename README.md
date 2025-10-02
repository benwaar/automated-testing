# Automated Testing

A comprehensive testing framework combining behavior-driven development (BDD)
with modern web automation tools. This project integrates Playwright for
end-to-end testing, Cucumber for BDD scenarios, and Lighthouse for accessibility
and performance auditing.

## 🚀 Features

- **End-to-End Testing** with Playwright
- **Behavior-Driven Development** using Gherkin syntax and Cucumber
- **Accessibility Testing** with Lighthouse integration
- **Cross-browser Testing** support
- **Parallel Test Execution**
- **Automated Code Quality** with ESLint and Prettier
- **Git Hooks** for commit validation and code formatting

## 🛠️ Technologies

### Testing Frameworks

- **[Playwright](https://playwright.dev/)** - Open-source framework by Microsoft
  for web automation and end-to-end testing
- **[Cucumber](https://cucumber.io/)** - Popular testing framework that uses
  Gherkin plain-text format to support behavior-driven development (BDD)

### Languages & Specifications

- **[Gherkin](https://cucumber.io/docs/gherkin/)** - Business-readable
  domain-specific language for behavior specification
- **TypeScript** - Type-safe JavaScript development

### Quality Assurance

- **[Lighthouse](https://developers.google.com/web/tools/lighthouse)** -
  Automated tool for improving web page quality through performance,
  accessibility, and SEO audits
- **ESLint** - TypeScript linting for code quality
- **Prettier** - Code formatting for consistency

### Linting Rules

- **TypeScript**: Strict type checking and best practices
- **Code Style**: Consistent formatting with single quotes, semicolons, and
  2-space indentation
- **Line Length**: Maximum 120 characters per line
- **No Console**: Console statements allowed in test files
- **Unused Variables**: Error on unused variables (except those prefixed with
  `_`)

### Automatic Checks

- **Pre-commit Hook**: Runs ESLint and TypeScript checking before each commit
- **Commit Message**: Validates conventional commit format
- **Type Safety**: Ensures all TypeScript compiles without errors

### Manual Linting

```bash
# Check for linting issues
npm run lint:check

# Auto-fix linting issues where possible
npm run lint:fix

# Run full linting with fixes
npm run lint
```

## 📦 Installation

```bash
npm install
```

## 🧪 Running Tests

### Playwright E2E Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run E2E tests in headed mode
npm run test:e2e:headed

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests for specific environment
npm run test:local   # Uses local.json config
npm run test:dev     # Uses dev.json config

# Debug tests (step-by-step)
npm run test:debug

# View test report
npm run test:report
```

### Cucumber BDD Tests

```bash
# Run Cucumber tests
npm run cucumber

# Generate HTML report
npm run cucumber:html

# Generate JSON report
npm run cucumber:json

# Run all tests (Playwright + Cucumber)
npm run test:all
```

### Lighthouse Performance Tests

```bash
# Run Lighthouse performance audits (Chromium only)
npm run test:lighthouse

# Run Lighthouse tests for specific environment (JSON format)
npm run test:lighthouse:local   # Uses local.json config
npm run test:lighthouse:dev     # Uses dev.json config

# Run Lighthouse tests with HTML reports (visual format)
npm run test:lighthouse:html        # Default environment with HTML report
npm run test:lighthouse:local:html  # Local environment with HTML report
npm run test:lighthouse:dev:html    # Dev environment with HTML report

# Reports are automatically generated in reports/lighthouse/
# JSON reports (.json) - Detailed programmatic data with:
# - Performance metrics (FCP, LCP, CLS, TTI)
# - Accessibility audit results (100% score)
# - Best practices evaluation (100% score)
# - SEO analysis (50% score for login pages)
# - Core Web Vitals measurements
# - Network requests and resource analysis

# HTML reports (.html) - Interactive visual reports with:
# - Color-coded performance metrics and scores
# - Detailed audit results with explanations
# - Performance recommendations and optimizations
# - Visual timeline and screenshots
# - Expandable audit details and opportunities
```

**Lighthouse Results for Keycloak Login:**

- 📊 Performance Score: 56%
- ♿ Accessibility Score: 100%
- ✅ Best Practices Score: 100%
- 🔍 SEO Score: 50%
- 🎨 First Contentful Paint: ~9.6s
- 🖼️ Largest Contentful Paint: ~10.6s

### TypeScript, Linting & Formatting

```bash
# Type checking
npm run type-check

# Build TypeScript
npm run build

# Lint TypeScript files
npm run lint:check

# Lint and auto-fix issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without making changes
npm run format:check

# Format only source files
npm run format:src

# Run complete pre-commit checks
npm run pre-commit
```

## 📁 Project Structure

```
├── src/                      # Source files
│   ├── e2e/                 # E2E test files
│   │   ├── keycloak.spec.ts # Keycloak login tests
│   │   ├── keycloak.lighthouse.spec.ts # Lighthouse performance tests
│   │   └── example.spec.ts  # Example Playwright tests
│   ├── bdd/                 # Cucumber BDD tests
│   │   ├── features/        # Cucumber feature files
│   │   │   └── login.feature # BDD scenarios
│   │   └── steps/           # Step definitions
│   │       └── login.ts     # TypeScript step implementations
│   └── config/              # Environment configurations
│       ├── local.json       # Local development config
│       ├── dev.json         # Development environment config
│       └── example.json     # Example configuration
├── tests-examples/         # Legacy test examples
├── reports/               # Test reports (generated)
├── .husky/               # Git hooks
│   ├── commit-msg        # Commit message validation
│   └── pre-commit        # Pre-commit formatting, linting and type checking
├── .eslintrc.js          # ESLint configuration
├── .eslintignore         # ESLint ignore patterns
├── .prettierrc           # Prettier configuration
├── .prettierignore       # Prettier ignore patterns
├── playwright.config.ts   # Playwright configuration
├── cucumber.config.js     # Cucumber configuration
├── commitlint.config.js   # Commit message linting rules
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies
```

## 🔍 Code Quality, Linting & Formatting

This project uses ESLint for linting and Prettier for code formatting to ensure
consistent code quality and style.

### Code Formatting (Prettier)

- **Automatic Formatting**: Code is automatically formatted on every commit
- **Single Quotes**: Consistent use of single quotes for strings
- **Semicolons**: Always include semicolons
- **Line Length**: Maximum 120 characters per line
- **Indentation**: 2 spaces, no tabs
- **Trailing Commas**: No trailing commas

### Linting Rules (ESLint)

- **TypeScript**: Strict type checking and best practices
- **Code Style**: Integrated with Prettier for consistent formatting
- **No Console**: Console statements allowed in test files
- **Unused Variables**: Error on unused variables (except those prefixed with
  `_`)
- **Type Safety**: Ensures proper TypeScript usage

### Automatic Checks

- **Pre-commit Hook**: Runs Prettier formatting, ESLint, and TypeScript checking
- **Commit Message**: Validates conventional commit format
- **Auto-formatting**: Code is automatically formatted and re-staged

### Manual Commands

```bash
# Check for linting issues
npm run lint:check

# Auto-fix linting issues where possible
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without changes
npm run format:check

# Run complete pre-commit checks manually
npm run pre-commit
```

## 📝 Git Commit Guidelines

This project uses [Conventional Commits](https://conventionalcommits.org/) with
automated validation via commitlint.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Allowed Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples

```bash
# ✅ Valid commit messages
feat: add login functionality to keycloak tests
fix: resolve SSL certificate issues in e2e tests
docs: update README with commit guidelines
test: add negative test cases for invalid credentials

# ❌ Invalid commit messages
added new feature
Fixed bug
Update README
```

### Testing Commit Messages

```bash
# Test commitlint configuration
npm run commitlint:test

# Make a commit (will automatically validate)
npm run commit
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Commit your changes using conventional commits
   (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file
for details.
