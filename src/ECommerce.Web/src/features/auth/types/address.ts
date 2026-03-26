export interface UserAddress {
    id: string;
    title: string;
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district?: string;
    districtName?: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    cityId?: number;
    districtId?: number;
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
    cityId?: number;
    districtId?: number;
}

export interface UpdateUserAddressRequest {
    title: string;
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
    cityId?: number;
    districtId?: number;
}

// ─── Billing Address (Fatura Adresi) ─────────────────────────────────────────

export type InvoiceType = 'individual' | 'corporate' | 'Individual' | 'Corporate' | 0 | 1;

export const resolveInvoiceType = (type: any): 'individual' | 'corporate' => {
    return type === 'Individual' || type === 'individual' || type === 0 || type === '0' ? 'individual' : 'corporate';
};

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
    cityId?: number;
    districtId?: number;
    district?: string; // fallback
    districtName?: string;
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
    cityId?: number;
    districtId?: number;
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
    cityId?: number;
    districtId?: number;
}
