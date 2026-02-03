# Sprint 3 Report (12/07/2025)
## [Youtube link for Sprint 3 Video](https://youtu.be/vq3R6OFLmhc)

## What's New (User Facing) 👶🆕
This sprint introduced a substantial number of visible improvements aimed at enhancing usability, clarity, and the overall experience for both regular users and administrators. The landing page received a refreshed title and visual polish that better aligns with the client’s requested branding changes following Sprint 2. Event cards were redesigned to improve readability and information layout, while the search bar was updated with new sizing and spacing adjustments that make it more intuitive to use. The sidebar now includes a dynamic slideshow feature, updated quicklinks derived from the client’s resource spreadsheet, and improved styling that creates a more organized and coherent layout. Administrators will notice major functional upgrades, including the fully implemented create, edit, and delete workflows for event management, along with support for recurring events and date ranges. Users can now upload images for events, enriching the visual presentation of information. Global font adjustments and other stylistic refinements round out the polished look and feel introduced in Sprint 3.

## Work Summary (Developer Facing) 🧑‍💻
From a development perspective, Sprint 3 focused on implementing new features while refining and restructuring critical components across both the frontend and backend. The team rebuilt several UI components—such as the event tiles, navigation elements, hero banner, and admin controls—to support consistent behavior and improved responsiveness. The landing page was restructured to create a clearer hierarchy and enhance maintainability, while global styling and legacy code were cleaned up to reduce clutter and improve readability. On the backend, significant updates were made to the event API, enabling full CRUD functionality, recurring event logic, and more robust admin validation. A mock admin authentication system was added to facilitate frontend and backend integration testing, allowing us to validate user stories before final presentation. Additional improvements included supporting image upload handling, updating database structures as needed, and maintaining thorough documentation and issue tracking throughout the sprint. Overall, Sprint 3 centered on stabilizing core functionality, enhancing the admin workflow, polishing UI elements, and preparing the system for upcoming testing and deployment phases.


## Unfinished Work (Issues to be created soon) ☝️
* Initial steps towards deployment with Vercel (production build checks, environment variables, hosting setup).
* Additional work needed on seasonal UI responsiveness and automatic sytlic logic.
* Database interation review to improve scalability, indexing, and query performance.
* Strengthening authentication to move beyond mock admin login and toward a secure production-ready system.
* Accessibility and finaly styling review, including color contrast, keyboard navigation, and accessible rich internet applications (ARIA).
* Development of an automated event cleanup/archiving system.
* Meeting with former developers to gether insights into legacy structure and undocumented features.


## Completed Issues/User Stories ✅
* [Landing page title update](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/24)
* [Event Card Appearance Change](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/27)
* [Adding Client's resource spreadsheet to quicklinks](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/25)
* [Event Tile View button upgrade](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/28)
* [Search bar size adjustment](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/29)
* [Slideshow feature added to sidebar](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/30)
* [Side bar + slideshow container adjustment](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/31)
* [Adding Delete Event function](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/32)
* [Cleaning/removing unwanted text + clutter](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/33)
* [Login setup with mock admin login](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/34)
* [Side bar quicklinks appearance enhancement](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/35)
* [New create feature](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/22)
* [Create/Delete function tested + added](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/36)
* [Admin create, edit, delete](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/10)
* [Date ranges + reoccurring features allowed](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/37)
* [Adding recurring events tiles](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/23)
* [Uploading images for user](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/38)
* [Font sizing + style changes](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/39)


## Incomplete & In-Progress Issues/User Stories ⚠️
* [Responsive UI to changing seasons](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/26)
  - This feature is still in progress and focuses on dynamically updating the website's visual theme based on the current season. Development and planning is ongoing as design assets and implementation details are being refined on the current default webpage.
* [Meeting with former developers](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/6)
  - This task remains incomplete due to scheduling constraints. This meeting is intended to gather historical context, technical insights, and recommendations to better guide continued development of the platform.
* [Downloading Event Flyers](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/9)
  - Work is underway to allow users to download event flyers directly from the site. The backend logic is partially  implemented, but full integration and user testing are still pending.
* [Old event removal automation](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/21)
  - This automation feature is in progress and aims to automatically remove expired events to keep the platform up to date. Additional testing and deployment setup are required before it can go live.
* [Event Priority/Boost feature](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/20)
  - This feature is currently under development and will allow administrators to prioritize or "boost" certain events for higher visibility on the webpage. The core concept is defined, but the interface and ranking logic is under discussion.


## Code Files for Review 📝📈
* [Landing Page - e-post_hub/app/page.tsx](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/blob/15-WCVS-branch/e-post_hub/app/page.tsx)
* [Layout file - e-post_hub/app/layout.tsx](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/blob/15-WCVS-branch/e-post_hub/app/layout.tsx)
* [Top Banner Config - e-post_hub/app/Components/Hero](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/blob/15-WCVS-branch/e-post_hub/app/Components/Hero/HeroBanner.tsx)
* [Side bar Config - e-post_hub/app/Components/Hero](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/blob/15-WCVS-branch/e-post_hub/app/Components/Hero/Sidebar.tsx)
* [Bottom bar Config - e-post_hub/app/Components/BottomBar](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/blob/15-WCVS-branch/e-post_hub/app/Components/BottomBar/BottomBar.tsx)
* [Website API Events handling - e-post_hub/app/api/Event](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/tree/15-WCVS-branch/e-post_hub/app/api/Event/%5Bid%5D)
* [Website API Admin - e-post_hub/app/api/admins](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/tree/15-WCVS-branch/e-post_hub/app/api/admins)
* [Website API Authorization - e-post_hub/api/auth/login](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/tree/15-WCVS-branch/e-post_hub/app/api/auth/login)
* [Global CSS file - e-post_hub/app/globals.css](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/blob/15-WCVS-branch/e-post_hub/app/globals.css)
* [Tailwind Config file - e-post_hub/tailwind.config.ts](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/blob/15-WCVS-branch/e-post_hub/tailwind.config.ts)

  
## Retrospective Summary 🧾
Here's what went well:
* Complete redesing of the landing page based oon client feedback from Sprint 2.
* Prototype Draft continued progressing with strong improvements each iteration.
* Project documentation was polished and updated consistently for final deliverables.
* Strong teammate coordination + flexible delegation of tasks.
* Coordination and flexibility between team members working on objectives + deliverables.
* Significant expansion of Event Handling: Edit / Add / Delete fully functional.
* Created a mock Admin account enabling feature validation during testing.
* Successfully implemented Login and user authentication workflows.
* Maintained consistent commit history and transparent progress tracking.

Here's what we'd like to improve:
* Formalizing unit tests + integration tests, especially around event creation and recurring logic.
* More extensive backend-frontend validation to ensure consistent behavior across components.
* Better planning around long-term automation features (event cleanup, seasonal UI logic).
* Stronger exploration of database relations, indexing, and scalability considerations.
* Ensuring all UI components maintain responsiveness across devices and screen sizes.
  
Here are changes we plan to implement in the next sprint:
* Develop scripts to automate event cleanup and data-based behaviors.
* Implement a "garbage collector" workflow for outdated events.
* Begin formal QA testing on all core system features.
* Dive deeper into database optimization and admin-level data management tools
* Prepoare for potential deployment of the redesigned website.
