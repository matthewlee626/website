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
            }
        ]
      },
};

export default nextConfig;
