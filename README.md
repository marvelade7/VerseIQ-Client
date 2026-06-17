# VerseIQ

VerseIQ is a Bible quiz web app for testing Scripture knowledge, tracking growth, and competing on a leaderboard. Users can create an account, start timed quizzes by difficulty and testament, review detailed answer breakdowns, and manage their profile from a protected dashboard.

## Features

- Public landing page with product overview and calls to action
- Email/password sign up and sign in
- Protected dashboard backed by stored auth state
- Timed quiz sessions with selectable difficulty, question count, and testament
- Quiz results with score, correct answers, time taken, and answer-by-answer review
- Quiz history with filters for passed, average, and failed sessions
- Global leaderboard with user rank highlighting
- Profile page for account details, password changes, and personal stats
- Settings page for notification, appearance, quiz, privacy, and account preferences

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios
- Formik and Yup
- Lucide React and Bootstrap Icons
- Framer Motion

## Getting Started

### Prerequisites

- Node.js
- npm

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Vite will print the local development URL in your terminal, usually `http://localhost:5173`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## App Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/signup` | Public | Create a new account |
| `/signin` | Public | Sign in to an existing account |
| `/dashboard` | Protected | Main dashboard, stats, and quiz launcher |
| `/quiz` | Protected | Active timed quiz session |
| `/history` | Protected | Quiz history and detailed session review |
| `/leaderboard` | Protected | Ranked players and scores |
| `/profile` | Protected | Account information, password, and stats |
| `/settings` | Protected | User preferences and account actions |

## Project Structure

```text
src/
  assets/        Static image assets used by the app
  components/    Shared UI components and route guards
  context/       Auth context and local auth state helpers
  pages/         Route-level pages
  App.tsx        App routes and protected layout wiring
  main.tsx       React entry point
  index.css      Global styles
```

## Authentication

The app stores auth data in `localStorage` using:

- `verseiq_token`
- `verseiq_user`

`AuthContext` exposes the current user, token, `login`, `logout`, and `updateUser` helpers. Protected pages are wrapped with `ProtectedRoute`.

## API

The frontend currently calls the hosted VerseIQ backend directly:

```text
https://verseiq-server.onrender.com/api
```

Main API areas used by the client include:

- `users/register`
- `users/login`
- `users/dashboard`
- `users/profile`
- `quiz-sessions/start`
- `quiz-sessions/update/:sessionId`
- `quiz-sessions/history`
- `questions/by-ids`
- `leaderboard`

All app API calls are currently wired to the hosted Render API. If you want environment-based API switching later, a shared Axios client with a `VITE_API_URL` value would be a good next step.

## Development Notes

- The quiz flow starts from the dashboard modal, creates a quiz session, fetches questions by ID, and submits answers back to the session update endpoint.
- Quiz timing is based on difficulty: easy, medium, hard, or mixed.
- History sessions include populated question data so users can review selected and correct answers.
- Leaderboard has fallback sample data if the live request fails.
