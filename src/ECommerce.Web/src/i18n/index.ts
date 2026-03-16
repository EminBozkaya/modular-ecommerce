import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
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

i18n
    .use(LanguageDetector)
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
        },
        lng: localStorage.getItem('language') ?? SUPPORTED_LANGUAGES[0].code,
        fallbackLng: SUPPORTED_LANGUAGES[0].code,
        defaultNS: 'common',
        interpolation: {
            escapeValue: false, // React XSS koruması zaten var
        },
        detection: {
            order: ['localStorage'],
            caches: ['localStorage'],
            lookupLocalStorage: 'language',
        },
    });

export default i18n;
