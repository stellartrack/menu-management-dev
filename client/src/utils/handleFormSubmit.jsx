import { toast } from "react-toastify";

export const handleFormSubmit = async ({
  requestFn,
  onSuccess,
  onError,
  setSubmitting,
}) => {
  toast.dismiss();
  if (setSubmitting) {
    setSubmitting(true);
  }

  try {
    const response = await requestFn();
    
    // --- THIS IS THE SIMPLIFIED SUCCESS CHECK ---
    // We only check for the top-level 'success: true' flag from the API response.
    if (response.data.success) {
      const successMsg =
        response.data.message ||
        response.data.data?.message ||
        "Operation completed successfully!";

      toast.success(successMsg);
      
      // If an onSuccess callback was provided, run it.
      if (onSuccess) {
        onSuccess(response.data.data); // This will now be called correctly.
      }
    } else {
      // This handles cases where the API returns { success: false, message: "..." }
      const errorMsg =
        response.data.message || "An unknown error occurred.";
      
      if (onError) {
        onError({ message: errorMsg });
      } else {
        toast.error(errorMsg);
      }
    }
  } catch (error) {
    // This handles network errors or server crashes (500 errors).
    if (onError) {
      onError(error);
    } else {
      toast.error("A network error occurred. Please try again.");
    }
  } finally {
    // This always runs, ensuring the button is re-enabled.
    if (setSubmitting) {
      setSubmitting(false);
    }
  }
};