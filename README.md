# FreelanceHub - Freelance Service Marketplace

A web-based marketplace where clients can discover freelancers and post project requests, and freelancers can show their services and send proposals.

Course: CSE326 Internet Programming (CA1 Project)

## Problem Statement

Customers looking for services such as web development, graphic design, writing or video editing often struggle to compare freelancers. Freelancers need a structured way to present their services and receive project requests. FreelanceHub connects both sides in one place.

## Features

- Freelancer profiles with bio, hourly rate and portfolio
- Search by name or skill
- Filter by category and maximum rate, and sort by rating or price
- Clients post projects with title, category, budget, deadline and description
- Direct "Request" button to send a project to a chosen freelancer
- Freelancers send proposals with a price and message
- Status tracking: Open, In Progress, Completed (proposals: Pending, Accepted, Rejected)
- Separate dashboards for clients and freelancers
- Form validation and a responsive layout for mobile and desktop

## Technologies Used

- HTML5: semantic tags (header, nav, main, section, article) and forms with validation
- CSS3: Flexbox, Grid, CSS variables and a media query for responsive design
- JavaScript: variables, arrays, objects, functions, loops and conditionals
- Browser localStorage to save data without a server
- GitHub and GitHub Pages for hosting

## Project Structure

| File | Purpose |
|---|---|
| index.html | Browse freelancers with search, filter and sort |
| post-project.html | Client project request form |
| dashboard.html | Client and freelancer dashboards |
| profile.html | Freelancer profile and portfolio form |
| style.css | Styling and responsive layout |
| script.js | All JavaScript logic |

## How to Use

1. Open the live site, or open index.html in a browser.
2. Use the "I am a" dropdown at the top to switch between Client and Freelancer.
3. As a Client, browse freelancers and post a project (or click "Request" on a freelancer).
4. As a Freelancer, create your profile under "My profile", then send a proposal from the Dashboard.
5. As a Client, open the Dashboard, accept a proposal, and mark the project completed.

## Note on Data

Data is stored in the browser using localStorage. It stays on the same browser and device, and a real marketplace would use a server and database instead.

## Team

- [Shobit Tandon]: HTML pages and form validation
- [Ranjeet ]: CSS styling and responsive design
- [Mayank Singh]: JavaScript logic
