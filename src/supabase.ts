
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Configuration keys in localStorage
export const STORAGE_KEY_URL = 'supabase_project_url';
export const STORAGE_KEY_KEY = 'supabase_anon_key';

let supabase: SupabaseClient | null = null;
let currentUser: User | null = null; // Caching currentUser to avoid async calls everywhere

export function initSupabase(): boolean {
    const url = localStorage.getItem(STORAGE_KEY_URL);
    const key = localStorage.getItem(STORAGE_KEY_KEY);

    if (url && key) {
        try {
            supabase = createClient(url, key);
            return true;
        } catch (e) {
            console.error('Invalid Supabase Configuration', e);
            return false;
        }
    }
    return false;
}

export function getSupabase() {
    return supabase;
}

export function isHelperConnected() {
    return !!supabase;
}

// Add a callback type
type AuthChangeCallback = (user: User | null) => void;

export function subscribeToAuthChanges(callback: AuthChangeCallback) {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        currentUser = session?.user || null;
        callback(currentUser);
    });
    return data.subscription;
}

export async function checkSession(): Promise<User | null> {
    if (!supabase) return null;
    try {
        const { data } = await supabase.auth.getSession();
        currentUser = data.session?.user || null;
        return currentUser;
    } catch {
        return null;
    }
}

export function getCurrentUser() {
    return currentUser;
}

// --- Auth ---

export async function login(email: string, password: string) {
    if (!supabase) throw new Error('Not connected to Supabase');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    currentUser = data.user;
    return data;
}

export async function signUp(email: string, password: string) {
    if (!supabase) throw new Error('Not connected to Supabase');
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: window.location.origin
        }
    });
    if (error) throw error;
    // Critical fix: If confirm email is on, session will be null.
    // We should not set currentUser if there is no session, or UI will think we are logged in.
    if (data.session) {
        currentUser = data.user;
    }
    return data;
}

export async function logout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    currentUser = null;
}

// --- Data Sync ---

export interface RemoteFood {
    id: number;
    name: string;
    energy: number;
    unit: string;
    created_at?: string;
}

export async function fetchRemoteFoods(): Promise<RemoteFood[]> {
    if (!supabase || !currentUser) return [];

    const { data, error } = await supabase
        .from('saved_foods')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50); // Limit to 50 items

    if (error) {
        console.error('Error fetching foods:', error);
        throw error;
    }

    // Convert numeric string to number if needed (Postgres numeric comes as string sometimes)
    return data.map((item: any) => ({
        ...item,
        energy: Number(item.energy)
    }));
}

export async function addRemoteFood(food: RemoteFood) {
    if (!supabase || !currentUser) return;

    const { error } = await supabase
        .from('saved_foods')
        .insert({
            id: food.id,
            user_id: currentUser.id,
            name: food.name,
            energy: food.energy,
            unit: food.unit
        });

    if (error) console.error('Error adding remote food:', error);
}

export async function deleteRemoteFood(id: number) {
    if (!supabase || !currentUser) return;

    const { error } = await supabase
        .from('saved_foods')
        .delete()
        .eq('id', id);

    if (error) console.error('Error deleting remote food:', error);
}

// Helper to fully overwrite remote with local (Use with caution - for initial sync maybe?)
// For now, we are doing a "Merge" strategy where we prioritize remote but keep local if unique.
// Actually, simple strategy: Cloud is source of truth.
