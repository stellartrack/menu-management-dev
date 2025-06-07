import { useState, useEffect } from "react";

const useAuth = () => {
    
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_APP_API_MENU_BASE_URL}api/proxy/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          // If response status not ok, treat as no user
          setUser(null);
        } else {
          const data = await res.json();
          if (data.success) {
            setUser(data.data);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};

export default useAuth;
