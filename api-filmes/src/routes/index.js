import { Router } from 'express';
import filmeRoutes from './filmeRoutes.js';
import categoriaRoutes from './categoriaRoutes.js';
const routes = Router();
routes.use('/filmes', filmeRoutes);
routes.use('/categorias', categoriaRoutes);
export default routes;
