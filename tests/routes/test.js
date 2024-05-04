const router = require('express').Router()

const { createTestMannual, createTestAuto, startTest, finishTest, testDetail, getAnswers, getTests, getDetailedAnswer } = require('../controller/testController')
const answer = require('../middleware/answer')
const professor = require('../middleware/professor')
const student = require('../middleware/student')
const studentProfessor = require('../middleware/studentProfessor')

router.post('/create/manual', professor, createTestMannual)
router.post('/create/auto', professor, createTestAuto)
router.get('/', studentProfessor, getTests)
router.get('/detail/:testId', professor, testDetail)
router.post('/start/:testId', student, startTest)
router.post('/finish', answer, finishTest)
router.post('/answers', student, getAnswers)
router.post('/answers/:answerId', student, getDetailedAnswer)

module.exports = router