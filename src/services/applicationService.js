import { supabase } from "../supabaseClient";

export const getApplications = async (studentId) => {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("student_id", studentId);
  if (error) throw error;
  return data;
};

export const createApplication = async (application) => {
  const { data, error } = await supabase
    .from("applications")
    .insert([application])
    .single();
  if (error) throw error;
  return data;
};

export const updateApplicationStatus = async (id, status) => {
  const { data, error } = await supabase
    .from("applications")
    .update({ status, updated_at: new Date() })
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};
