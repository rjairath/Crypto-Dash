import {
    useMutation,
    useQueryClient,
    type UseMutationOptions,
} from '@tanstack/react-query';
import type { WatchlistItem } from '@/types';
import { toast } from 'sonner';

type AddAlertMutationOptions = Omit<
    UseMutationOptions<WatchlistItem, Error, WatchlistItem>,
    'mutationFn'
>;

export const useAddAlertMutation = (options?: AddAlertMutationOptions) => {
    const queryClient = useQueryClient();

    // Extract onSuccess from options to use in our combined handler
    const { onSuccess: optionsOnSuccess, ...restOptions } = options || {};

    return useMutation({
        mutationFn: async (item: WatchlistItem) => {
            const response = await fetch('/api/add-alert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cmc_id: item.id,
                    name: item.name,
                    asset_symbol: item.symbol,
                    upper_limit: item?.alerts?.upperLimit,
                    lower_limit: item?.alerts?.lowerLimit,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add alert');
            }

            return item;
        },
        onSuccess: (item, variables, context) => {
            // Always invalidate alerts query
            queryClient.invalidateQueries({ queryKey: ['alerts'] });

            // Call the consumer's onSuccess if provided
            if (optionsOnSuccess) {
                optionsOnSuccess(item, variables, context);
            }
        },
        onError: () => {
            toast.error('Failed to add to watchlist');
        },
        ...restOptions,
    });
};
