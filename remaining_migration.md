# Remaining Migration Follow-Ups

This file tracks cleanup work intentionally left outside the completed staged modernization slices.

## Frontend Source Cleanup

- `npm run check` passes, but ESLint still reports legacy JavaScript warnings.
- Most warnings come from old browser-global scripts that rely on implicit globals, cross-file globals, unused callback parameters, and inline template handlers.
- A follow-up should make the app scripts explicit enough that `no-undef`, `no-unused-vars`, `no-redeclare`, `no-unreachable`, and `no-useless-assignment` can become blocking rules.

## Password Strength Bundle Size

- `static/js/dist/app/passwords.min.js` remains large because `zxcvbn` embeds dictionary data.
- This is not a build regression from the esbuild migration; the same dependency was previously bundled by Webpack.
- A follow-up can evaluate lazy-loading the password-strength bundle only on pages that need it, or replacing `zxcvbn` if a smaller maintained option is acceptable.

## GitHub Workflow Runtime Verification

- CI and release workflow commands were verified locally where possible.
- Full workflow execution still requires GitHub-hosted events:
  - push or pull request for `.github/workflows/ci.yml`.
  - release creation for `.github/workflows/release.yml`.
