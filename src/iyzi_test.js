const crypto = require('crypto');

const apiKey = "sandbox-fwVdQqofGMmdhFDZHEPy1mhHRgynUC7q";
const secretKey = "sandbox-f0a6VgnZeU0C5ILlGCoYHcWHzVqX6zRn";
const baseUrl = "https://sandbox-api.iyzipay.com";
const uriPath = "/payment/iyzipos/checkoutform/initialize/auth/ecom";

const body = {
    locale: "tr",
    conversationId: "123456789",
    price: "50.00",
    paidPrice: "50.00",
    currency: "TRY",
    basketId: "order-123",
    paymentGroup: "PRODUCT",
    paymentChannel: "WEB",
    callbackUrl: "http://localhost:5173/api/payment/callback/iyzico",
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
        id: "user-123",
        name: "John",
        surname: "Doe",
        identityNumber: "11111111111",
        email: "test@example.com",
        registrationAddress: "Mimar Sinan Mah. Cad. No:99/1",
        ip: "85.105.186.126",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34672"
    },
    shippingAddress: { contactName: "John Doe", city: "Istanbul", country: "Turkey", address: "Mimar Sinan Mah.", zipCode: "34672" },
    billingAddress: { contactName: "John Doe", city: "Istanbul", country: "Turkey", address: "Mimar Sinan Mah.", zipCode: "34672" },
    basketItems: [
        {
            id: "BI1",
            name: "Product 1",
            category1: "Category",
            itemType: "PHYSICAL",
            price: "50.00"
        }
    ]
};

const requestBody = JSON.stringify(body);
const randomString = Date.now().toString() + "1234";
const dataToEncrypt = randomString + uriPath + requestBody;
const signature = crypto.createHmac('sha256', secretKey).update(dataToEncrypt).digest('hex');
const authString = `apiKey:${apiKey}&randomKey:${randomString}&signature:${signature}`;
const authHeader = "IYZWSv2 " + Buffer.from(authString).toString('base64');

fetch(baseUrl + uriPath, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
    },
    body: requestBody
}).then(res => res.text()).then(t => console.log(t)).catch(console.error);
