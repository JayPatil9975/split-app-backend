const express = require('express');
const router = express.Router();
const {
  getPeople,
  getBalances,
  getSettlementSummary
} = require('../controllers/settlementController');

router.get('/people', getPeople);
router.get('/balances', getBalances);
router.get('/settlements', getSettlementSummary);

module.exports = router;
