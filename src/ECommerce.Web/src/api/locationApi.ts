import { apiClient } from './client';

export interface CityDto {
    id: number;
    countryId: number;
    name: string;
    plateCode: number;
}

export interface DistrictDto {
    id: number;
    cityId: number;
    name: string;
}

export const locationApi = {
    getCities: async (countryId: number): Promise<CityDto[]> => {
        const res = await apiClient.get<CityDto[]>(`/api/cities?countryId=${countryId}`);
        return res.data;
    },
    getDistricts: async (cityId: number): Promise<DistrictDto[]> => {
        const res = await apiClient.get<DistrictDto[]>(`/api/districts?cityId=${cityId}`);
        return res.data;
    },
};

export const TURKEY_COUNTRY_ID = 1;
export const TURKEY_NAME = 'Türkiye';
