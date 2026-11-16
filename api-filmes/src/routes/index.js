// Importa um recurso necessário de outro arquivo ou biblioteca.
import { Router } from 'express';
// Importa um recurso necessário de outro arquivo ou biblioteca.
import filmeRoutes from './filmeRoutes.js';
// Importa um recurso necessário de outro arquivo ou biblioteca.
import categoriaRoutes from './categoriaRoutes.js';
// Cria uma variável para guardar um valor ou referência.
const routes = Router();
// Executa esta etapa da lógica do programa.
routes.use('/filmes', filmeRoutes);
// Executa esta etapa da lógica do programa.
routes.use('/categorias', categoriaRoutes);
// Disponibiliza este recurso para outros arquivos importarem.
export default routes;
