# Automated Testing

A comprehensive testing framework combining behavior-driven development (BDD)
with modern web automation tools. This project integrates Playwright for
end-to-end testing, Cucumber for BDD scenarios, and Lighthouse for accessibility
and performance auditing.

## 🎯 About This Project

This is an **example testing project** that demonstrates automated testing of
**Keycloak's login page** using modern testing frameworks. The tests validate
authentication flows, performance metrics, and accessibility compliance for
Keycloak's admin console.

For Keycloak setup instructions, visit the
[official Keycloak Docker guide](https://www.keycloak.org/getting-started/getting-started-docker).

The test configurations are located in `src/config/` and can be customized for
different environments.

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

### 📋 Prerequisites

Before running the tests, ensure you have:

1. **Node.js** (v18+ recommended)
2. **Keycloak instance** running locally via Docker (see
   [About This Project](#-about-this-project) section above)
3. **Valid SSL certificate** acceptance in your browser for
   `https://localhost:8443`

### 🔌 Recommended VS Code Extensions

For the best development experience, install these extensions:

```vscode-extensions
ms-playwright.playwright,alexkrechik.cucumberautocomplete
```

**Benefits:**

- **Playwright Test for VSCode**: Run and debug Playwright tests directly in VS
  Code with test explorer integration, breakpoints, and live test execution
- **Cucumber (Gherkin) Full Support**: Syntax highlighting, autocomplete,
  formatting, and step definition navigation for `.feature` files

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
# Run Cucumber tests (default environment)
npm run cucumber

# Run Cucumber tests for specific environment
npm run cucumber:local    # Uses local.json config
npm run cucumber:dev      # Uses dev.json config

# Generate HTML report (default environment)
npm run cucumber:html

# Generate HTML reports for specific environment
npm run cucumber:html:local  # Local environment with HTML report
npm run cucumber:html:dev    # Dev environment with HTML report

# Generate JSON reports for specific environment
npm run cucumber:json:local  # Local environment with JSON report
npm run cucumber:json:dev    # Dev environment with JSON report

# Run all tests (Playwright + Cucumber)
npm run test:all
```

**BDD Configuration:** The Cucumber tests use environment-specific credentials
from the config files (e.g., `local.json`, `dev.json`) rather than hardcoded
values. The login scenarios automatically pull the appropriate username and
password from the selected environment configuration.

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

# Generate browsable index of lighthouse reports
npm run lighthouse:index           # Generate index.html for all reports
npm run lighthouse:index:open      # Generate index and open in browser

# Complete test workflow (recommended)
npm run test:all:local:html        # Clean → Cucumber → E2E → Lighthouse → Index

# Reports are automatically generated in src/lighthouse/reports/
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

# Index report (index.html) - Responsive dashboard with:
# - Categorized reports by page type (Login/Console)
# - Report format filtering (HTML/JSON)
# - File size information and generation timestamps
# - Quick access links and report statistics
# - Mobile-friendly responsive design
```

### Complete Lighthouse Workflow

```bash
# 🚀 Recommended: Complete workflow with all features
npm run test:all:local:html
# This runs:
# 1. Clean lighthouse reports (automated)
# 2. Cucumber BDD tests (with HTML reports)
# 3. E2E Playwright tests (with HTML reports)
# 4. Lighthouse audits (login + console pages)
# 5. Generate lighthouse reports index (browsable dashboard)
```

#### Lighthouse Reports Management

```bash
# 📊 Generate browsable index of all lighthouse reports
npm run lighthouse:index           # Generate index.html dashboard
npm run lighthouse:index:open      # Generate index and open in browser

# 🧹 Clean lighthouse reports with advanced filtering
npm run clean:lighthouse           # Interactive confirmation
npm run clean:lighthouse:force     # Skip confirmation (automation-friendly)
npm run clean:lighthouse:dry-run   # Preview deletions without removing files

# 🎯 Target specific report types
npm run clean:lighthouse:login     # Clean only login page reports
npm run clean:lighthouse:console   # Clean only console page reports
npm run clean:lighthouse:old       # Clean reports older than 7 days

# 🔧 Advanced cleanup with custom options
node scripts/clean-lighthouse-reports.js --older-than=14 --dry-run
node scripts/clean-lighthouse-reports.js --console --older-than=3 --force
node scripts/clean-lighthouse-reports.js --login --force
```

#### Lighthouse Reports Index Features

The generated `index.html` provides a comprehensive dashboard for browsing
lighthouse reports:

- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **🎯 Smart Categorization**: Groups reports by page type (Login/Console) and
  format (HTML/JSON)
- **📊 Statistics Dashboard**: Shows total reports, file sizes, and generation
  timestamps
- **🔍 Quick Access**: Direct links to HTML reports and JSON data downloads
- **🎨 Modern Interface**: Clean, professional design with intuitive navigation
- **📈 Report Metrics**: File size information and last modified dates

**Lighthouse Results:**

**Login Page Performance:**

- 📊 Performance Score: 56% (exceeds 30% threshold ✅)
- ♿ Accessibility Score: 100% (exceeds 70% threshold ✅)
- ✅ Best Practices Score: 100% (exceeds 70% threshold ✅)
- 🔍 SEO Score: 50% (exceeds 30% threshold ✅)
- 🎨 First Contentful Paint: ~9.6s
- 🖼️ Largest Contentful Paint: ~10.6s

**Admin Console Performance:**

- 📊 Performance Score: 55% (exceeds 25% threshold ✅)
- ♿ Accessibility Score: 100% (exceeds 65% threshold ✅)
- ✅ Best Practices Score: 100% (exceeds 65% threshold ✅)
- 🔍 SEO Score: N/A (admin interface)
- 🎨 First Contentful Paint: ~20.3s
- 🖼️ Largest Contentful Paint: ~22.4s

**Performance Notes:**

- Admin console load times are higher due to complex JavaScript application
- Both pages achieve excellent accessibility scores
- Thresholds are optimized for Keycloak's admin interface complexity
- Reports include dual auditing: login page + authenticated console

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
│   │   └── example.spec.ts  # Example Playwright tests
│   ├── lighthouse/          # Lighthouse performance tests
│   │   ├── keycloak.lighthouse.spec.ts # Dual lighthouse audits (login + console)
│   │   └── reports/         # Lighthouse reports (generated)
│   │       ├── index.html   # Responsive reports dashboard
│   │       ├── *.html       # Interactive lighthouse reports
│   │       └── *.json       # Programmatic lighthouse data
│   ├── bdd/                 # Cucumber BDD tests
│   │   ├── features/        # Cucumber feature files
│   │   │   └── login.feature # BDD scenarios
│   │   └── steps/           # Step definitions
│   │       └── login.ts     # TypeScript step implementations
│   └── config/              # Environment configurations
│       ├── local.json       # Local development config (add your own)
│       ├── dev.json         # Development environment config (add your own)
│       └── example.json     # Example configuration
├── scripts/               # Utility scripts
│   ├── clean-lighthouse-reports.js    # Advanced cleanup with filtering
│   ├── generate-lighthouse-index.js   # HTML index generator
│   └── check-node-version.js          # Node.js version validation
├── reports/               # Test reports (generated)
│   ├── bdd/               # Cucumber BDD test reports (.html, .json)
│   └── e2e/               # Playwright E2E test reports (HTML report)
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
