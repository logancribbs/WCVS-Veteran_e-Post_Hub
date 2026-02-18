# Sprint 4 Report (02/17/2026)
## * youtube link here *

## What's New (User Facing) 👶🆕
During this sprint, we successfully deployed the newly enhanced version of the Whitman County Veterans e-Post Hub (whitmanvs.com). The updated version now integrates a Prisma database that supports persistent storage for uploaded files, event information, admin login usernames, and securely hashed credentials. In addition to these backend improvements, we enhanced the user interface by adding a new textured background to give the website more visual depth. We also implemented a bottom bar containing supplementary support information and copyrights details, helping to create a more complete, polished, and professional overall look and feel for the site.

## Work Summary (Developer Facing) 🧑‍💻
From a development perspective, our main objective was to rebuild and deploy an enhanced version of the pre-exisiting website with full backend integration and independent hosting. A key challenge we faces was that we did not own the original domain and did not have access credentials to retrieve or migrate the existing site's data. As a result, we made the strategic decision to rebuild the platform with the pre-exisiting codebase from the ground up rather than attempt partial integration. Although this required re-implementing core functionality, it ultimately gave us full control over the architecture, database design, and deployment pipeline.

On the backend, we designed and implemented Prisma models to support structured storage for event information, image files, and administrative login credentials. We configured database migrations and ensured proper API integration for persistent data handling. For authentication, we're using the existing secure password hashing (b-crypt) to protect admin credentials and validate login logic for access control. On the frontend, we enhanced the visual presentation by adding a textured background and implementating a bottom bar component to improve structure and professionalism. Finally we independently deployed the rebuilt application using Vercel, giving our team the flexibility to manage updates and releases without reliances on the original site infrastructure. This sprint strengthened our understanding of full-stack integration, secure authentication practices, and deployment workflows.

## Unfinished Work (Issues to be created soon) ☝️
* Event Management Enhancements – While events can now be stored in the Prisma database, we plan to improve validation, editing functionality, and admin-side controls for managing event entries more efficiently (wouldn't hard to make it better).
* Image Upload Optimization – Additional refinement is needed for handling image uploads, including improved error handling, file validation, and potential optimization for storage and retrieval performance.
* Licensing, Compliance, and Legal Documentation – We plan to work with the client to establish proper licensing and copyright claims, and to ensure the website meets ADA accessibility standards, GDPR data protection requirements, and other necessary legal documentation to support the site’s long-term validity and compliance.
* Authentication Hardening – Although admin login with hashed credentials is implemented, we plan to enhance session management and add stronger protections against invalid login attempts.

## Completed Issues/User Stories ✅
* [Searchbar Feature Removal](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/30)
* [Sidebar Quick Links Appearance Enhancement](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/35)
* [New Landing Page Background](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/41)
* [New Bottom Bar](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/42)
* [Live Website whitmanvs.com Deployment](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/43)
* [Mock Admin Logins with Event Mods](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/34)
* [Admin Create, Edit, Delete Story](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/10)
* [Prisma Database Setup for whitmanvs.com](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/44)


## Incomplete & In-Progress Issues/User Stories ⚠️
* [Meeting Previous Developers](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/6)
  - This task remains incomplete due to scheduling constraints. This meeting is intended to gather historical context, technical insights, and recommendations to better guide continued development of the platform.
* [Responsive UI to Seasons](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/26)
  - This feature is still in progress and focuses on dynamically updating the website's visual theme based on the current season. Development and planning is ongoing as design assets and implementation details are being refined on the current default webpage. This is not our top priority but is definitely a feature we're are aiming to complete by Sprint 6.
* [Script for Past Event Automation](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/21)
  - This automation feature is in progress and aims to automatically remove expired events to keep the platform up to date. Additional testing and deployment setup are required before it can go live.
* [Event Priority Feature](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/20)
  - This feature is currently under development and will allow administrators to prioritize or "boost" certain events for higher visibility on the webpage. The core concept is defined, but the interface and ranking logic is under discussion.
* [Website ADA compliance](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/45)
  - We are currently waiting on the Client's end to process and determine ADA complaince for our new website under whitmanvs.com. Proper documents needs to be supplemented before the website can officially be hard launched.
* [Pending Rights, Policies & License for whitmanvs.com](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/47)
  - Proper documents needs to be supplemented before the website can officially be hard launched, especially since we are in the process of moving on from whitmancountyveterans.com to whitmanvs.com.
* [ARIA extension feature](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/46)
  - Feature that has yet to be integrated into our fully functioning website that will ease appearance for those with disabilities. We aim to have this feature available and ready to use in Sprint 5 at the earliest.
* [Adding Client's resources to links](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/25)
  - We want to make sure that the resources are properly formatted, available to ONLY view for 24/7  before we can add them to the support links of the website. Our client is currently looking into what they can do to make sure document resources links never expire once shared.
* [Overall Website Clean-up/Refinement](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/33)
  - This is essentially a check-list item, and will be performed after each iteration for the future sprints. This will remain in-progress until completetion and delivery of product until Sprint 6.
* [Downloading Flyers as internal links](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/9)
  - Work is underway to allow users to download event flyers directly from the site. The backend logic is partially implemented, but full integration and user testing are still pending to make sure this action is done fluidly with no visual clutter/pop-ups.

## Code Files for Review 📝📈
-

## Retrospective Summary 🧾
Here's what went well:
* Rebuilding the website from the ground up gave us full architectural control and eliminated dependency on the original domain infrastructure.
* Prisma integration and database migrations were successfully implemented, allowing structured and secure data persistence.
* Independent deployment through Vercel streamlined our release process and gave us flexibility for future updates.
* Team collaboration improved as responsibilities were divided clearly between backend integration, frontend enhancements, and deployment testing.

Here's what we'd like to improve:
* Earlier identification of domain ownership and data access limitations could have saved time in planning.
* More structured issue creation at the beginning of the sprint would have improved task tracking.
* Additional testing time should be allocated before deployment to catch smaller UI and validation inconsistencies.

Here are changes we plan to implement in the next sprint:
* Create detailed GitHub issues with clearly defined acceptance criteria at sprint planning.
* Allocate dedicated time for testing and validation before final alpha and beta deployment.
* Begin early coordination with the client regarding ADA compliance, GDPR protection, and licensing requirements to ensure legal and accessibility standards are addressed proactively.
