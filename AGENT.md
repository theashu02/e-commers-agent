# AGENT.md

## UI & Responsive Design

- The UI must be fully responsive across mobile, tablet, laptop, and desktop screen sizes.
- Build layouts mobile-first and avoid fixed dimensions that can break on smaller screens.
- Keep spacing, typography, and component behavior consistent across all screen sizes.

## Design & Colors

- Use only `#f4f4f4`, the brand accent color, and `blur-300` for UI styling.
- Do not introduce additional colors, gradients, or arbitrary color values.
- Keep the visual design clean, minimal, and consistent.

## Component Library

- Always use **shadcn/ui** components when an equivalent component is available.
- Prefer composing existing shadcn/ui components over creating custom UI primitives.
- Only create a custom component when shadcn/ui does not provide a suitable option.

## Code Quality

- Keep code minimal, modular, readable, and optimal.
- Avoid unnecessary abstractions, wrappers, utilities, and dependencies.
- Do not over-engineer simple functionality.
- Keep components focused on a single responsibility.
- Reuse components and logic when it improves clarity without adding unnecessary complexity.
- Remove dead code, duplicated logic, and unused imports.

## File Structure

- Keep the project structure standard and predictable.
- Follow the existing Next.js conventions.
- Place files in the most obvious and conventional location.
- Do not create extra folders or architecture layers unless they are clearly necessary.

## API Calls

- Keep API request implementations inside the `lib/api` directory.
- Create a dedicated hook for API usage when the API is consumed by React components.
- React components should use the hook instead of calling APIs directly.
- Keep API functions small, focused, and reusable.

## Implementation Rules

- Prefer simple solutions over complex patterns.
- Do not add libraries when existing project dependencies can solve the problem.
- Do not introduce state management libraries unless local React state and existing patterns are insufficient.
- Keep client components to a minimum and use server components by default where appropriate.
- Keep business logic out of UI components when it can be cleanly moved into reusable functions or hooks.
- Make changes scoped to the requested feature; do not refactor unrelated code.
