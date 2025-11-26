# Lint run summary

Command: npm run lint
Date: 2025-11-26T19:57:03Z

## Auto-fixes applied
- jest.setup.js: removed trailing comma from warn mock entry.
- vue.config.js: changed double quotes to single quotes for svg rule deletion.

## Remaining warnings
- src/frontend/components/Layouts/Header.vue: console statements at lines 199 and 202.
- src/frontend/components/Root.vue: unused registered component Problems at line 81.
- src/frontend/manifest/manager.js: console statement at line 92.
- src/frontend/router/routes.js: console statement at line 77.
- src/frontend/storage/gitlab.js: console statements at lines 371 and 422.

## Follow-up tasks
- Remove or replace console usage with appropriate logging/telemetry in the listed files.
- Remove or utilize the Problems component registration in Root.vue to resolve the unused component warning.
