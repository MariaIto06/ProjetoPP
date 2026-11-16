# API de Filmes — atividade da professora Patrícia

Projeto de estudo baseado na atividade dirigida **API de Filmes com Node.js e SQL Server**. Usa JavaScript com ES Modules, Express, mssql, dotenv, cors, SQL Server e HTML/CSS simples (sem React/Next.js). Mantido em pasta independente para não alterar o ProjetoPP.

## Estrutura
- `server.js`: inicia o servidor na porta do .env (padrão 8080).
- `src/app.js`: configura Express, HTML estático e prefixo /api.
- `src/routes/`: associa URLs e métodos aos controllers.
- `src/controllers/`: recebe requisições, valida dados, trata erros e retorna status.
- `src/models/`: executa consultas SQL parametrizadas.
- `src/config/dbConnect.js`: conexão SQL Server.
- `public/index.html`: formulário, select de categorias e tabela com fetch.
- `script.sql`: cria esquema/tabelas e dados de exemplo.

## Rodar no VS Code
Abra o terminal **dentro de api-filmes**:
```bash
npm install
```
Copie `.env.example` para `.env` e preencha os dados reais do banco (NUNCA publique senhas). Execute `script.sql` no SQL Server autorizado e depois:
```bash
npm run dev
```
Abra http://localhost:8080

## Se node_modules der erro
1. Confira `node -v` e `npm -v`.
2. Verifique se o terminal está na pasta `api-filmes` (onde está o package.json).
3. Rode `npm install`; não copie node_modules de outro computador.
4. Se a instalação falhar, verifique rede/proxy, leia o erro completo e tente `npm cache verify` antes de repetir `npm install`.
5. Se a página abrir mas não carregar dados, confira `.env`, SQL Server, tabelas e conexão: isso é diferente de erro de npm.
6. Se `npm run dev` falhar, teste `npm start` para executar sem nodemon.

## Rotas
GET /api/categorias; POST /api/categorias; GET /api/filmes; GET /api/filmes/:id; POST /api/filmes; PUT /api/filmes/:id; DELETE /api/filmes/:id.

Exemplo JSON para POST /api/filmes:
```json
{"titulo":"Filme de teste","categoria_id":1,"diretor":"Diretor de teste","ano_lancamento":2020,"duracao_minutos":110}
```

## Fluxo GET /api/filmes
`server.js` inicia o servidor → `app.js` encaminha `/api` → `routes/index.js` e `filmeRoutes.js` selecionam o controller → `filmeController.js` chama `Filme.buscarTodos()` → `Filme.js` usa `dbConnect.js` e executa INNER JOIN → controller devolve JSON e status 200.

## Testes
Teste todas as rotas no Insomnia ou Postman, incluindo 404 para filme inexistente, 400 para dados incompletos e 201 ao cadastrar. Os prints de testes precisam ser feitos em ambiente com SQL Server configurado. **Não foram executados testes reais de integração com banco aqui.**

## Observações
- O enunciado traz `bdConnect.js` na árvore e `dbConnect.js` na Etapa 3; foi usado `dbConnect.js`, como na Etapa 3.
- O exemplo de `app.js` usa `body-parser`, mas as instruções também pedem `express.json()` e não incluem `body-parser` na instalação. Foi usado `express.json()`, sem dependência extra.
- `package-lock.json` será gerado por `npm install`. Não foi gerado neste envio.
- Não inclua `.env` ou `node_modules` no GitHub.
