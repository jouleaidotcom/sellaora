# Contributing to JouleAI
JouleAI is an open-source e-commerce platform builder that serves as a powerful alternative to Shopify. Our mission is to democratize e-commerce by providing a customizable, and feature-rich platform that gives merchants complete control over their online stores.

### Why Contribute?
- Join a growing community of e-commerce enthusiasts
- Help build the future of open-source e-commerce
- Learn modern web development practices
- Make e-commerce accessible to everyone
- Shape the features that matter to merchants

This guide will help you get started with contributing to Sellaora.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/JouleAI.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Set up your development environment (see Development Setup below)

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB (v4.4 or higher)
- Git

### Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`

### Backend
```bash
cd backend
npm install
# Set up your .env file (see Environment Variables section)
npm run dev
```
The backend API will be available at `http://localhost:3000`

### Environment Variables
Create a `.env` file in the backend directory with: (see .env.example)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

## Pull Request Process

1. Ensure your code follows the existing style
2. Update documentation if you're changing functionality
3. Test your changes thoroughly
4. Create a Pull Request with a clear title and description
5. Link any related issues
6. Wait for code review and address any feedback
7. Once approved, your PR will be merged

## Code Style Guidelines

### Git Commits
- Use clear, descriptive commit messages
- Format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore
- Example: `feat(editor): add drag and drop support for components`

## Reporting Issues

- Use the GitHub issue tracker
- Use issue templates when available
- Include steps to reproduce
- Mention your environment:
  - OS and version
  - Node.js version
  - npm version
  - Browser and version (for frontend issues)
- Include screenshots for UI issues
- Include error messages and stack traces
- Tag issues appropriately

## Documentation

- Update README.md if you change functionality
- Document new features
- Update JSDoc comments for functions
- Keep API documentation up to date
- Add inline comments for complex logic

## Need Help?

- Check existing issues and documentation
- Join our community discussions
- Open a new issue for questions
- Tag issues with "question" or "help wanted"

## Code of Conduct

- Be respectful and inclusive
- Follow our code of conduct
- Help others when you can
- Accept constructive feedback

Thank you for contributing to JouleAI! 🚀

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
