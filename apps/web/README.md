This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## API configuration

The candidate interview flow uses a local `sessionStorage` adapter by default. To connect it to the FastAPI service, copy `.env.example` to `.env.local` and set:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

The frontend then calls the interview endpoints defined in the project specification:

- `POST /api/v1/interviews/{token}/consent`
- `POST /api/v1/interviews/{token}/start`
- `POST /api/v1/interviews/{session_id}/events`
- `POST /api/v1/interviews/{session_id}/complete`

## Owner dashboard

The SaaS owner dashboard is available at `/admin` and is protected by a server-side
password gate. Set `ADMIN_DASHBOARD_PASSWORD` in `.env.local` or the deployment
environment to a strong, private value before using it. The dashboard currently
uses sample platform metrics; connect it to platform analytics and billing APIs
before treating those values as production data.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
