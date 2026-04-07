import type { AccountSaveType } from '@/5_entities/account';
import { GiftCardField } from './GiftCardField';
import { PointField } from './PointField';

interface Props {
  accounts: AccountSaveType;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetailChange: (field: string, value: string | number | boolean | null) => void;
  onAddDetail: () => void;
  onRemoveDetail: (index: number) => void;
  bankAccounts: { id: string; name: string; current_balance?: number }[];
}
export const VoucherField = ({ accounts, onChange, onDetailChange, onAddDetail, onRemoveDetail }: Props) => {
  const isGiftCard = accounts.type === 'GIFT_CARD';
  const isPoint = accounts.type === 'POINT';

  return (
    <>
      {isGiftCard && (
        <GiftCardField
          accounts={accounts}
          onChange={onChange}
          onDetailChange={onDetailChange}
          onAddDetail={onAddDetail}
          onRemoveDetail={onRemoveDetail}
        />
      )}
      {isPoint && <PointField accounts={accounts} onChange={onChange} onDetailChange={onDetailChange} />}
    </>
  );
};
