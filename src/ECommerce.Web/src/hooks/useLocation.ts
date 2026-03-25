import { useQuery } from '@tanstack/react-query';
import { locationApi } from '../api/locationApi';
import { queryKeys } from '../utils/queryKeys';

export function useCities(countryId: number | null) {
    return useQuery({
        queryKey: queryKeys.location.cities(countryId ?? 0),
        queryFn: () => locationApi.getCities(countryId!),
        enabled: countryId !== null && countryId > 0,
        staleTime: 1000 * 60 * 60, // 1 hour — rarely changes
    });
}

export function useDistricts(cityId: number | null) {
    return useQuery({
        queryKey: queryKeys.location.districts(cityId ?? 0),
        queryFn: () => locationApi.getDistricts(cityId!),
        enabled: cityId !== null && cityId > 0,
        staleTime: 1000 * 60 * 60,
    });
}
