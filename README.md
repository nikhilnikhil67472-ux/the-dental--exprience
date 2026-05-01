# The Dental Experience - Premium Website

A conversion-optimized, high-performance website for "The Dental Experience" dental clinic.

## Features
- **Premium Design**: Clean, minimal medical-premium aesthetic using a strict color palette (#FFFFFF, #0EA5E9, #F3F4F6).
- **Responsive**: Fully mobile-first design with breakpoints for 320px, 768px, 1024px, and 1440px.
- **Conversion Focused**: Integrated appointment booking form and WhatsApp quick-book floating FAB.
- **SEO Optimized**: Semantic HTML5, Schema.org (MedicalOrganization, Dentist, FAQPage, Review) markup.
- **Performance**: Lazy-loaded images, critical CSS path, and optimized animations.

## Tech Stack
- HTML5 / CSS3 / JavaScript (ES6+)
- [Swiper.js](https://swiperjs.com/) for testimonials.
- [Icons8](https://icons8.com/) for medical-grade SVG icons.

## Setup & Deployment
1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   ```
2. **Assets**:
   - Replace placeholder images in the `img/` folder with actual WebP formatted images (<70KB each).
   - Ensure `logo.webp` and `doctor-portrait.webp` are present.
3. **Hosting**:
   - Deploy to any static hosting provider (Vercel, Netlify, GitHub Pages).
   - Ensure HTTPS is enabled for security and trust.
4. **Analytics**:
   - Add your GA4 measurement ID in the `<head>` of `index.html`.
   - Track WhatsApp clicks using the `utm_source=website` parameter.

## CMS Integration
For dynamic content management (Services, Testimonials, Gallery), this static site can be integrated with:
- **Headless CMS**: Strapi, Contentful, or Sanity.io.
- **Static Site Generators**: Jekyll, Hugo, or Eleventy for easier content updates.

## Analytics & Tracking (GA4)
To track conversions, monitor:
1. **Form Submissions**: Event name `generate_lead` on booking form success.
2. **WhatsApp Clicks**: Event name `whatsapp_chat_click` on FAB or Hero CTA click.
3. **Phone Clicks**: Event name `phone_call_click` on mobile click-to-call buttons.

## Security
- **CSP Headers**: Recommended to add Content Security Policy headers on the server side.
- **Form Sanitization**: Client-side validation is implemented; ensure backend `/api/book` also sanitizes inputs.

## Maintenance
- Update the clinic address and doctor names in `index.html` and Schema markup.
- Periodically check the Google Maps iframe source if the clinic location changes.
