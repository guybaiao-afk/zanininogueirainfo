#!/bin/bash

# Script para preparar o repositório local e fornecer instruções para implantação no Netlify.

# 1. Certifique-se de estar no diretório raiz do projeto
cd /home/ubuntu/zanininogueirainfo

# 2. Verifique se o Git está inicializado e configurado (já feito)
# git init
# git config --global user.email "manus@example.com"
# git config --global user.name "Manus AI"

# 3. Adicione todos os arquivos e faça o commit (já feito)
# git add .
# git commit -m "Initial commit of ZaniniNogueira Health & Performance website"

echo ""
echo "============================================================="
echo "  Próximos passos para implantar ZaniniNogueira Health & Performance no Netlify:"
echo "============================================================="
echo ""
echo "1. Crie um novo repositório **privado** no GitHub, GitLab ou Bitbucket."
echo "   (Ex: https://github.com/new)"
echo ""
echo "2. Adicione o repositório remoto ao seu projeto local. Substitua <YOUR_REMOTE_REPO_URL> pela URL do seu novo repositório:"
echo "   git remote add origin <YOUR_REMOTE_REPO_URL>"
echo "   (Ex: git remote add origin https://github.com/seu-usuario/zanininogueirainfo.git)"
echo ""
echo "3. Envie seus arquivos para o repositório remoto:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Acesse o Netlify (https://app.netlify.com/start) e faça login."
echo ""
echo "5. Clique em 'Add new site' e depois em 'Import an existing project'."
echo ""
echo "6. Conecte seu provedor Git (GitHub, GitLab ou Bitbucket) e selecione o repositório 'zanininogueirainfo'."
echo ""
echo "7. Nas configurações de implantação, certifique-se de que os seguintes campos estão corretos:"
echo "   - **Build command:** pnpm run build (ou npm run build, se preferir npm)"
echo "   - **Publish directory:** dist"
echo "   (O Netlify geralmente detecta isso automaticamente para projetos Vite/React)"
echo ""
echo "8. Clique em 'Deploy site'."
echo ""
echo "Seu site será construído e implantado automaticamente. O Netlify fornecerá uma URL para acessar seu site online."
echo ""
echo "============================================================="
echo ""
