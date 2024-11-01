export PATH := "./node_modules/.bin:" + env_var('PATH')

dev:
  vite dev --port 4647

build:
  vite build

deploy target: build
  rsync -av --delete --progress build package.json package-lock.json .env.production {{target}}:~/nstart/
  ssh njump 'cd nstart; nvm use; npm ci --omit dev'
  ssh njump 'systemctl restart nstart'
