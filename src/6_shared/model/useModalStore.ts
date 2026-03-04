import type { ReactNode } from 'react';
import { create } from 'zustand';

export interface ModalConfig {
  title: string;
  content: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ModalState extends ModalConfig {
  isOpen: boolean;
  slides: ModalConfig[] | null;
  openModal: (config: { slides: ModalConfig[] }) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  slides: null,
  title: '',
  content: null,
  confirmText: '확인',
  cancelText: '취소',

  openModal: (config) =>
    set({
      ...config,
      isOpen: true,
    }),

  closeModal: () =>
    set({
      isOpen: false,
      title: '',
      slides: null,
      content: null,
      onConfirm: undefined,
      onCancel: undefined,
    }),
}));
