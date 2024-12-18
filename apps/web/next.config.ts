import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'placehold.co',
      },
      {
        protocol: 'https' as const,
        hostname: '**',
      },
    ],
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: [['rehype-raw', { strict: true, throwOnError: true }]],
  },
})

export default withMDX(nextConfig)
