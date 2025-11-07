# Sprint 2 Report (11/05/2025)
## [Youtube link for Sprint 2 Video](https://youtu.be/qwaXFh73cuc)

## What's New (User Facing)
The webpage now features a significantly more refined and responsive interface. Event tiles were redesigned for clarity and better visual hierarchy, making event information easier to digest. The navigation bar and menu guide were updated for smoother accessibility across both desktop and mobile views. A responsive search bar has been implemented, allowing users to dynamically filter and find events based on keywords, improving the browsing experience. The desktop UI banner and color palette were also adjusted to better align with the site’s theme and client feedback. Overall, the frontend now feels more cohesive, modern, and functional, providing users with a clearer sense of structure and purpose when visiting the Veteran e-Post Hub.

## Work Summary (Developer Facing)
This sprint primarily focused on stabilizing the frontend layout and finalizing the responsive UI design. We have worked on refining the landing page structure (app/page.tsx) and global layout (app/layout.tsx) to ensure consistency across all components. We have experimented but not yetintegrated Tailwind CSS configurations to support custom responsiveness and theme consistency, while also improving maintainability of global styles. A new search component was added to the main page, featuring live query handling and responsive adaptation for smaller screens.

In parallel, updates were made to key project documents including the Requirements & Specifications and Solution Approach, ensuring technical alignment with client expectations. We have also prepared a working prototype presentation and video demonstration to summarize progress for stakeholders. The backend implementation for admin and event management was deferred, as the team prioritized ensuring the UI’s stability before integrating database and CRUD operations in the next sprint.

## Unfinished Work
* [Meeting with former developers](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/6): Life happens, we were able to relay information but unsuccessful follow-up (not our biggest priority but input would be nice).
* Issue(s) not created yet but we have not been emphasizing on the Webpage's database nor have we implemented any testing procedures just yet.

## Completed Issues/User Stories
Here are links to the issues that we completed in this sprint:
* [Changing Event Tiles](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/15)
* [Change Webpage Menu Guide](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/14)
* [Refining UI Mockups](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/4)
* [Updated Desktop UI banner](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/13)
* [Updated Requirements & Specifications doc](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/11)
* [Presentation for Sprint 2](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/19)
* [Updated Solution Approach doc](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/16)
* [Added + Implemented Responsive Search Query](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/18)

## Incomplete Issues/User Stories
Here are links to issues we worked on but did not complete in this sprint:
* [US-08 – Download Event Flyers](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/9): Flyer download button included in prototype, but backend logic not yet implemented. Was supposed to be implemented but we had an oversight. Simple solution wil be there for Sprint 3.
* [US-10 – Admin Create/Edit/Delete Events](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/10): Dashboard layout complete in local deployment; CRUD functionality pending. Will begin in Sprint 3.
* [New Event Create Functionality](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/22)
* [Add Event Priority](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/20)
* [Automating Deletion of Past Events](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/21)
**Note:** Last three issues - all of which are mainly backend, will be tackled once the interface and reformatting of new Webpage is approved by Client meeting taking place (11/7).

## Code Files for Review
* [Landing Page - e-post_hub/app/page.tsx](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/blob/15-WCVS-branch/e-post_hub/app/page.tsx)
* [Layout file - e-post_hub/app/layout.tsx](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/blob/15-WCVS-branch/e-post_hub/app/layout.tsx)
* [Webpage Components - e-post_hub/app/Components](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/tree/15-WCVS-branch/e-post_hub/app/Components)
* [Global CSS file - e-post_hub/app/globals.css](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/blob/15-WCVS-branch/e-post_hub/app/globals.css)
* [Tailwind Config file - e-post_hub/tailwind.config.ts](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/blob/15-WCVS-branch/e-post_hub/tailwind.config.ts)

## Retrospective Summary
Here's what went well:
* Implemented a complete UI/UX prototype that clearly communicates the intended design on our local machines.
* Created and organized documentations as Sprint and Web page development continues.
* Established Git flow structure and seamless collaboration on different development evironments (Windows/macOS).
* Simple UI interactability that reflected ideas and expectations communication by our client.
* Great and laborous usage of Kanban Board.
* Constant means of communication + updates between members.
* Backup and Recovery practice.

Here's what we'd like to improve:
Our overall understanding on the structure of the original repository, and how "the pieces fall into place". We believe that understanding how the code was organized by previous developers can help we extend the code base without likelihood of compilation/runtime errors and ensure deliverables are consistently meet without lag time between members.

Here are changes we plan to implement in the next sprint:
* More UI changes + adjustments.
* Interacting with the database.
* Scripts for Event automation.
* Account Managements.

