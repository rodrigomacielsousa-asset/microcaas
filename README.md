# MicroCaaS - Ecossistema de microsoluções contábeis

Projeto oficial do portal **microcaas.com.br**, focado na divulgação e catálogo de microsoluções contábeis (CaaS - Accounting as a Service).

## 🚀 Tecnologias
- **Frontend:** React 19 + Vite + TypeScript
- **Estilização:** Tailwind CSS (Modern SaaS UI)
- **Animações:** Motion
- **Roteamento:** React Router 7
- **Database:** LocalStorage (Padrão) / Firebase (Opcional)

## 📦 Como Rodar Localmente

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Inicie o servidor de desenvolvimento: `npm run dev`
4. Acesse: `http://localhost:3000`

## ☁️ Firebase (Opcional)
Para ativar a persistência em nuvem (Firestore e Auth):
1. Copie o conteúdo de `.env.example` para um novo arquivo `.env`
2. Configure `VITE_USE_FIREBASE=true`
3. Preencha as credenciais do seu projeto Firebase
4. O `storageService.ts` cuidará do resto automaticamente.

## 🚢 Deploy (GitHub Pages)
O projeto já inclui um workflow de GitHub Actions em `.github/workflows/deploy.yml`.

### Configuração de Domínio Personalizado
1. **Registro.br:**
   - Aponte os registros **A** para os IPs do GitHub Pages (185.199.108.153, etc).
   - Crie um registro **CNAME** para `www` apontando para `seu-usuario.github.io`.
2. **GitHub Settings:** 
   - Vá em Settings > Pages e insira `microcaas.com.br`.

## 📂 Estrutura de Conteúdo
- `src/data/solucoes.json`: Soluções Oficiais controladas pelo time CaaS.
- `src/data/microcaas.json`: Catálogo de microsoluções da comunidade.
- `src/pages/Reforma.tsx`: Hub e Simulador da Reforma Tributária.

---
Feito com ❤️ pela Comunidade CaaS Contábil.
