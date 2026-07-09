/** @type {import('next').NextConfig} */
const nextConfig = {
    // next-auth@4.24 + next@13.4.4: SWC loader emits a duplicate NextResponse
    // declaration unless next-auth is transpiled by Next.js itself.
    transpilePackages: ["next-auth"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.pixabay.com",
            },
            // AWS S3 — covers any bucket/region combination
            {
                protocol: "https",
                hostname: "*.s3.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "*.s3.*.amazonaws.com",
            },
        ],
    },

    async redirects() {
        return [
            // 308 permanent redirect: /BlogPage → /blogs
            {
                source: "/BlogPage",
                destination: "/blogs",
                permanent: true,
            },
            // Old per-post IDs (Firestore doc IDs) can't map 1:1 to new slugs,
            // so we redirect to the listing page.
            {
                source: "/BlogPage/:id",
                destination: "/blogs",
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
