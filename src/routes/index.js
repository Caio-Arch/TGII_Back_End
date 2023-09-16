const { Router } = require('express');

const paymentRouter = require('./payments.routes'); 

const routes = Router();

routes.use('/payments', paymentRouter);


module.exports = routes;