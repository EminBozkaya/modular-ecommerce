import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../utils/queryKeys';
import { getUsers } from '../api/adminApi';

export function useAdminUsers() {
    return useQuery({
        queryKey: queryKeys.admin.users.all,
        queryFn: getUsers,
        staleTime: 2 * 60_000,
    });
}
