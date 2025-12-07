// src/services/authService.js
import { supabase } from '../supabaseClient';

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

  // Return false if env vars are missing or contain placeholder values
  if (!url || !key) return false;
  if (url.includes('placeholder') || key.includes('placeholder')) return false;
  if (url === 'https://placeholder.supabase.co' || key === 'placeholder-key') return false;

  return true;
};

// Mock authentication for development
const mockAuth = {
  user: null,

  signUp: async (email, password) => {
    // Store in localStorage for persistence
    const user = { id: Date.now().toString(), email, created_at: new Date().toISOString() };
    localStorage.setItem('mockUser', JSON.stringify(user));
    localStorage.setItem('mockSession', JSON.stringify({ user, access_token: 'mock-token' }));
    mockAuth.user = user;
    return { user, session: { user, access_token: 'mock-token' } };
  },

  signIn: async (email, password) => {
    // Accept any email/password for development
    const user = { id: Date.now().toString(), email, created_at: new Date().toISOString() };
    localStorage.setItem('mockUser', JSON.stringify(user));
    localStorage.setItem('mockSession', JSON.stringify({ user, access_token: 'mock-token' }));
    mockAuth.user = user;
    return { user, session: { user, access_token: 'mock-token' } };
  },

  signOut: async () => {
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockSession');
    mockAuth.user = null;
  },

  getUser: async () => {
    const storedUser = localStorage.getItem('mockUser');
    return storedUser ? JSON.parse(storedUser) : null;
  },

  getSession: async () => {
    const storedSession = localStorage.getItem('mockSession');
    return storedSession ? { session: JSON.parse(storedSession) } : { session: null };
  }
};

// --------------------
// Sign up with Email/Password
// --------------------
export const signUpWithEmail = async (email, password) => {
  if (!isSupabaseConfigured()) {
    // Use mock authentication
    const result = await mockAuth.signUp(email, password);
    return result;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

// --------------------
// Sign in with Email/Password
// --------------------
export const signInWithEmail = async (email, password) => {
  if (!isSupabaseConfigured()) {
    // Use mock authentication
    const result = await mockAuth.signIn(email, password);
    return result;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

// --------------------
// Sign in / Sign up with Google
// --------------------
export const signInWithGoogle = async () => {
  console.log('Google sign-in called, Supabase configured:', isSupabaseConfigured());

  if (!isSupabaseConfigured()) {
    console.log('Using mock Google authentication');
    // Mock Google sign-in
    const user = { id: Date.now().toString(), email: 'user@gmail.com', created_at: new Date().toISOString() };
    localStorage.setItem('mockUser', JSON.stringify(user));
    localStorage.setItem('mockSession', JSON.stringify({ user, access_token: 'mock-token' }));
    mockAuth.user = user;
    return { user, session: { user, access_token: 'mock-token' } };
  }

  console.log('Using real Supabase Google OAuth');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
};

// --------------------
// Logout
// --------------------
export const signOut = async () => {
  if (!isSupabaseConfigured()) {
    await mockAuth.signOut();
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// --------------------
// Get Current User
// --------------------
export const getCurrentUser = async () => {
  if (!isSupabaseConfigured()) {
    const user = await mockAuth.getUser();
    return { data: { user } }; // Return consistent structure
  }

  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return { data: { user: data.user } }; // Return consistent structure
};
