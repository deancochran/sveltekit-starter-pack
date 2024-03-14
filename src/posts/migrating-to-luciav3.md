---
title: Migrating to Lucia v3
description: Authentication is hard, but proper tooling makes life a breeze
author: Dean Cochran
date: '2024-3-14'
categories:
  - Changelog
published: true
slug: migrating-to-luciav3
---

## Contents

Authentication is one of the most fundamental, and frankly underappreciated features for most web apps. Many applications use third party services or OAuth integrations to handle authentication for their application. However, this not only costs a premium, but it also sacrifices any custom requirements an organization may have with it's authentication process.

**Cadence** uses Lucia Auth for authenticating it's users. [Lucia](https://lucia-auth.com/) provides open source tools for managing users, user sessions, and login credentials.

"*Lucia is an auth library for your server that abstracts away the complexity of handling sessions.*"

The tradeoff for implementing Lucia initially was development time, with the understanding of possible maintenance given a major update in the open source package.

**Cadence** has previously implemented *Lucia v2*, however as of March 2024, Lucia v3 has been release with major changes.

## Lucia v3

Version 3.0 of [Lucia](https://lucia-auth.com/) generally makes authentication a bit more refined, whilst maintaining the functionality of previous versions.

*"We estimate it will take about an hour or two to upgrade your project, though it depends on how big your application is."- Lucia*

### Notable Changes

The biggest change to Lucia is that **keys have been removed entirely**.

We've essentially had to rework our database and all of our associated configuration for Lucia. With new ways to provide typing in Lucia, and a new initialization of the authentication client. *I would be lying if I told you this change was simple*

## Improvements to Cadence

In retrospect this was a great tool to upgrade. Lucia supports our authentication process. Without it users would have issues, just logging into our app. Let alone attempting to register with OAuth Providers, updating emails or passwords, and much more.

There were a handful of performance enhancing changes to our authentication. There are few database calls, and a general "tidiness" to our authentication code.


### Email and Password Verification Codes
In the past Cadence provided links inside of emails to users so they could verify their account email or password. The issue with this approach is that that is not a safe way that we have identified to validate user accounts with this approach given our tooling stack.

Lucia Auth also encourages the usage of user prompted codes, instead of verification links.

*"We recommend using email verification codes instead as it's more user-friendly. We also recommend reading through the email verification guide in the Copenhagen Book. - Lucia"*



### Moving Forward

We to use Lucia for as long as the tool provides the functionality we need. With hopes of a successful launch and an authentication update **Cadence is holding its growth mindset.**