import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const ContractContext = createContext(null);

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [filters, setFiltersState] = useState({
    search: '',
    risk: 'All',
    type: 'All',
    status: 'All',
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setFilter = useCallback((newFilters) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const fetchContracts = useCallback(async (customParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search: customParams.search !== undefined ? customParams.search : filters.search,
        risk: customParams.risk !== undefined ? customParams.risk : filters.risk,
        type: customParams.type !== undefined ? customParams.type : filters.type,
        status: customParams.status !== undefined ? customParams.status : filters.status,
        ...customParams,
      };
      const res = await api.get('/contracts', { params });
      setContracts(res.data.data || []);
      setLoading(false);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch contracts');
      setLoading(false);
      return [];
    }
  }, [filters]);

  const getContractById = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await api.get(`/contracts/${id}`);
      const contract = res.data.data.contract;
      setSelectedContract(contract);
      setLoading(false);
      return contract;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load contract');
      setLoading(false);
      return null;
    }
  }, []);

  const uploadContract = async (formData, onProgress) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    try {
      const res = await api.post('/contracts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / (e.total || 1));
          setUploadProgress(percent);
          if (onProgress) onProgress(percent);
        },
      });
      const newContract = res.data.data.contract;
      setContracts((prev) => [newContract, ...prev]);
      setSelectedContract(newContract);
      setIsUploading(false);
      setUploadProgress(100);
      return { success: true, contract: newContract };
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed';
      setError(msg);
      setIsUploading(false);
      setUploadProgress(0);
      return { success: false, error: msg };
    }
  };

  const deleteContract = async (id) => {
    try {
      await api.delete(`/contracts/${id}`);
      setContracts((prev) => prev.filter((c) => c._id !== id));
      if (selectedContract?._id === id) {
        setSelectedContract(null);
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contract');
      return false;
    }
  };

  const renameContract = async (id, title) => {
    try {
      const res = await api.put(`/contracts/${id}`, { title });
      const updated = res.data.data.contract;
      setContracts((prev) => prev.map((c) => (c._id === id ? updated : c)));
      if (selectedContract?._id === id) {
        setSelectedContract(updated);
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update contract');
      return false;
    }
  };

  return (
    <ContractContext.Provider
      value={{
        contracts,
        selectedContract,
        filters,
        setFilter,
        uploadProgress,
        isUploading,
        loading,
        error,
        fetchContracts,
        getContractById,
        uploadContract,
        deleteContract,
        renameContract,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContracts = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContracts must be used within a ContractProvider');
  }
  return context;
};
