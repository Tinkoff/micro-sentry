# Contributing

> Thank you for considering contributing to our project. Your help is very much appreciated!

When contributing, it's better to first discuss the change you wish to make via issue or discussion, or any other method with the owners of this repository before making a change.

All members of our community are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md).
Please make sure you are welcoming and friendly in all of our spaces.

## Getting started

In order to make your contribution please make a fork of the repository. After you've pulled
the code, follow these steps to kick start the development:

1. Run `npm ci` to install dependencies
2. You can also run `npm run test` command for testing

## Pull Request Process

1. We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/)
   in our commit messages, i.e. `feat(core): add cool things`.
   - `feat: ...` will trigger release of all packages after merge
   - `feat(core): ...` will trigger `@micro-sentry/core` release after merge
   - `feat(unknown-project): ...` will trigger no release
2. Make sure you cover all code changes with unit tests
3. When you are ready, create Pull Request of your fork into original repository
