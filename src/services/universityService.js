import { supabase } from "../supabaseClient";

export const getUniversities = async () => {
  const { data, error } = await supabase
    .from("universities")
    .select("*");
  if (error) throw error;
  return data;
};

export const getProgramsByUniversity = async (universityId) => {
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("university_id", universityId);
  if (error) throw error;
  return data;
};

export const getAllPrograms = async () => {
  const { data, error } = await supabase
    .from("programs")
    .select("*");
  if (error) throw error;
  return data;
};
