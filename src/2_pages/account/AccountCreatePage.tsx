// import { useGetDashboardQuery } from '@/5_entities/account';
// import {
//   AccountForm,
//   useAccountFormStore,
//   AccountQueueActions,
//   EditableAccountItem, // ★ 새로 만든 feature 컴포넌트 임포트
// } from '@/4_features/account-registration';

// import { useEffect, useMemo, useState } from 'react';
// import { useUserStore } from '@/5_entities/user';
// import { Grid } from '@/6_shared/ui/grid';
// import { Step } from '@/6_shared/ui/step';
// import { Alert } from '@/6_shared/ui/alert';
// import { EmptyMessage, Section } from './style';
import { AccountRegistWidget } from '@/3_widgets/accountRegist/ui/AccountRegistWidget';

export const AccountCreatePage = () => {
  return (
    <>
      <AccountRegistWidget />
    </>
  );
};
