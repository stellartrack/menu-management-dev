export const logoutUser = async () => {
  try {
    const nodeLogoutResponse = await fetch(`${import.meta.env.VITE_APP_API_MENU_BASE_URL}api/proxy/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!nodeLogoutResponse.ok) {
      console.error("Node logout failed");
      return;
    }

    // Step 2: Inform other tabs using BroadcastChannel
    const bc = new BroadcastChannel("auth");
    bc.postMessage("logout");
    bc.close();



  } catch (error) {
    console.error("Logout process failed", error);
  }
};
