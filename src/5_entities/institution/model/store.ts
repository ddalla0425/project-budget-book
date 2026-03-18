import { create } from 'zustand';
import type { FinancialInstitution } from '../type/select.type';

interface InstitutionStore {
  institutions: FinancialInstitution[];
  setInstitutions: (list: FinancialInstitution[]) => void;
}

export const useInstitutionStore = create<InstitutionStore>((set) => ({
  institutions: [],
  setInstitutions: (list) => set({ institutions: list }),
}));
