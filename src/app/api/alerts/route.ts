import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import redis from '@/lib/redisClient';
import { Alert } from '@/types';

// Define database schema type
type DbAlert = Omit<Alert, 'current_price'>;

/**
 * GET /api/alerts
 *
 * Retrieves the alerts for the authenticated user.
 * If the user is not authenticated, responds with a 401 Unauthorized status.
 * On error, responds with a 500 Internal Server Error status.
 */
export async function GET(
    req: NextRequest
): Promise<NextResponse<Alert[] | { error: string }>> {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' } as const, {
                status: 401,
            });
        }

        // Use proper typing with type annotation instead of deprecated returns()
        const { data, error } = (await supabase
            .from('alerts')
            .select('*')
            .eq('user_id', user.id)) as { data: DbAlert[] | null; error: any };

        if (error) {
            throw error;
        }

        // Ensure data is not null before processing
        if (!data) {
            return NextResponse.json([]);
        }

        // Fetch prices from Redis and attach them to alerts
        const enrichedAlerts: Alert[] = await Promise.all(
            data.map(async (alert) => {
                const redisKey = alert.asset_symbol;
                const price = await redis?.get(redisKey);
                const parsedPrice = price ? JSON.parse(price) : null;

                return {
                    ...alert,
                    current_price: parsedPrice ? parsedPrice?.price : null,
                };
            })
        );

        return NextResponse.json(enrichedAlerts);
    } catch (error) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'An unknown error occurred';
        return NextResponse.json({ error: errorMessage } as const, {
            status: 500,
        });
    }
}
