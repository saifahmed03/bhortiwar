// src/services/adminService.js
import { supabase } from '../supabaseClient';

// ---------------------------
// Students Management
// ---------------------------
export const getAllStudents = () => {
  return supabase.from('profiles').select('*');
};

export const deleteStudent = (studentId) => {
  return supabase.from('profiles').delete().eq('id', studentId);
};

// ---------------------------
// Universities Management
// ---------------------------
export const getAllUniversities = () => {
  return supabase.from('universities').select('*');
};

export const addUniversity = (data) => {
  return supabase.from('universities').insert(data);
};

export const updateUniversity = (id, data) => {
  return supabase.from('universities').update(data).eq('id', id);
};

export const deleteUniversity = (id) => {
  return supabase.from('universities').delete().eq('id', id);
};

// ---------------------------
// Programs Management
// ---------------------------
export const getAllPrograms = () => {
  return supabase.from('programs').select('*');
};

export const addProgram = (data) => {
  return supabase.from('programs').insert(data);
};

export const updateProgram = (id, data) => {
  return supabase.from('programs').update(data).eq('id', id);
};

export const deleteProgram = (id) => {
  return supabase.from('programs').delete().eq('id', id);
};
// ---------------------------
// Applications Management
// ---------------------------
export const getAllApplications = () => {
  return supabase.from('applications').select('*, essays(*)');
};

export const updateApplicationStatus = (id, status) => {
  return supabase.from('applications').update({ status }).eq('id', id);
};
