/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/resume',
                destination: '/resume.pdf',
                permanent: true,
            },{
                source: '/a2gs',
                destination: 'https://matthewlee626.notion.site/a2gs',
                permanent: true,
            },{
                source: '/thoughts',
                destination: 'https://matthewlee626.notion.site/thoughts',
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
