const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const alunosRoutes = require('./alunos');
const planosRoutes = require('./planos');
const matriculasRoutes = require('./matriculas');
const treinosRoutes = require('./treinos');
const iaRoutes = require('./ia');

router.use('/auth', authRoutes);
router.use('/alunos', alunosRoutes);
router.use('/planos', planosRoutes);
router.use('/matriculas', matriculasRoutes);
router.use('/treinos', treinosRoutes);
router.use('/ia', iaRoutes);

module.exports = router;