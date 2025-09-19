import { NextSeoProps } from 'next-seo';

export const defaultSEOConfig: NextSeoProps = {
  title: 'Opensauced - Ethereum ecosystem developer metrics',
  description: 'Comprehensive dashboard showing Ethereum ecosystem statistics and insights',
  canonical: 'https://ethereum-metrics.opensauced.pizza',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ethereum-metrics.opensauced.pizza',
    siteName: 'Opensauced Ethereum Metrics',
    title: 'Opensauced - Ethereum ecosystem developer metrics',
    description: 'Comprehensive dashboard showing Ethereum ecosystem statistics and insights',
    images: [
      {
        url: '/social_thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'Opensauced Ethereum ecosystem developer metrics dashboard',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    handle: '@opensauced',
    site: '@opensauced',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'Ethereum, developer metrics, blockchain, ecosystem, statistics, dashboard, opensauced, cryptocurrency, web3, development analytics',
    },
    {
      name: 'author',
      content: 'Opensauced',
    },
    {
      name: 'robots',
      content: 'index,follow',
    },
    {
      name: 'googlebot',
      content: 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1',
    },
  ],
};

export const generatePageSEO = (
  title: string,
  description: string,
  path?: string
): NextSeoProps => ({
  ...defaultSEOConfig,
  title: `${title} | Opensauced`,
  description,
  canonical: path ? `https://ethereum-metrics.opensauced.pizza${path}` : defaultSEOConfig.canonical,
  openGraph: {
    ...defaultSEOConfig.openGraph,
    title: `${title} | Opensauced`,
    description,
    url: path ? `https://ethereum-metrics.opensauced.pizza${path}` : defaultSEOConfig.openGraph?.url,
  },
});