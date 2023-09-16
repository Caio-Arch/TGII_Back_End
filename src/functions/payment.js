const fetch = (...args) => 
    import('node-fetch').then(({default: nodefetch}) => nodefetch(...args)); 

const paymentProcessors = require('../config/paymentProcessors');

const { clientId, clientSecret } = paymentProcessors().paypal;

const base = 'https://api-m.sandbox.paypal.com';

const PaymentFunctions = () => {
    async function GenerateAccessToken() {
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const response = await fetch(`${base}/v1/oauth2/token`, {
            method: 'post',
            body: 'grant_type=client_credentials',
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao gerar token de acesso');
        }

        const data = await response.json();
        return data.access_token; 
    }

    async function GenerateClientToken() {
        const accessToken = await GenerateAccessToken();
        const response = await fetch(`${base}/v1/identity/generate-token`, {
            method: 'post',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao gerar token de cliente');
        }

        const data = await response.json();
        return data.client_token;
    }

    async function CreateOrder({ cart }) {
        const accessToken = await GenerateAccessToken();
        const url = `${base}/v2/checkout/orders`;
        const response = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: cart,
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao criar pedido');
        }

        const data = await response.json();
        return data;
    }

    async function CapturePayment(orderId){
        const accessToken = await GenerateAccessToken();
        const url = `${base}/v2/checkout/orders/${orderId}/capture`;
        const response = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao capturar pagamento');
        }

        const data = await response.json();
        return data;
    }

    return {
        CapturePayment,
        CreateOrder,
        GenerateAccessToken,
        GenerateClientToken,
        clientId,
    };    
};

module.exports = PaymentFunctions;