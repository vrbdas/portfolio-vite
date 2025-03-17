import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: './',
  build: {
    outDir: '../devartmax/public_html', // Указываем, куда будет build, это папка аналог public_html
    emptyOutDir: true // Очистка папки перед сборкой
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'api.php', // Исходный файл
          dest: '.' // Копировать в корень папки сборки (обычно dist)
        }
      ]
    })
  ],
  server: {
    proxy: {
      '/backend': { // backend - это префикс, чтобы отличать запросы к серверу и перенаправлять их, можно назвать как угодно, главное в js указывать его fetch('/backend/send-mail.php')
        target: 'http://devartmax.local/', // Указываем адрес FlyEnv-сервера
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/backend/, '') // Убираем /backend из пути
      }
    }
  }, 
});
