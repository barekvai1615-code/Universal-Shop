import React from 'react';
import { StorefrontHeader } from './StorefrontHeader';
import { StorefrontHero } from './StorefrontHero';
import { HowItWorks } from './HowItWorks';
import { ProductCatalogGrid } from './ProductCatalogGrid';
import { DirectSupportBanner } from './DirectSupportBanner';
import { StorefrontFooter } from './StorefrontFooter';

export const StorefrontPage: React.FC = () => {
  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e]">
      <StorefrontHeader
        onScrollToCatalog={scrollToCatalog}
        onScrollToHowItWorks={scrollToHowItWorks}
      />
      <main>
        <StorefrontHero
          onExploreClick={scrollToCatalog}
          onHowItWorksClick={scrollToHowItWorks}
        />
        <HowItWorks />
        <ProductCatalogGrid />
        <DirectSupportBanner />
      </main>
      <StorefrontFooter />
    </div>
  );
};
