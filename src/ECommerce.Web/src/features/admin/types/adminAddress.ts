export interface AdminAddress {
    id: string;
    userId: string;
    title: string;
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
    userFullName?: string;
}

export interface UpdateAddressData {
    id: string;
    title: string;
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
    isActive: boolean;
}
