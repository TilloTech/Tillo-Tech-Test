# Tillo Tech Test

Welcome! We're thrilled you're interested in joining the Tillo Team and can't wait to see what you'll build.

This tech test is a simple dummy e-commerce Laravel application by a fictional company called TilloMart. We've set up a basic product catalog, shopping cart, and checkout flow to give you a realistic environment to work with.

## Tech Stack

This application uses Laravel, Vue.js, Inertia.js, and Tailwind CSS. It includes:
- MySQL database for data storage
- Mailpit for email testing (http://localhost:8025/)
- Laravel Debug Bar for performance analysis
- Comprehensive test suite (PHPUnit + Vitest)

**Running Tests:**
- Backend: `./vendor/bin/sail test`
- Frontend: `./vendor/bin/sail npm run test:run`

---

## Welcome to the TilloMart Team!

Thanks for joining the TilloMart Team as a software engineer. You've been asked to complete the following tasks. We're a growing e-commerce platform, and while our customers love our products, we've hit a couple of bumps in the road that we need your help with.

## Your Tasks

### 1. Performance Investigation
Our customers have been complaining about slow loading times on the products page. It's really affecting their shopping experience, and we need to get this sorted quickly! We've included Laravel Debug Bar to help you inspect database queries and identify potential performance issues.

### 2. Email Reliability
The third party email sending API we use has become flaky recently - it's causing some real headaches for our customer service team. After some testing, we've discovered that anything after the first attempt usually succeeds. Please figure out how to handle this situation appropriately so our customers always get their order confirmations.

*Note: there is logic in the EmailService class that intentionally makes the email sending fail on the first attempt. You should leave this in its current state - simulating a flakey API that is outside of your control - and instead focus on how the TilloMart application handles these failures.*

### 3. Order History Page
Our customers have been asking for a way to view their past orders. Please create a basic order history page that allows authenticated users to see a list of their previous orders. The page should:

- Display orders in a clean, organized list format
- Show key order information (order number, date, total, status)
- Use the same theme and layout as the rest of the site (header, footer, styling)
- Be accessible only to authenticated users
- Allow users to click on an order to view more details (optional enhancement)
- BONUS: Include pagination for 10+ orders

The page should integrate seamlessly with the existing design and navigation structure of TilloMart.

## Documenting Your Solutions

As you work on these tasks, please document your approach and justifications in the `SOLUTION_NOTES.md` file. We're interested in understanding:

- **Your problem-solving process** - How did you identify and approach each issue?
- **Technical decisions** - Why did you choose specific solutions over alternatives?
- **Performance considerations** - How did you measure and validate your improvements?
- **Design choices** - What guided your Backend/Frontend decisions?

This documentation helps us understand your thought process and the reasoning behind your implementation choices. Please be thorough in explaining your decisions, even if they seem obvious to you.

## Getting Started

1. Clone this repository
2. Make sure you have Docker Desktop installed
3. Run `composer install`
4. Run `cp .env.example .env` to copy the sample .env file and configure your database
5. Run `./vendor/bin/sail up -d` to start the application
6. Run `./vendor/bin/sail npm install` to install Node.js dependencies
7. Run `./vendor/bin/sail artisan migrate --seed` to set up the database with sample data
8. Run `./vendor/bin/sail composer run dev` to build the frontend assets
9. Visit `http://localhost` to see the application

## Good Luck!

We're excited to see your approach to these challenges. Feel free to ask any questions if you need clarification on the requirements. 

## Submitting Your Solution

Before you `zip` up your solution, please remove logs, vendor and node_modules directories, a command to do this is below:

```
rm -rf storage/logs && rm -rf vendor && rm -rf node_modules
```
