'use server';

import { createClient } from '@/utils/supabase/server';
import { Provider } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

const signInWith = (provider: Provider) => async () => {
    const supabase = await createClient();

    const auth_callback_url = `${process.env.SITE_URL}/api/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: auth_callback_url,
        },
    });

    if (error) {
        console.log(error);
    }

    if (data?.url) {
        redirect(data?.url);
    }
};

const signinWithGoogle = signInWith('google');
const signinWithGithub = signInWith('github');

const signOut = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
};

export { signinWithGoogle, signinWithGithub, signOut };
