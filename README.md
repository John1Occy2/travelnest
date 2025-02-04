# TravelNest - African Travel Platform

A cutting-edge African travel platform that transforms hotel booking into an immersive cultural experience, bridging travelers with unique local destinations through innovative technology and user-centric design.

## Features
- Interactive hotel room 360-degree virtual preview
- Advanced search and recommendation algorithms
- Multi-currency support
- Cultural storytelling integration
- Responsive mobile-first design

## Deployment Instructions

### Local Development
1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file with the following variables:
```
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```
4. Start the development server:
```bash
npm run dev
```

### Production Deployment
The application is configured to automatically deploy to GitHub Pages when changes are pushed to the main branch.

#### Environment Variables for Production
Before deploying, ensure you have set up the following secrets in your GitHub repository:
1. Go to Settings > Secrets and Variables > Actions
2. Add the following secrets:
   - `VITE_STRIPE_PUBLIC_KEY`: Your Stripe publishable key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key

#### Manual Deployment
1. Build the project:
```bash
npm run build
```
2. The built files will be in the `dist` directory

## Backup Hosting Instructions
If Replit hosting becomes unavailable:

1. The repository is already configured for GitHub Pages
2. All deployments will automatically trigger through GitHub Actions
3. The site will be available at: `https://<your-github-username>.github.io/<repository-name>/`

## Development Guidelines
- All Pull Requests should be made to the `main` branch
- Ensure all tests pass before submitting a PR
- Follow the existing code style and conventions

## License
MIT License - See LICENSE file for details
