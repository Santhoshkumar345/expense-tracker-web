# Expense Tracker Web

Angular (v21) frontend for the personal expense tracker: dashboard with balance carried forward from the previous month, category-wise spending, a transactions ledger, and daily/weekly/monthly analysis. Uses Angular Material and Chart.js.

## Configuration

API base URL lives in `src/environments/`:

- `environment.development.ts` — used by `ng serve`, points at `http://localhost:5299/api` (the API's local dev port).
- `environment.ts` — used by production builds. **Update `apiUrl` to your deployed API's URL before building for production.**

The API must allow this app's origin in its CORS config (`Cors:AllowedOrigins` in the API's settings).

## Not yet implemented

Budgets, recurring transactions, receipt attachments, CSV import/export, tags, savings goals, dark mode — see the project plan for the full feature list. These were scoped out of this pass to ship a working core (auth, ledger, categories, dashboard, analysis) first.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
