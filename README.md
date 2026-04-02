📌 Cypress Test Automation Project

This repository contains automated tests built with Cypress to validate critical application flows.

🚀 Prerequisites

Before running the project, make sure you have:

Node.js (recommended version: 16+)
npm or yarn
⚠️ Required Setup (IMPORTANT)

To successfully execute the tests, you must configure a valid Admin user in the platform.

🔑 Why is this required?

The automated tests rely on administrative permissions to access specific features of the application. Without proper credentials, several test scenarios will fail.

🔧 Setup (Step-by-step)
1. Create a new Admin user
Access the platform
Create a new user with Administrator role
Ensure the user is active and has full permissions
2. Configure the .env file

Create a .env file in the root of the project (if it doesn't exist) and add the following variables:

CYPRESS_BASE_URL=https://your-base-url.com
CYPRESS_ADMIN_EMAIL=your-admin-email@test.com
CYPRESS_ADMIN_PASSWORD=your-password
3. Install dependencies
npm install
4. Run the tests

Interactive mode:

npx cypress open

Headless mode:

npx cypress run
