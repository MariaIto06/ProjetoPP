import { Router } from 'express';
import FilmeController from '../controllers/filmeController.js';
const router = Router();
router.get('/', FilmeController.listarFilmes);
router.get('/:id', FilmeController.buscarFilme);
router.post('/', FilmeController.cadastrarFilme);
router.put('/:id', FilmeController.atualizarFilme);
router.delete('/:id', FilmeController.excluirFilme);
export default router;
