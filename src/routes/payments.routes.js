const { Router } = require('express');

const PaymentFunctions = require('../functions/payment'); 

const paymentRouter = Router();

paymentRouter.get('/', async (request, response) => {
    const { GenerateClientToken, clientId } = PaymentFunctions();

    const clientToken = await GenerateClientToken();

    return response.json({ clientToken, clientId });
});

paymentRouter.post('/ordes', async (request,response) => {
    const { CreateOrder } = PaymentFunctions();

    const cart = [
        {
            reference_id: 1,
            amount: {
                currency_code: 'BRL',
                value: '800.00',
            },
        },
        {
            reference_id: 2,
            amount: {
                currency_code: 'BRL',
                value: '20.0',
            },
        },
    ];

    const order = await CreateOrder({ cart });

    return response.json(order);
});

paymentRouter.post('/ordes/:orderId/capture', async (request,response) => {
    const { orderId } = request.params;

    const { CapturePayment } = PaymentFunctions();

    const paymentCaptured = await CapturePayment(orderId);

    return response.json(paymentCaptured);
});

module.exports = paymentRouter;