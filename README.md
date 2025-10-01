# Automated Testing - Test project for trying things out using Keycloak

A comprehensive testing framework combining behavior-driven development (BDD) with modern web automation tools. This project integrates Playwright for end-to-end testing, Cucumber for BDD scenarios, and Lighthouse for accessibility and performance auditing.

## 🚀 Features

- **End-to-End Testing** with Playwright
- **Behavior-Driven Development** using Gherkin syntax and Cucumber
- **Accessibility Testing** with Lighthouse integration
- **Cross-browser Testing** support
- **Parallel Test Execution**

## 🛠️ Technologies

### Testing Frameworks
- **[Playwright](https://playwright.dev/)** - Open-source framework by Microsoft for web automation and end-to-end testing
- **[Cucumber](https://cucumber.io/)** - Popular testing framework that uses Gherkin plain-text format to support behavior-driven development (BDD)

### Languages & Specifications
- **[Gherkin](https://cucumber.io/docs/gherkin/)** - Business-readable domain-specific language for behavior specification
- **TypeScript** - Type-safe JavaScript development

### Quality Assurance
- **[Lighthouse](https://developers.google.com/web/tools/lighthouse)** - Automated tool for improving web page quality through performance, accessibility, and SEO audits

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

### TypeScript
```bash
# Type checking
npm run type-check

# Build TypeScript
npm run build
```

## 📁 Project Structure

```
├── src/                      # Source files
│   ├── e2e/                 # E2E test files
│   │   ├── keycloak.spec.ts # Keycloak login tests
│   │   └── example.spec.ts  # Example Playwright tests
│   ├── config/              # Environment configurations
│   │   ├── local.json      # Local development config
│   │   ├── dev.json        # Development environment config
│   │   └── example.json    # Example configuration
│   └── tests/              # Cucumber BDD tests
│       ├── features/       # Cucumber feature files
│       │   └── login.feature # BDD scenarios
│       └── steps/          # Step definitions
│           └── login.ts    # TypeScript step implementations
├── tests-examples/         # Legacy test examples
├── reports/               # Test reports (generated)
├── playwright.config.ts   # Playwright configuration
├── cucumber.config.js     # Cucumber configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies
```

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
