import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdmin = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (user && !userError) {
      const { data, error } = await supabase
        .from("admin")
        .select("*")
        .eq("email", user.email)
        .single();

      if (!error) setAdmin(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  return (
    <AdminContext.Provider value={{ admin, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
