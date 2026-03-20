import type { UserConfigExport } from "@tarojs/cli";
export default {
  
  mini: {},
  h5: {
    devServer: {
      host: '0.0.0.0',
      // open: true,
      port: 6661,
      proxy: {
        '/api/': {
          target: 'http://localhost:6666/',
          changeOrigin: true,
        },
      },
    },
  },
} satisfies UserConfigExport<'vite'>
