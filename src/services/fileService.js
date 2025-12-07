// src/services/fileService.js
import { supabase } from '../supabaseClient';

export const uploadDocument = async (userId, file) => {
  const fileName = `${userId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(fileName, file);

  if (uploadError) return { error: uploadError };

  // save reference in DB
  return supabase.from('documents').insert({
    student_id: userId,
    file_name: fileName,
    file_type: file.type,
  });
};

export const downloadDocument = (fileName) => {
  return supabase.storage.from('documents').getPublicUrl(fileName);
};
