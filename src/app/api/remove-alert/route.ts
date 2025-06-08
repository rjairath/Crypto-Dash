// app/api/remove-alert/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function DELETE(req: NextRequest) {
    try {
        const supabase = await createClient();
        // Get alert_id from URL search params
        const { searchParams } = new URL(req.url);
        const alert_id = searchParams.get('alert_id');

        if (!alert_id) {
            return NextResponse.json(
                { error: 'Missing alert_id parameter' },
                { status: 400 }
            );
        }

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Delete the alert and ensure it belongs to the current user
        const { data, error } = await supabase
            .from('alerts')
            .delete()
            .eq('id', alert_id)
            .eq('user_id', user.id) // Security check - only delete user's own alerts
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // If no rows were affected, the alert might not exist or doesn't belong to the user
        if (!data || data.length === 0) {
            return NextResponse.json(
                { error: 'Alert not found or access denied' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Alert removed successfully',
            data,
        });
    } catch (error) {
        console.log('Error removing alert:', error);
        return NextResponse.json(
            {
                error: 'An unknown error occurred',
            },
            { status: 500 }
        );
    }
}
