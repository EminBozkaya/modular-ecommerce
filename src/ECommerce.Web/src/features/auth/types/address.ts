export interface UserAddress {
    id: string;
    title: string;
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

export interface AddUserAddressRequest {
    title: string;
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
}

export interface UpdateUserAddressRequest {
    title: string;
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
}

// ─── Billing Address (Fatura Adresi) ─────────────────────────────────────────

export type InvoiceType = 'individual' | 'corporate';

export interface UserBillingAddress {
    id: string;
    title: string;
    invoiceType: InvoiceType;
    fullName?: string;
    tcKimlikNo?: string;
    companyName?: string;
    taxOffice?: string;
    taxNumber?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    isActive: boolean;
}

export interface AddUserBillingAddressRequest {
    title: string;
    invoiceType: InvoiceType;
    fullName?: string;
    tcKimlikNo?: string;
    companyName?: string;
    taxOffice?: string;
    taxNumber?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
}

export interface UpdateUserBillingAddressRequest {
    title: string;
    invoiceType: InvoiceType;
    fullName?: string;
    tcKimlikNo?: string;
    companyName?: string;
    taxOffice?: string;
    taxNumber?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
}
