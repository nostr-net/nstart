dev:
  npm run dev

build:
  npm run build

deploy target: build
  rsync -av --delete --progress build package.json package-lock.json .env.production {{target}}:~/nstart/
  ssh njump 'cd nstart; nvm use; npm ci --omit dev'
  ssh njump 'systemctl stop nstart'
  ssh njump 'systemctl start nstart'