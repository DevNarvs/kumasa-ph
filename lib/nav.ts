export const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/#events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/news', label: 'News' },
] as const;

export const footerLinks = [...navLinks, { href: '/contact', label: 'Contact' }] as const;
