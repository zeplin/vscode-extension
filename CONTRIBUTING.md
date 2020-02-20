# Contributing

Firstly, thank you for considering contributing to Zeplin Visual Studio Code Extension. ✌️

We welcome any type of contribution, not only code. You can help by:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Improving documentation

## Issue Tracking

We use GitHub issues to track public bugs, feature requests and suggestions. [Open a new issue.](https://github.com/zeplin/vscode-extension/issues/new)

☝️ *Please review your bug reports before posting to remove or mask any private/sensitive information.*

For each bug report, try to include the following information:

- A quick summary and/or background
- What you expected would happen
- What actually happens
- Steps to reproduce
  - Share sample text output/screenshot/screencastcast if possible
  - Share configuration file and/or log file
    - *(Mask any private/sensitive information)*
    - *(Save the logs file via `Save Logs` command)*

## Build and Run

Prerequisites: [Git](https://git-scm.com/), [Node.js](https://nodejs.org/), [npm](https://www.npmjs.com/)

1. Clone repository
2. In the repository directory, run `npm install` to install dependencies
3. Start debugging in Visual Studio Code, default shortcut is `F5`
    - To avoid restarting every time the code changes, you can:
        1. Run watcher (`npm run watch` or “Command/Ctrl + Shift + B”) to recompile automatically when the code changes
        2. Run the “Developer: Reload Window” command in the Visual Studio Code debug instance

## Contribution Workflow

We use [GitHub Flow](https://guides.github.com/introduction/flow/index.html), all code changes happen through pull requests.

- Fork the repo and create a branch from `master`
- Read [Technical Overview](TECHNICAL_OVERVIEW.md) and follow its principles
- If you've changed APIs, update the documentation
- Make sure your code lints by running `npm run lint`
  - We use [ESLint](https://eslint.org), [husky](https://github.com/typicode/husky) is configured to run `npm run lint` as a pre-commit hook for convenience
- Open a pull request

## License

By contributing, you agree that your contributions will be licensed under its [MIT License](http://choosealicense.com/licenses/mit/).

## References

This document was adapted from an open source contribution document gist shared by [braindk](https://gist.github.com/briandk/3d2e8b3ec8daf5a27a62).
