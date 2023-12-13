

# SvelteKit SaaS Starter Kit

<p align="center">
  <img src="./static/performance.png" alt="drawing" width="800"/>
</p>
<p align="center">
  <img src="./static/sign-up.png" alt="drawing" width="800"/>
</p>




A full-stack example of a Software as a Service (SaaS) web application built with SvelteKit, incorporating various technologies such as Stripe for subscriptions, Lucia for authentication, Prisma ORM for database interactions, Svelte Superforms and Zod for form handling, and enhanced with Skeleton UI and Lucide icons.

## Table of Contents
- [SvelteKit SaaS Starter Kit](#sveltekit-saas-starter-kit)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)

## Introduction

This SvelteKit SaaS Starter Kit provides a foundation for building modern web applications with a focus on SaaS features. It integrates powerful tools and libraries to handle essential aspects like user authentication, subscription management, form handling, and more.

## Features

- User authentication using Lucia
- Subscription management with Stripe
- Database interactions with Prisma ORM
- Form handling with Svelte Superforms and Zod
- UI styling with Skeleton UI
- Iconography with Lucide

## Technologies Used

- [SvelteKit](https://kit.svelte.dev/)
- [Lucia](https://lucia.js.org/)
- [Stripe](https://stripe.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Svelte Superforms](https://github.com/ciscoheat/sveltekit-superforms)
- [Flash Message](https://github.com/ciscoheat/sveltekit-flash-message)
- [Zod](https://github.com/colinhacks/zod)
- [Skeleton CSS](http://skeleton.dev/)
- [Lucide Icons](https://lucide.dev/)

## Getting Started

### Prerequisites

- A Node.js (version x.x.x)
- A package Manager
- A Stripe account for subscription handling
- A Database (PostgreSQL, MySQL, Supabase, PocketBase) for Prisma

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/deancochran/skauth.git
   ```

2. Install dependencies:

   ```bash
   pnpm install 
   ```

<!-- ## Configuration -->
<!-- 
### Stripe

To enable subscription handling, sign up for a [Stripe](https://stripe.com/) account and obtain your API keys. Update the corresponding values in the `.env` file:

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### Lucia Authentication

Configure Lucia authentication by updating the authentication configuration in `src/lib/auth.js`.

### Database (Prisma)

1. Install Prisma CLI globally:

   ```bash
   npm install -g prisma
   ```

2. Create a `.env` file with your database connection URL:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   ```

3. Apply database migrations:

   ```bash
   prisma migrate dev
   ```

## Usage

Run the SvelteKit application:

```bash
npm run dev # or yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Folder Structure

- `/src`: SvelteKit source code
  - `/lib`: Utility functions and configurations
  - `/routes`: Application routes
  - `/components`: Reusable Svelte components
  - `/styles`: Global styles
- `/prisma`: Prisma ORM configuration and migrations

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE). -->
