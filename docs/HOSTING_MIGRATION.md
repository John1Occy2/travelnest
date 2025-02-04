# Hosting Migration Guide

This document provides instructions for migrating the TravelNest application from Replit to GitHub Pages.

## Prerequisites
1. A GitHub account
2. Git installed on your local machine
3. Node.js and npm installed locally

## Migration Steps

### 1. Repository Setup
1. Create a new repository on GitHub
2. Clone the Replit repository locally:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

### 2. Environment Variables
1. Copy all environment variables from Replit:
   - STRIPE_SECRET_KEY
   - VITE_STRIPE_PUBLIC_KEY
2. Add them to GitHub repository secrets:
   - Go to repository Settings > Secrets and Variables > Actions
   - Add each environment variable

### 3. GitHub Pages Setup
1. In your repository settings, go to Pages
2. Set the source to "GitHub Actions"
3. The deployment will automatically trigger when you push to main

### 4. Domain Setup (Optional)
1. If you have a custom domain:
   - Go to repository Settings > Pages
   - Under "Custom domain", enter your domain
   - Add the necessary DNS records at your domain provider

### 5. Verification
After migration:
1. Verify the build process completes successfully in GitHub Actions
2. Check that the site is accessible at your GitHub Pages URL
3. Test all main functionality:
   - User authentication
   - Hotel listings
   - Virtual tours
   - Booking system
   - Payment processing

### Troubleshooting
- Check GitHub Actions logs for build errors
- Verify environment variables are correctly set
- Ensure all dependencies are properly listed in package.json

## Support
For issues with:
- GitHub Pages: Contact GitHub Support
- Application specific issues: Create an issue in the repository
- Stripe integration: Contact Stripe Support

Remember to update any documentation that references Replit-specific configurations or URLs.
