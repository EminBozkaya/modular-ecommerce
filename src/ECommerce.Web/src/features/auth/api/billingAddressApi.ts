import { apiClient } from '../../../api/client';
import type { UserBillingAddress, AddUserBillingAddressRequest, UpdateUserBillingAddressRequest } from '../types/address';

const isMock = import.meta.env.VITE_USE_MOCK_API === 'true';

// ─── Mock data & implementations ──────────────────────────────────────────────

let mockBillingAddresses: UserBillingAddress[] = [
    {
        id: '1',
        title: 'Bireysel Faturam',
        invoiceType: 'individual',
        fullName: 'Demo User',
        tcKimlikNo: '12345678901',
        addressLine1: '123 Main Street, Apt 4',
        city: 'Istanbul',
        postalCode: '34000',
        country: 'Turkiye',
        isDefault: true,
        isActive: true,
    },
];

async function delay(ms = 300) {
    return new Promise((r) => setTimeout(r, ms));
}

async function mockGetBillingAddresses(): Promise<UserBillingAddress[]> {
    await delay();
    return [...mockBillingAddresses];
}

async function mockAddBillingAddress(req: AddUserBillingAddressRequest): Promise<UserBillingAddress> {
    await delay();
    if (req.isDefault) {
        mockBillingAddresses = mockBillingAddresses.map((a) => ({ ...a, isDefault: false }));
    }
    const newAddress: UserBillingAddress = {
        id: crypto.randomUUID(),
        ...req,
        isDefault: req.isDefault ?? false,
        isActive: true,
    };
    mockBillingAddresses = [newAddress, ...mockBillingAddresses];
    return newAddress;
}

async function mockUpdateBillingAddress(id: string, req: UpdateUserBillingAddressRequest): Promise<void> {
    await delay();
    mockBillingAddresses = mockBillingAddresses.map((a) =>
        a.id === id ? { ...a, ...req } : a
    );
}

async function mockDeleteBillingAddress(id: string): Promise<void> {
    await delay();
    mockBillingAddresses = mockBillingAddresses.filter((a) => a.id !== id);
}

async function mockSetDefaultBilling(id: string): Promise<void> {
    await delay();
    mockBillingAddresses = mockBillingAddresses.map((a) => ({ ...a, isDefault: a.id === id }));
}

// ─── Real API implementations ──────────────────────────────────────────────────

async function realGetBillingAddresses(): Promise<UserBillingAddress[]> {
    const res = await apiClient.get<UserBillingAddress[]>('/api/billing-addresses');
    return res.data;
}

async function realAddBillingAddress(req: AddUserBillingAddressRequest): Promise<UserBillingAddress> {
    const res = await apiClient.post<{ id: string }>('/api/billing-addresses', req);
    const all = await realGetBillingAddresses();
    return all.find((a) => a.id === res.data.id) ?? { id: res.data.id, ...req, isDefault: req.isDefault ?? false, isActive: true };
}

async function realUpdateBillingAddress(id: string, req: UpdateUserBillingAddressRequest): Promise<void> {
    await apiClient.put(`/api/billing-addresses/${id}`, req);
}

async function realDeleteBillingAddress(id: string): Promise<void> {
    await apiClient.delete(`/api/billing-addresses/${id}`);
}

async function realSetDefaultBilling(id: string): Promise<void> {
    await apiClient.patch(`/api/billing-addresses/${id}/default`);
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export const billingAddressApi = {
    getAll: isMock ? mockGetBillingAddresses : realGetBillingAddresses,
    add: isMock ? mockAddBillingAddress : realAddBillingAddress,
    update: isMock
        ? (id: string, req: UpdateUserBillingAddressRequest) => mockUpdateBillingAddress(id, req)
        : (id: string, req: UpdateUserBillingAddressRequest) => realUpdateBillingAddress(id, req),
    delete: isMock
        ? (id: string) => mockDeleteBillingAddress(id)
        : (id: string) => realDeleteBillingAddress(id),
    setDefault: isMock
        ? (id: string) => mockSetDefaultBilling(id)
        : (id: string) => realSetDefaultBilling(id),
};
