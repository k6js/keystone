import Path from 'path';
// @ts-ignore
import withPreconstruct from '@preconstruct/next';

export const config = withPreconstruct({
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config: any, { isServer }: any) {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: Path.dirname(require.resolve('react/package.json')),
      'react-dom': Path.dirname(require.resolve('react-dom/package.json')),
      '@k6js/ks-next': Path.dirname(
        require.resolve('@k6js/ks-next/package.json')
      ),
    };
    if (isServer) {
      config.externals = [
        ...config.externals,
        /@keystone-next\/keystone(?!\/___internal-do-not-use-will-break-in-patch\/admin-ui\/id-field-view|\/fields\/types\/[^\/]+\/views)/,
        '.prisma/client',
      ];
    }
    return config;
  },
});
