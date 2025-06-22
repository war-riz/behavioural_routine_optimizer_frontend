// hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

// Generic hook for API calls
export const useApiCall = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return { data, loading, error, execute };
};

// Hook for prediction with explanation
export const usePrediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predict = useCallback(async (inputData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getPredictionWithExplanation(inputData);
      setPrediction(result.prediction);
      setExplanation(result.explanation);
      if (result.error) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      setError(err.message || 'Prediction failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearPrediction = useCallback(() => {
    setPrediction(null);
    setExplanation(null);
    setError(null);
  }, []);

  return {
    prediction,
    explanation,
    loading,
    error,
    predict,
    clearPrediction,
  };
};

// Hook for feedback management
export const useFeedback = () => {
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const stats = await apiService.getFeedbackStats();
      setFeedbackStats(stats);
      return stats;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitFeedback = useCallback(async (feedbackData) => {
    try {
      const result = await apiService.submitFeedback(feedbackData);
      // Refresh stats after successful submission
      await fetchStats();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    feedbackStats,
    loading,
    error,
    submitFeedback,
    refreshStats: fetchStats,
  };
};

// Hook for model status
export const useModelStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkStatus = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiService.getModelStatus();
      setStatus(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return {
    status,
    loading,
    error,
    refresh: checkStatus,
  };
};

// Hook for form data management
export const useFormData = (initialData) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Add validation rules here
    if (formData.Age < 18 || formData.Age > 80) {
      newErrors.Age = 'Age must be between 18 and 80';
    }
    
    if (formData.Sleep_Hours < 4 || formData.Sleep_Hours > 12) {
      newErrors.Sleep_Hours = 'Sleep hours must be between 4 and 12';
    }
    
    if (formData.Work_Hours < 0 || formData.Work_Hours > 16) {
      newErrors.Work_Hours = 'Work hours must be between 0 and 16';
    }

    // Add more validation rules as needed
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
  }, [initialData]);

  return {
    formData,
    errors,
    updateField,
    validateForm,
    resetForm,
    isValid: Object.keys(errors).length === 0,
  };
};