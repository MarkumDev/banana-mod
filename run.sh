npx esbuild src/index.ts \
  --bundle \
  --minify \
  --platform=browser \
  --target=es2020 \
  --format=iife \
  --global-name=App \
  --legal-comments=none \
  --outfile=dist/app.user.js

