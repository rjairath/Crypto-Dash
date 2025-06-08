import {
    useMutation,
    useQueryClient,
    type UseMutationOptions,
} from '@tanstack/react-query';
import type { Alert } from '@/types';
import { toast } from 'sonner';

type RemoveAlertMutationOptions = Omit<
    UseMutationOptions<Alert, Error, Alert>,
    'mutationFn'
>;

export const useRemoveAlertMutation = (
    options?: RemoveAlertMutationOptions
) => {
    const queryClient = useQueryClient();

    // Extract onSuccess from options to use in our combined handler
    const { onSuccess: optionsOnSuccess, ...restOptions } = options || {};

    return useMutation({
        mutationFn: async (alert: Alert) => {
            const response = await fetch(
                `/api/remove-alert?alert_id=${alert.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to remove alert');
            }

            return alert;
        },
        onSuccess: (alert, variables, context) => {
            // Always invalidate alerts query
            queryClient.invalidateQueries({ queryKey: ['alerts'] });

            // Call the consumer's onSuccess if provided
            if (optionsOnSuccess) {
                optionsOnSuccess(alert, variables, context);
            }
        },
        onError: () => {
            toast.error('Failed to remove from watchlist');
        },
        // Spread the rest of the options, excluding onSuccess which we handled above
        ...restOptions,
    });
};
