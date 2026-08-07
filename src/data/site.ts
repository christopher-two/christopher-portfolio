export const siteUrl = 'https://www.christopher.com.mx';
export const siteName = 'Christopher Two';
export const siteDescription = 'Portfolio de Christopher Alejandro Maldonado Chávez: productos multiplataforma con Kotlin, Android, Astro, IA y Cloudflare.';

export const organizationSchema = {
  '@type': 'Organization',
  '@id': `${siteUrl}/override#organization`,
  name: 'Override',
  url: 'https://www.override.com.mx/',
  description: 'Empresa de software enfocada en productos digitales, sistemas y experiencias multiplataforma.',
  founder: { '@id': `${siteUrl}/bio#person` },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'general inquiries',
    email: 'hola@christopher.com.mx',
    availableLanguage: ['es', 'en'],
  },
};

export const authorSchema = {
  '@type': 'Person',
  '@id': `${siteUrl}/bio#person`,
  name: 'Christopher Alejandro Maldonado Chávez',
  url: `${siteUrl}/bio`,
  jobTitle: 'Desarrollador multiplataforma',
  description: 'Desarrollador especializado en Kotlin Multiplatform, Jetpack Compose, Android, Astro y Cloudflare.',
  email: 'mailto:hola@christopher.com.mx',
  worksFor: { '@id': `${siteUrl}/override#organization` },
  homeLocation: {
    '@type': 'Place',
    name: 'Uruapan, Michoacán, México',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Uruapan',
      addressRegion: 'Michoacán',
      addressCountry: 'MX',
    },
  },
  award: ['Innovatec Nacional 2025', 'TecNM · Innovación 2024', 'Coding Cup México'],
  sameAs: [
    'https://github.com/christopher-two',
    'https://www.linkedin.com/in/christopher-two/',
    'https://www.instagram.com/christopher_two_/',
    'https://www.youtube.com/@ChristopherTwo',
  ],
  knowsAbout: [
    'Kotlin Multiplatform',
    'Jetpack Compose',
    'Android development',
    'Astro',
    'Cloudflare Workers',
    'Clean Architecture',
    'Artificial intelligence',
  ],
};
