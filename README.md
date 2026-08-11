## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project tree

```
ai-learning-platform
├─ components.json
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ Product Requirements Document-kelompok6.md
├─ public
│  ├─ assets
│  │  └─ images
│  │     └─ prof-paw.webp
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (dashboard)
│  │  │  ├─ dashboard
│  │  │  │  └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  └─ library
│  │  │     └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components
│  │  ├─ atoms
│  │  │  ├─ IconButton.tsx
│  │  │  ├─ Logo.tsx
│  │  │  ├─ PulseDot.tsx
│  │  │  ├─ StatsIndicator.tsx
│  │  │  └─ Typography.tsx
│  │  ├─ molecules
│  │  │  ├─ ChatBubble.tsx
│  │  │  ├─ ChatInput.tsx
│  │  │  ├─ ProfileIdentity.tsx
│  │  │  ├─ QuizAction.tsx
│  │  │  ├─ QuizOption.tsx
│  │  │  ├─ RewardCard.tsx
│  │  │  ├─ SelectionCard.tsx
│  │  │  └─ UploadDropzone.tsx
│  │  ├─ organisms
│  │  │  ├─ ActiveMiniQuiz.tsx
│  │  │  ├─ MaterialUploader.tsx
│  │  │  ├─ NavBar.tsx
│  │  │  ├─ RewardRoom.tsx
│  │  │  ├─ SideBar.tsx
│  │  │  ├─ TaskSplitter.tsx
│  │  │  └─ YourProgress.tsx
│  │  ├─ templates
│  │  └─ ui
│  │     ├─ avatar.tsx
│  │     ├─ badge.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ checkbox.tsx
│  │     ├─ dialog.tsx
│  │     ├─ input.tsx
│  │     ├─ progress.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ sheet.tsx
│  │     ├─ tabs.tsx
│  │     └─ textarea.tsx
│  ├─ constants
│  │  └─ mockData.ts
│  ├─ hooks
│  │  ├─ useMediaQuery.ts
│  │  ├─ useNavbarScroll.ts
│  │  └─ usePasswordVisibility.ts
│  ├─ lib
│  │  ├─ formatter.ts
│  │  └─ utils.ts
│  ├─ store
│  │  ├─ useAuthStore.ts
│  │  └─ useUIStore.ts
│  └─ types
├─ tailwind.config.ts
├─ tsconfig.json
└─ workflow-git.md

```