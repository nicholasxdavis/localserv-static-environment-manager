import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      electron([
        {
          entry: resolve(__dirname, 'src-electron/main.js'),
          vite: {
            build: {
              outDir: resolve(__dirname, 'dist-electron'),
              minify: isProduction,
              rollupOptions: {
                external: ['electron', 'express', 'portfinder']
              }
            }
          }
        },
        {
          entry: resolve(__dirname, 'src-electron/preload.js'),
          onstart(options) {
            // Reload the window when preload scripts are rebuilt
            if (!isProduction) {
              options.reload();
            }
          },
          vite: {
            build: {
              outDir: resolve(__dirname, 'dist-electron'),
              minify: isProduction,
              rollupOptions: {
                external: ['electron']
              }
            }
          }
        }
      ]),
      renderer()
    ],
    root: './src',
    base: './',
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      minify: isProduction ? 'esbuild' : false,
      sourcemap: !isProduction,
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    server: {
      port: 5173,
      strictPort: true
    }
  };
});
