/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, useTheme } from '@keystone-ui/core';

// import {
//   getItemPage,
//   ItemPageHooksProps,
// } from '@keystone-next/keystone/___internal-do-not-use-will-break-in-patch/admin-ui/pages/ItemPage';

import { Fragment } from 'react';
import { useList } from '@keystone-6/core/admin-ui/context';

export function ItemPageSidebar({ listKey, item }: any) {
  const { spacing } = useTheme();
  return (
    <Fragment>
      <div
        css={{
          marginTop: spacing.large,
        }}
      >
        <div>{listKey}</div>
        <div>{item?.id}</div>
        <div>{item?.author?.label}</div>
      </div>
    </Fragment>
  );
}
export function ItemPageHeader({ listKey, item }: any) {
  const list = useList(listKey);
  return (
    <div>
      {listKey} {`>`} {item?.[list.labelField] || item?.id}
    </div>
  );
}
