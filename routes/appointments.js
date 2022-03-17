const express = require('express');
const {getAppointments,getAppointment,addAppointment, updateAppointments,deleteAppointments} = require('../controllers/appointments');

const router = express.Router({mergeParams:true});

const {protect,authorize} = require('../middleware/auth');

router.route('/').get(protect, getAppointments).post(protect,authorize('admin', 'user'),addAppointment);


router.route('/:id').get(protect, getAppointment).put(protect,authorize('admin', 'user'),updateAppointments).delete(protect,authorize('admin', 'user'),deleteAppointments);
module.exports = router;