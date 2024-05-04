const router = require('express').Router();
const adminProfessor = require('../middlewares/adminProfessor')
const admin = require('../middlewares/admin')

const { register, login, remove, info, edit, allProfessors, logout } = require('../controller/professorsController');

router.post('/register', admin, register);
router.post('/login', login);
router.delete('/remove/:professorId', admin, remove);
router.get('/info', adminProfessor, info);
router.get('/', admin, allProfessors);
router.patch('/edit/:professorId', admin, edit);
router.post('/logout', adminProfessor, logout)

module.exports = router;