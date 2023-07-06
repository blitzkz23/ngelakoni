# How To Config TailwindCSS Project

# On terminal
npm install -D tailwindcss
npx tailwindcss init

# On tailwind.config.js
change the 'content' to wherever the html, js are

# On src/css/input.css
@tailwind base;
@tailwind components;
@tailwind utilities;

add those^

# On terminal
npm init -y
Place this on build:
"build": "tailwindcss -i ./src/css/input.css -o ./dist/output.css --watch"

# To start
npm run build 