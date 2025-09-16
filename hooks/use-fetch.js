import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      
      // Check if response has success/error structure (server actions)
      if (response && typeof response === 'object' && 'success' in response) {
        if (response.success) {
          setData(response);
          setError(null);
        } else {
          setError(new Error(response.error || 'An error occurred'));
          toast.error(response.error || 'An error occurred');
        }
      } else {
        // Handle regular responses
        setData(response);
        setError(null);
      }
    } catch (error) {
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;