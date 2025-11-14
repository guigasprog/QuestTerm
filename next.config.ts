/** @type {import('next').NextConfig} */

const REPO_NAME = 'QuestTerm'; 

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',

  basePath: isProduction ? `/${REPO_NAME}` : '',
  assetPrefix: isProduction ? `/${REPO_NAME}/` : '',
  
  trailingSlash: true,

  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;