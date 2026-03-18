import type { AccountSaveType } from '@/5_entities/account';
import { CheckCardField } from './CheckCardField';
import { CreditCardField } from './CreditCardField';

interface Props {
  accounts: AccountSaveType;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetailChange: (field: string, value: string | number | boolean) => void;
  bankAccounts: { id: string; name: string; current_balance?: number }[];
}
export const CardField = ({ accounts, onChange, onDetailChange, bankAccounts }: Props) => {
  const isCheck = accounts.type === 'CHECK_CARD';
  const isCredit = accounts.type === 'CREDIT_CARD';

  return (
    <>
      {isCredit && (
        <CreditCardField
          accounts={accounts}
          onChange={onChange}
          onDetailChange={onDetailChange}
          bankAccounts={bankAccounts}
        />
      )}
      {isCheck && (
        <CheckCardField
          accounts={accounts}
          onChange={onChange}
          onDetailChange={onDetailChange}
          bankAccounts={bankAccounts}
        />
      )}
    </>
  );
};
