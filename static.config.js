import path from 'path'

export default {
  entry: path.join(__dirname, 'src', 'index.tsx'),
  getRoutes: async () => {
    return [
      {
        path: '/',
        template: 'src/containers/Landing',
        getData: () => ({
          foo: 'bar',
        }),
      },
    ]
  },
  plugins: [
    'react-static-plugin-typescript',
    require.resolve('react-static-plugin-reach-router'),
    require.resolve('react-static-plugin-styled-components'),
    require.resolve('react-static-plugin-sitemap'),
  ],
}
