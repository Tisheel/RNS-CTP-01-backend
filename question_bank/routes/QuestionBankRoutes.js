const router = require('express').Router()

const { addQuestion, editQuestion, deleteQuestion, getQuestions, addManyQuestions, getQuestion } = require('../controllers/QuestionBankController')
const professor = require('../middlewares/professor')

router.post('/add', professor, addQuestion)
// router.post('/bulk', addManyQuestions)
router.patch('/edit/:questionId', professor, editQuestion)
router.delete('/remove/:questionId', professor, deleteQuestion)
router.post('/', professor, getQuestions)
router.get('/:id', professor, getQuestion)

module.exports = router