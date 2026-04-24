# Veteran e-Post Hub

## Project Summary

Introducing the Veteran E-Post Hub, a full-stack web application designed to support the Whitman County veteran community. Admin users can manage and moderate events by creating, approving, editing, or deleting submissions through a centralized dashboard. The system includes tools for managing homepage content, such as event flyers and resource links, allowing non-technical staff to keep the site up to date easily. Guest users can browse a curated list of events, view flyers (PDF or image), and access important community resources without needing an account. The platform emphasizes accessibility, usability, and clear navigation to ensure all users can easily find relevant information.

### Additional information about the project

The Veteran E-Post Hub is a full-stack application developed for Whitman County Veterans Services (WCVS) to provide a centralized hub for community events and resources. The platform allows administrators to efficiently manage content while giving the public easy access to important information. The system was built using modern web technologies, including Next.js, Prisma, and Vercel, and is designed to be maintainable and scalable. Key features include support for PDF flyers, dynamic event management, and admin tools for updating homepage images and resource links. Accessibility was a major focus of this project. The application includes keyboard navigation, screen reader compatibility, proper color contrast, and alt text for images. Additional user experience features, such as external link warnings and clear content organization, were implemented to improve usability for all users. Overall, the Veteran E-Post Hub is designed to be a reliable, easy-to-manage platform that helps keep the local veteran community informed and connected.

### Prerequisites

The only thing needed to use Veteran e-Post Hub is an internet-connected device, such as a PC, laptop, tablet, or smartphone.

### Add-ons

- [Next UI](nextui.org) - Used for the front end design (Deprecated and now is called HeroUI)
- [Next JS](nextjs.org) - The framework used for our e-Post Hub
- [Tailwind CSS](tailwindcss.com) - A script command for css. Helps by scripting front end design commands
- [Zod](zod.dev) -  Used for validations
- [React Icons](https://react-icons.github.io/react-icons/) - A library of icons used with the webapp 
- [React Hook Forms](https://react-hook-form.com/) - Used for managing and validating forms
- [Prisma](https://www.prisma.io/) - Helps with collabrative database enviroments
- [SQLlite](https://www.sqlite.org/) - database used to save accounts and other important information
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - hash used for password hashing
- [Vercel](https://vercel.com/docs) - Used for our website deployment
- [Vitest](https://vitest.dev/) - Used for testing our website

### Installation Steps - (Dev steps)

1. Clone the Repository:
    - git clone https://github.com/mmanning95/veteran-e-post-hub.git
    - cd veteran-e-post-hub
2. Install Dependencies:
    - npm install
3. Setup the database:
    - Create your own database
    - Recommended: SQlite for local testing
4. Start Server:
    - npx run dev

## Deployment

The application is deployed using Vercel.

To deploy:
1. Connect the GitHub repository to Vercel
2. Configure the required environment variables in the Vercel project settings:
   - DATABASE_URL
   - JWT_SECRET
3. Deploy the project

For local development, create a `.env` file in the root directory and include the same variables.

Note: Sensitive environment variable values are not stored in the repository and must be provided separately.

### Functionality

#### Admin Experience
- **Full Control & Moderation:**  
  Administrators have full control over event content. They can create, edit, and delete events to ensure information is accurate and up to date.
- **Event Management:**  
  Admins can upload and manage event flyers (PDF or image), which are displayed directly on event cards for easy viewing by users.
- **Homepage Management Tools:**  
  Administrators have access to built-in tools for updating homepage content, including managing slideshow images and editing resource links through dedicated modals.
- **Theme Management:**  
  The system includes support for seasonal themes that automatically activate based on dates, with the ability for admins to manage or override themes as needed.

#### Member Experience
- **N/A:**  
  The current version of the Veteran E-Post Hub does not include a member-specific experience. All public-facing functionality is accessible without requiring user authentication.

#### Guest Experience
- **Read-Only Access:**  
  Guests can browse all public content, including event listings, flyers, and resource links, without needing to log in.
- **Accessible Content Viewing:**  
  Users can view event flyers directly within the site (PDF viewer or image display) and easily navigate content using keyboard controls and a clear visual structure.
- **Simplified User Experience:**  
  The interface is designed to be easy to use, ensuring that all users can quickly find relevant information without unnecessary complexity.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Additional Documents

