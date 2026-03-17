# Sprint 5 Report (03/15/2026)
## [Youtube link for Sprint 5](*insert here*)

## What's New (User Facing) 👶🆕
This sprint introduced several improvements aimed at enhancing usability, visual presentation, and overall navigation throughout the website. The bottom navigation bar was refined to provide a clearer and more accessible way for users to explore resources and events. Seasonal theme customization was also introduced, allowing administrators to easily switch between holiday-themed appearances such as Christmas and the Fourth of July. In addition, the image viewing experience was improved through smoother transitions and refined layouts, creating a more seamless browsing experience when interacting with featured images and slideshow content. Several interface cleanups were also performed, removing unnecessary text and visual clutter to provide users with a cleaner and more intuitive website experience. Resource links across the site were also reviewed and updated to ensure they remain accurate and helpful for visitors

## Work Summary (Developer Facing) 🧑‍💻
During this sprint, development efforts focused on improving administrative functionality, refining UI components, and strengthening the platform’s accessibility and maintainability. The admin dashboard was enhanced to make managing website content more efficient, including the addition of tools for updating resource links and slideshow images directly through the administrative interface. Several core frontend components, such as the bottom navigation bar and hero components, were refined to improve layout consistency and visual flow across the site. Initial accessibility improvements were implemented through ADA compliance checks and early ARIA feature development to support users with disabilities. Additional work included general UI cleanup, resource link validation, and improvements to image transitions to create smoother interactions. Authentication functionality was also strengthened through the implementation of hashed credential storage and an admin password quick-view feature designed to improve administrative usability while maintaining secure authentication practices.

## Unfinished Work (Issues to be created soon) ☝️
* Comprehensive Website Testing - Full end-to-end testing of the website has not yet been completed. Future work will include testing across multiple browsers and devices to ensure consistent functionality and performance.
* WAVE accessibility checks website extension + viewing refinement - Accessibility testing using the WAVE browser extension still needs to be completed. Identified accessibility issues will be addressed through UI adjustments to improve compliance with accessibility standards.
* Image Upload Optimization – Additional refinement is needed for handling image uploads, including improved error handling, file validation, and potential optimization for storage and retrieval performance.
* Authentication Hardening – Although admin login with hashed credentials is implemented, we plan to enhance session management and add stronger protections against invalid login attempts.

## Completed Issues/User Stories ✅
* [Admin Dashboard Refinement](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/57)
* [Bottom Bar Refinement](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/58)
* [ADA compliance checks](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/45)
* [Resources Revision - Link Checks](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/25)
* [Smoother Website Transitions - Images](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/49)
* [Clicked Image Layout Refinement](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/49)
* [Cleaning/Removing Unwanted Text](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/33)
* [4th of July Theme Change](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/54)
* [Christmas Theme Change](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/55)
* [Theme Buttons](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/56)
* [Manage Resource Links Feature - Admin side](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/51)
* [Manage Slideshow Image - Admin side](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/52)
* [Password quick view - Admin side](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/53)

## Incomplete & In-Progress Issues/User Stories ⚠️
* [ARIA extension feature](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/46)
  - Feature that has yet to be integrated into our fully functioning website that will ease appearance for those with disabilities. We aim to have this feature available and ready to use in Sprint 5 at the earliest.
* [Pending Rights, Policies & License for whitmanvs.com](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/47)
  - Proper documents needs to be supplemented before the website can officially be hard launched, especially since we are in the process of moving on from whitmancountyveterans.com to whitmanvs.com.
* [Responsive UI to Seasons](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/26)
  - This feature is still in progress and focuses on dynamically updating the website's visual theme based on the current season. Development and planning is ongoing as design assets and implementation details are being refined on the current default webpage. This is not our top priority but is definitely a feature we're are aiming to complete by Sprint 6.
* [Script for Past Event Automation](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/21)
  - This automation feature is in progress and aims to automatically remove expired events to keep the platform up to date. Additional testing and deployment setup are required before it can go live.
* [Downloading Flyers as internal links](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/9)
  - Work is underway to allow users to download event flyers directly from the site. The backend logic is partially implemented, but full integration and user testing are still pending to make sure this action is done fluidly with no visual clutter/pop-ups.
* [Overall Website Clean-up/Refinement](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/issues/33)
  - This is essentially a check-list item, and will be performed after each iteration for the future sprints. This will remain in-progress until completetion and delivery of product until Sprint 6.

## Code Files for Review 📝📈
* [Bottom Bar Component](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/tree/2b6e9d03cc733d7b603084feb3ac290ecc6a790f/e-post_hub/app/Components/BottomBar)
* [Vercel Live Branch - Authentication](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/tree/e752120c2a76030ed803ce3814eb102212f21712/e-post_hub/app/(auth))
* [Vercel Live Branch - App Components](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/tree/e752120c2a76030ed803ce3814eb102212f21712/e-post_hub/app/Components)
* [Vercel Live Branch - APIs](https://github.com/logancribbs/WCVS-Veteran_e-Post_Hub/tree/fix/vercel-prod/e-post_hub/app/api)
* [Landing Page Layer](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/blob/2b6e9d03cc733d7b603084feb3ac290ecc6a790f/e-post_hub/app/page.tsx)
* [Hero Components](https://github.com/logancribbs/WCVS-Veteran_e-Post_Hub/tree/fix/vercel-prod/e-post_hub/app/Components/Hero)
* [Website Globals CSS](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/blob/2b6e9d03cc733d7b603084feb3ac290ecc6a790f/e-post_hub/app/globals.css)
* [Public Cached Images](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/tree/15-WCVS-branch/e-post_hub/public)
* [Themes Folder - Changing Seasons UI templates](https://github.com/logancribbs/WCVS-Veteran_e-Post_Hub/tree/fix/vercel-prod/e-post_hub/app/themes)
* [PDF Viewer](https://github.com/lsc-compsci/WCVS-Veteran_e-Post_Hub/tree/15-WCVS-branch/e-post_hub/app/Components/PdfViewer)

## Retrospective Summary 🧾
Here's what went well:
* The team successfully completed a large number of UI refinement issues and administrative features.
* Collaboration across frontend components allowed several improvements to be implemented simultaneously without major conflicts.
* Administrative tools for managing resources and slideshow images significantly improved maintainability of the site.
* The implementation of hashed credential authentication strengthened the platform’s baseline security.

Here's what we'd like to improve:
* Some features required additional testing and refinement before completion, particularly accessibility and automation-related tasks.
* End-to-end testing and cross-browser validation were not fully completed during this sprint.
* Several features were partially implemented but require further integration and testing before deployment.

Here are changes we plan to implement in the next sprint:
* Perform comprehensive website testing across browsers and devices.
* Complete accessibility validation using WAVE and finalize ARIA integration.
* Optimize the image upload system with improved validation and error handling.
* Strengthen authentication security through improved session handling and protection against repeated login attempts.
* Continue development on automation features such as past-event removal and flyer downloads.
