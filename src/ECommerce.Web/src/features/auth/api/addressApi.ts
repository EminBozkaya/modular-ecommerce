import { apiClient } from '../../../api/client';
import type { UserAddress, AddUserAddressRequest, UpdateUserAddressRequest } from '../types/address';

const isMock = import.meta.env.VITE_USE_MOCK_API === 'true';

// ─── Mock data & implementations ──────────────────────────────────────────────

let mockAddresses: UserAddress[] = [
    {
        id: '1',
        title: 'Ev Adresim',
        fullName: 'Emin Bozkaya',
        addressLine1: 'Atatürk Caddesi No: 42, Kat: 5 Daire: 12',
        city: 'İstanbul',
        postalCode: '34353',
        country: 'Türkiye',
        isDefault: true,
    },
    {
        id: '2',
        title: 'İş Adresim',
        fullName: 'Emin Bozkaya',
        addressLine1: 'Plaza Center No: 102, Ofis: 45',
        city: 'İstanbul',
        postalCode: '34394',
        country: 'Türkiye',
        isDefault: false,
    },
];

async function delay(ms = 300) {
    return new Promise((r) => setTimeout(r, ms));
}

async function mockGetAddresses(): Promise<UserAddress[]> {
    await delay();
    return [...mockAddresses];
}

async function mockAddAddress(req: AddUserAddressRequest): Promise<UserAddress> {
    await delay();
    if (req.isDefault) {
        mockAddresses = mockAddresses.map((a) => ({ ...a, isDefault: false }));
    }
    const newAddress: UserAddress = {
        id: crypto.randomUUID(),
        title: req.title,
        fullName: req.fullName,
        addressLine1: req.addressLine1,
        addressLine2: req.addressLine2,
        city: req.city,
        postalCode: req.postalCode,
        country: req.country,
        isDefault: req.isDefault ?? false,
    };
    mockAddresses = [newAddress, ...mockAddresses];
    return newAddress;
}

async function mockUpdateAddress(id: string, req: UpdateUserAddressRequest): Promise<void> {
    await delay();
    mockAddresses = mockAddresses.map((a) =>
        a.id === id ? { ...a, ...req } : a
    );
}

async function mockDeleteAddress(id: string): Promise<void> {
    await delay();
    mockAddresses = mockAddresses.filter((a) => a.id !== id);
}

async function mockSetDefault(id: string): Promise<void> {
    await delay();
    mockAddresses = mockAddresses.map((a) => ({ ...a, isDefault: a.id === id }));
}

// ─── Real API implementations ──────────────────────────────────────────────────

async function realGetAddresses(): Promise<UserAddress[]> {
    const res = await apiClient.get<UserAddress[]>('/api/addresses');
    return res.data;
}

async function realAddAddress(req: AddUserAddressRequest): Promise<UserAddress> {
    const res = await apiClient.post<{ id: string }>('/api/addresses', req);
    // Return full object by re-fetching — API only returns id on creation
    const all = await realGetAddresses();
    return all.find((a) => a.id === res.data.id) ?? { id: res.data.id, ...req, isDefault: req.isDefault ?? false };
}

async function realUpdateAddress(id: string, req: UpdateUserAddressRequest): Promise<void> {
    await apiClient.put(`/api/addresses/${id}`, req);
}

async function realDeleteAddress(id: string): Promise<void> {
    await apiClient.delete(`/api/addresses/${id}`);
}

async function realSetDefault(id: string): Promise<void> {
    await apiClient.patch(`/api/addresses/${id}/default`);
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export const addressApi = {
    getAll: isMock ? mockGetAddresses : realGetAddresses,
    add: isMock ? mockAddAddress : realAddAddress,
    update: isMock
        ? (id: string, req: UpdateUserAddressRequest) => mockUpdateAddress(id, req)
        : (id: string, req: UpdateUserAddressRequest) => realUpdateAddress(id, req),
    delete: isMock
        ? (id: string) => mockDeleteAddress(id)
        : (id: string) => realDeleteAddress(id),
    setDefault: isMock
        ? (id: string) => mockSetDefault(id)
        : (id: string) => realSetDefault(id),
};
