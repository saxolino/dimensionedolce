export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  phone, email, instagramUrl, instagramHandle,
  address { street, city, zip, province },
  hours[] { days, time },
  copyrightYear, googleMapsEmbedUrl
}`;

export const homePageQuery = `*[_type == "homePage"][0] {
  seoTitle, seoDescription,
  gallery[] {
    size, name,
    image { asset-> { url, metadata { dimensions } } },
    alt,
    subImages[] {
      name,
      image { asset-> { url, metadata { dimensions } } },
      alt
    }
  },
  benvenuti { title, text },
  serviceBlocks[] {
    title, text, ctaText, ctaUrl,
    image { asset-> { url, metadata { dimensions } } },
    imageAlt, bgVariant, photoPosition
  }
}`;

export const menuPageQuery = `*[_type == "menuPage"][0] {
  seoTitle, seoDescription,
  sections[] {
    title, subtitle, bgVariant, layout,
    items[] {
      name, description, price, badge,
      variants[] { name, price },
      image { asset-> { url, metadata { dimensions } } },
      alt,
      gelatoColor, gelatoKicker
    }
  }
}`;

export const aboutPageQuery = `*[_type == "aboutPage"][0] {
  seoTitle, seoDescription,
  gallery[] {
    image { asset-> { url, metadata { dimensions } } },
    alt
  },
  storiaTitle, storiaText,
  chefs[] {
    name, role, bio,
    portrait { asset-> { url, metadata { dimensions } } }
  },
  ctaTitle, ctaButtonText, ctaButtonUrl
}`;

export const cateringPageQuery = `*[_type == "cateringPage"][0] {
  seoTitle, seoDescription,
  introTitle, introText,
  serviceBlocks[] {
    title, text, bgVariant,
    image { asset-> { url, metadata { dimensions } } },
    imageAlt
  },
  showcaseGallery[] {
    image { asset-> { url, metadata { dimensions } } },
    alt
  },
  ctaTitle, ctaText, ctaButtonText, ctaButtonUrl
}`;

export const contactPageQuery = `*[_type == "contactPage"][0] {
  seoTitle, seoDescription,
  formTitle,
  contactSubjects[] { value, label }
}`;

export const faqPageQuery = `*[_type == "faqPage"][0] {
  seoTitle, seoDescription,
  sections[] {
    title,
    faqs[] { question, answer }
  }
}`;
