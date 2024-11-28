export PATH := "./node_modules/.bin:" + env_var('PATH')

dev:
  vite dev --port 4647

build:
  vite build

deploy target: build
  rsync -av --delete --progress build package.json package-lock.json {{target}}:~/nstart/
  ssh {{target}} 'cd nstart; nvm use; npm ci --omit dev'
  ssh {{target}} 'systemctl restart nstart'
