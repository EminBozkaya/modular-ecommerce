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
