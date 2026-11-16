// Importa um recurso necessário de outro arquivo ou biblioteca.
import { Router } from 'express';
// Importa um recurso necessário de outro arquivo ou biblioteca.
import CategoriaController from '../controllers/categoriaController.js';
// Cria uma variável para guardar um valor ou referência.
const router = Router();
// Associa um método e endereço HTTP à função que tratará a requisição.
router.get('/', CategoriaController.listarCategorias);
// Associa um método e endereço HTTP à função que tratará a requisição.
router.post('/', CategoriaController.cadastrarCategoria);
// Disponibiliza este recurso para outros arquivos importarem.
export default router;
