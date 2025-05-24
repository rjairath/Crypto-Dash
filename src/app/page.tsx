import { CryptoContainer } from '@/components';
import ClientHeader from '@/components/ClientHeader';
import { createClient } from '@/utils/supabase/server';

const page = async () => {
    const supabase = await createClient();
    const session = await supabase.auth.getUser();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <ClientHeader session={session} />
            <CryptoContainer />
        </div>
    );
};

export default page;
