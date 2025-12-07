import { supabase } from "../supabaseClient";

// ---------------------------
// PROFILE
// ---------------------------
export async function getProfile(userId) {
  return await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
}

export async function updateProfile(userId, data) {
  return await supabase
    .from("profiles")
    .upsert({ id: userId, ...data });
}

export async function uploadAvatar(userId, file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

  // Upload to storage bucket 'avatars'
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, { upsert: true });

  if (uploadError) return { error: uploadError };

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  const publicUrl = urlData.publicUrl;

  // Update the profile with the new avatar URL
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", userId);

  if (updateError) return { error: updateError };

  return { data: { avatar_url: publicUrl }, error: null };
}

// ---------------------------
// ACADEMIC RECORDS (CRUD)
// ---------------------------
export async function getAcademicRecords(userId) {
  return await supabase
    .from("academic_records")
    .select("*")
    .eq("student_id", userId);
}

export async function addAcademicRecord(data) {
  return await supabase.from("academic_records").insert(data);
}

export async function updateAcademicRecord(id, data) {
  return await supabase
    .from("academic_records")
    .update(data)
    .eq("id", id);
}

export async function deleteAcademicRecord(id) {
  return await supabase
    .from("academic_records")
    .delete()
    .eq("id", id);
}

// ---------------------------
// DOCUMENTS (Upload / Get / Delete)
// ---------------------------
export async function uploadDocument(userId, file, docType = 'other') {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${docType}-${Date.now()}.${fileExt}`;

  // Upload to storage bucket
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(fileName, file);

  if (uploadError) return { error: uploadError };

  // Save reference in DB
  return await supabase.from("documents").insert({
    student_id: userId,
    file_url: fileName,
    type: file.type,
    document_type: docType
  });
}

export async function getDocuments(userId) {
  return await supabase
    .from("documents")
    .select("*")
    .eq("student_id", userId);
}

export async function deleteDocument(id) {
  return await supabase
    .from("documents")
    .delete()
    .eq("id", id);
}

// ---------------------------
// APPLICATIONS (CRUD)
// ---------------------------
export async function getApplications(userId) {
  // Try to fetch with relations first, but if it fails, we might need a simpler query
  // For now, let's use a simpler query that definitely works with the base table
  return await supabase
    .from("applications")
    .select("*")
    .eq("student_id", userId);
}

export async function createApplication(data) {
  return await supabase.from("applications").insert(data);
}

export async function updateApplication(id, data) {
  return await supabase
    .from("applications")
    .update(data)
    .eq("id", id);
}

export async function deleteApplication(id) {
  return await supabase
    .from("applications")
    .delete()
    .eq("id", id);
}

// ---------------------------
// ESSAYS (CRUD)
// ---------------------------
export async function getEssays(applicationId) {
  return await supabase
    .from("essays")
    .select("*")
    .eq("application_id", applicationId);
}

export async function addEssay(data) {
  return await supabase.from("essays").insert(data);
}

export async function updateEssay(id, data) {
  return await supabase
    .from("essays")
    .update(data)
    .eq("id", id);
}

export async function deleteEssay(id) {
  return await supabase
    .from("essays")
    .delete()
    .eq("id", id);
}
