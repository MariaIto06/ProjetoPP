// Importa um recurso necessário de outro arquivo ou biblioteca.
import { Router } from 'express';
// Importa um recurso necessário de outro arquivo ou biblioteca.
import FilmeController from '../controllers/filmeController.js';
// Cria uma variável para guardar um valor ou referência.
const router = Router();
// Associa um método e endereço HTTP à função que tratará a requisição.
router.get('/', FilmeController.listarFilmes);
// Associa um método e endereço HTTP à função que tratará a requisição.
router.get('/:id', FilmeController.buscarFilme);
// Associa um método e endereço HTTP à função que tratará a requisição.
router.post('/', FilmeController.cadastrarFilme);
// Associa um método e endereço HTTP à função que tratará a requisição.
router.put('/:id', FilmeController.atualizarFilme);
// Associa um método e endereço HTTP à função que tratará a requisição.
router.delete('/:id', FilmeController.excluirFilme);
// Disponibiliza este recurso para outros arquivos importarem.
export default router;
