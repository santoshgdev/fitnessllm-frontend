sudo apt-get update && sudo apt-get install apt-transport-https npm

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc
nvm install 20

wget -qO- https://dl-ssl.google.com/linux/linux_signing_key.pub \
  | sudo gpg  --dearmor -o /usr/share/keyrings/dart.gpg

echo 'deb [signed-by=/usr/share/keyrings/dart.gpg arch=amd64] https://storage.googleapis.com/download.dartlang.org/linux/debian stable main' \
  | sudo tee /etc/apt/sources.list.d/dart_stable.list
 sudo snap install flutter --classi

dart pub global activate flutterflow_cli

sudo npm install -g firebase-tools

echo 'export PATH="$PATH:~/flutter/bin"' >> ~/.bashrc && source ~/.bashrc
firebase login