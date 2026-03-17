import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from './languages';

// TR
import trCommon from './locales/tr/common.json';
import trAuth from './locales/tr/auth.json';
import trCatalog from './locales/tr/catalog.json';
import trBasket from './locales/tr/basket.json';
import trCheckout from './locales/tr/checkout.json';
import trOrders from './locales/tr/orders.json';
import trAdmin from './locales/tr/admin.json';
import trValidation from './locales/tr/validation.json';

// EN
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enCatalog from './locales/en/catalog.json';
import enBasket from './locales/en/basket.json';
import enCheckout from './locales/en/checkout.json';
import enOrders from './locales/en/orders.json';
import enAdmin from './locales/en/admin.json';
import enValidation from './locales/en/validation.json';

// DE
import deCommon from './locales/de/common.json';
import deAuth from './locales/de/auth.json';
import deCatalog from './locales/de/catalog.json';
import deBasket from './locales/de/basket.json';
import deCheckout from './locales/de/checkout.json';
import deOrders from './locales/de/orders.json';
import deAdmin from './locales/de/admin.json';
import deValidation from './locales/de/validation.json';

// FR
import frCommon from './locales/fr/common.json';
import frAuth from './locales/fr/auth.json';
import frCatalog from './locales/fr/catalog.json';
import frBasket from './locales/fr/basket.json';
import frCheckout from './locales/fr/checkout.json';
import frOrders from './locales/fr/orders.json';
import frAdmin from './locales/fr/admin.json';
import frValidation from './locales/fr/validation.json';

// ES
import esCommon from './locales/es/common.json';
import esAuth from './locales/es/auth.json';
import esCatalog from './locales/es/catalog.json';
import esBasket from './locales/es/basket.json';
import esCheckout from './locales/es/checkout.json';
import esOrders from './locales/es/orders.json';
import esAdmin from './locales/es/admin.json';
import esValidation from './locales/es/validation.json';

// RU
import ruCommon from './locales/ru/common.json';
import ruAuth from './locales/ru/auth.json';
import ruCatalog from './locales/ru/catalog.json';
import ruBasket from './locales/ru/basket.json';
import ruCheckout from './locales/ru/checkout.json';
import ruOrders from './locales/ru/orders.json';
import ruAdmin from './locales/ru/admin.json';
import ruValidation from './locales/ru/validation.json';

// AR
import arCommon from './locales/ar/common.json';
import arAuth from './locales/ar/auth.json';
import arCatalog from './locales/ar/catalog.json';
import arBasket from './locales/ar/basket.json';
import arCheckout from './locales/ar/checkout.json';
import arOrders from './locales/ar/orders.json';
import arAdmin from './locales/ar/admin.json';
import arValidation from './locales/ar/validation.json';

// Read persisted language; never fall back to browser locale
const savedLang = localStorage.getItem('language') ?? SUPPORTED_LANGUAGES[0].code;

i18n
    .use(initReactI18next)
    .init({
        resources: {
            tr: {
                common: trCommon,
                auth: trAuth,
                catalog: trCatalog,
                basket: trBasket,
                checkout: trCheckout,
                orders: trOrders,
                admin: trAdmin,
                validation: trValidation,
            },
            en: {
                common: enCommon,
                auth: enAuth,
                catalog: enCatalog,
                basket: enBasket,
                checkout: enCheckout,
                orders: enOrders,
                admin: enAdmin,
                validation: enValidation,
            },
            de: {
                common: deCommon,
                auth: deAuth,
                catalog: deCatalog,
                basket: deBasket,
                checkout: deCheckout,
                orders: deOrders,
                admin: deAdmin,
                validation: deValidation,
            },
            fr: {
                common: frCommon,
                auth: frAuth,
                catalog: frCatalog,
                basket: frBasket,
                checkout: frCheckout,
                orders: frOrders,
                admin: frAdmin,
                validation: frValidation,
            },
            es: {
                common: esCommon,
                auth: esAuth,
                catalog: esCatalog,
                basket: esBasket,
                checkout: esCheckout,
                orders: esOrders,
                admin: esAdmin,
                validation: esValidation,
            },
            ru: {
                common: ruCommon,
                auth: ruAuth,
                catalog: ruCatalog,
                basket: ruBasket,
                checkout: ruCheckout,
                orders: ruOrders,
                admin: ruAdmin,
                validation: ruValidation,
            },
            ar: {
                common: arCommon,
                auth: arAuth,
                catalog: arCatalog,
                basket: arBasket,
                checkout: arCheckout,
                orders: arOrders,
                admin: arAdmin,
                validation: arValidation,
            },
        },
        lng: savedLang,
        fallbackLng: SUPPORTED_LANGUAGES[0].code,
        defaultNS: 'common',
        interpolation: {
            escapeValue: false, // React XSS koruması zaten var
        },
    });

export default i18n;
