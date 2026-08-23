import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { handleCopilotRequest, handleRecommendationRequest, handleSearchRequest } from './src/api/router';

function apiDevServerPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        let bodyStr = '';
        req.on('data', (chunk) => {
          bodyStr += chunk;
        });

        req.on('end', async () => {
          try {
            const body = bodyStr ? JSON.parse(bodyStr) : {};

            if (req.url === '/api/ai/search' && req.method === 'POST') {
              const result = await handleSearchRequest(body);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
              return;
            }

            if (req.url === '/api/ai/copilot' && req.method === 'POST') {
              const result = await handleCopilotRequest(body);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
              return;
            }

            if (req.url === '/api/ai/recommend' && req.method === 'POST') {
              const result = await handleRecommendationRequest(body);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
              return;
            }

            if (req.url === '/api/health') {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ status: 'ok', engine: 'InduSense AI Neural Pipeline v2.8' }));
              return;
            }

            next();
          } catch (e: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
