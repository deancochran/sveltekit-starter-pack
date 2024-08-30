# SvelteKit SaaS Starter Kit

<p align="center">
  <img src="./static/performance.png" alt="drawing" width="800"/>
</p>
<p align="center">
  <img src="./static/sign-up.png" alt="drawing" width="800"/>
</p>

A full-stack example of a Software as a Service (SaaS) web application built with SvelteKit, incorporating various technologies such as Stripe for subscriptions, Lucia for authentication, Prisma ORM for database interactions, Svelte Superforms form handling, Zod for validation, and enhanced with Skeleton UI and Lucide icons.

## Table of Contents

- [SvelteKit SaaS Starter Kit](#sveltekit-saas-starter-kit)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Getting Started](#getting-started)
  - [Configuration](#configuration)
    - [Stripe Setup](#stripe-setup)
    - [Creating a Stripe Subscription Product in Test Mode](#creating-a-stripe-subscription-product-in-test-mode)
    - [Lucia Authentication](#lucia-authentication)
- [Fun Calculations](#fun-calculations)
- [80/20 Rule:](#8020-rule)
- [TODO for implementation...](#todo-for-implementation)
- [notes to self](#notes-to-self)
- [For development](#for-development)

## Introduction

This SvelteKit SaaS Starter Kit provides a foundation for building modern web applications with a focus on SaaS features. It integrates powerful tools and libraries to handle essential aspects like user authentication, subscription management, form handling, and more.

## Features

- User authentication using Lucia
- Subscription management with Stripe
- Stripe Webhook integration and handling
- Form handling with Svelte Superforms and Zod
- UI styling with Skeleton UI
- Iconography with Lucide

## Technologies Used

- [SvelteKit](https://kit.svelte.dev/)
- [Lucia](https://lucia.js.org/)
- [Stripe](https://stripe.com/)
- [Drozzle ORM](https://orm.drizzle.team/)
- [Svelte Superforms](https://github.com/ciscoheat/sveltekit-superforms)
- [Flash Message](https://github.com/ciscoheat/sveltekit-flash-message)
- [Skeleton UI](https://github.com/ciscoheat/sveltekit-flash-message)
- [Zod](https://github.com/colinhacks/zod)
- [Skeleton CSS](http://skeleton.dev/)
- [Lucide Icons](https://lucide.dev/)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/deancochran/cadence.git
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

## Configuration

### Stripe Setup

To enable subscription handling, sign up for a [Stripe](https://stripe.com/) account and obtain your test API keys.
To develop and test locally, you'll need to download and login to stripe through the CLI tool. https://stripe.com/docs/stripe-cli

### Creating a Stripe Subscription Product in Test Mode

To set up a subscription product for testing purposes, you can follow these steps on your Stripe dashboard:

1. Navigate to the "Products" section in the Dashboard.
2. Click the "Create product" button. Fill in the product details, including a name, description, and pricing information.

<div style="padding: 0px 25px 0px 25px">

NOTICE: It is imperative for the application that your add a `TIER` tag to the product you configure.

  <p align="center">
    <img src="./static/TierExample.png" alt="drawing" width="800"/>
  </p>

BASE
}

````

</div>

3. Inside the product, click the "Add pricing plan" button. Configure the plan details, such as the billing interval, currency, and amount.
4. Go to the "Developers" section and find your API keys. Use the test publishable and secret keys for your integration.
5. Implement Stripe into your application using the Stripe API library. Use the test API keys to update the corresponding values in the `.env` file:

<div style="padding: 0px 25px 0px 25px">

```yaml
~/.env

STRIPE_SECRET_KEY=XXXXXX
STRIPE_PUBLIC_KEY=XXXXXX
````

</div>

### Lucia Authentication

Configure Lucia authentication by updating the authentication configuration in `src/lib/auth.js`.

### Database (DRIZZLE)

Create a `.env` file with your database connection URL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

Apply database migrations:

```bash
drizzle migrate dev
```

### Database (Drizzler)

Run the SvelteKit application:

```bash
pnpm run dev
```

In a separate terminal start the webhook listener:

```bash
pnpm run stripe-webhook
# or
stripe listen --forward-to localhost:5173/stripe/webhook
```

# Fun Calculations

Fitness: CTL(t) = CTL(t-1) + (TSS(t) – CTL(t-1))\*(1-e^(-1/42))

This equation says that the one-day change in CTL equals the incremental load (over your CTL) \* 0.024, so you only gain about 2.4% of your incremental load in fitness per day. (That’s why it is so important to build a good base during the winter/early season as you cannot build CTL quickly.)

Fatigue: ATL(t) = ATL(t-1) + (TSS(t) – ATL(t-1))\*(1-e^(-1/7))

It is similar to CTL but focuses on the last 7 days (1 week) instead of 6 weeks (42 days). The computation is similarly done using exponential smoothing but only over 7 days

Form: TSB(t) = CTL(t-1) – ATL(t-1)

Positive TSB means you are “on form” and have higher fitness than fatigue. The goal of a training plan is not only getting the fitness (building CTL) but also timing it such that you have positive TSB before the start of the race. Peaking exactly accomplishes that: after a peak in workload, fatigue and fitness, the workload is reduced below the CTL one to two weeks before the race. Given that CTL moves slowly, fitness falls little but ATL responds quickly (falling below CTL) leading to a big positive spike in TSB.

# 80/20 Rule:

- its been studied that elite professionals have seen sucess from training on the 80/20 method.
- the method simply suggests that 80% of all the active trainging time logged should be below lactate threshold, whilst 20% should be above
- lactate threshold in a vague sense, is the highest exercise intensity that can be sustained for up to 60 minutes
- FTP is not the same as lactate threshold. But within the constraints of providing web app clients a feature to visualize through over all intensity ratio for the week. We can measure the amount of training time over / under FTP for a given sport

# TODO for implementation...

- add the intensity factor as a column to the activity table.
- update the typing accordingly in the frontend 'StressDays' is in need of updating
- on the dashboard, use the data.activites to calculate the total percentage of training done above threshold and below threshold
- add a message to encourage training at a 80% below threshold and 20% above threshold ratio as per the 80/20 method
- convert all distance measurements to meters in the database
  - update all corresponding functions that calculate distance
  - update the trainging session logic for creating a workout
- change the 5 zones to 7 zones where zone 0 is rest, zone 1 is active recovery, zone 6 is neuromuscular, zone 7 is all out!

# notes to self

april 18th - I am working or a wahoo api client class that can be used for server-side functions ONLY. I import secret keys for the wahoo api so I'm building it as a model for other future api classes too as a template. (I could build something that i could inherit with. But I think the development effort is to high. I will begin working on a smaller more functional class to upload workouts, plans, and maybe other info to wahoo. I will start by attempting to upload a workout and being able to render that workout on my element roam bike computer, or wahoo kickr v6).

I hated programming. Till i learned how to learn, Till i gave in.

# For development

Run dev and expose localhost

- pnpm run dev --host

Ensure you have a valid mkcert https certificate stored in the /cert directory ('this directory is not pushed so you need to make it')

docker compose -f dev.docker-compose up --build (runs your db at localhost:5432... i think)

npx drizzle migrate dev will run your migrations
npx drizzle generate will generate the client

- pnpm run ngrok (exposes the localhost at a proxied address)

Take the proxied address and update your thridparty api configurations

- strava needs the domain and auth callback url
  - Use postman to register your strava api webhook with the ngrok url
- wahoo needs the callback url and the webhook location
- .env needs to be updated for the new ngok url

- test the webhook endpoints using postman on an external network device
  - I recommend sending a postman request from another laptop using a hotspot from your phone's cellular data for ease of developer experience

pnpm run drizzle should open the database view on port 5555

pnpm run stripe-webhook should open up stripe capabilities on your machine

# ENSURE YOU'RE API WEBHOOKS ARE ENABLED!

# ENSURE THE IP ADDRESSES ARE CORRECT

# ENSURE COOKIES ARE BEING PASSED

# CHECKOUT SWAPY https://swapy.tahazsh.com/ for Interval drag and drop
