import { create } from "zustand";

export interface DocumentStore {
  documents: File[];
  currentPage: number;
  addDocument: (file: File[]) => void;
  removeDocument: (file: File) => void;
  clearDocuments: () => void;
  setCurrentPage: (page: number) => void;
}

const useStoreDocument = create<DocumentStore>(set => ({
  documents: [],
  currentPage: 1,
  addDocument: (file: File[]) => set({ documents: [...file], currentPage: 1 }),
  removeDocument: (file: File) =>
    set(state => ({
      documents: state.documents.filter(doc => doc !== file),
      currentPage: Math.min(state.currentPage, state.documents.length - 1) || 1,
    })),
  clearDocuments: () => set({ documents: [], currentPage: 1 }),
  setCurrentPage: (page: number) => set({ currentPage: page }),
}));

export default useStoreDocument;
