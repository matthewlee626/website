/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/resume',
                destination: '/resume.pdf',
                permanent: true,
            },
        ]
      },
};

export default nextConfig;
