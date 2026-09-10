/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/blogs/:path*',
                destination: '/thoughts/:path*',
                permanent: true,
            },
            {
                source: '/blog/:path*',
                destination: '/thoughts/:path*',
                permanent: true,
            },
            {
                source: '/beijing',
                destination: '/thoughts/beijing',
                permanent: true,
            },
            {
                source: '/resume',
                destination: '/resume.pdf',
                permanent: true,
            },{
                source: '/a2gs',
                destination: 'https://matthewlee626.notion.site/a2gs',
                permanent: true,
            },{
                source: '/travels',
                destination: 'https://matthewlee626.notion.site/travels',
                permanent: true,
            }
        ]
      },
};

export default nextConfig;
