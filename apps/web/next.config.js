/* eslint-disable @typescript-eslint/no-require-imports */
const { composePlugins, withNx } = require('@nx/next');
const path = require('path');

const configEnv = process.env.NEXT_CONFIG_ENV || 'default';

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const baseConfig = {
  nx: { svgr: false },
  output: 'standalone',
  webpack: config => {
    /* eslint-disable-next-line */
    config.resolve.alias['@coreloops/shared-types'] = path.resolve(__dirname, '../../libs/shared-types/src');
    /* eslint-disable-next-line */
    config.resolve.alias['@coreloops/data-access-layer'] = path.resolve(__dirname, '../../libs/data-access-layer/src');
    /* eslint-disable-next-line */
    return config;
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    domains: [],
  },
};

const e2eConfig = {
  ...baseConfig,
  distDir: '../../dist/apps/web',
};

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const finalConfig = configEnv === 'e2e' ? e2eConfig : baseConfig;

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(finalConfig);
