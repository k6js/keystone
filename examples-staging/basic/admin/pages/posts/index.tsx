/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Stack, useTheme } from '@keystone-ui/core';

import {
  getListPage,
  ListPageHooksProp,
} from '@keystone-next/keystone/___internal-do-not-use-will-break-in-patch/admin-ui/pages/ListPage';
import { useList } from '@keystone-next/keystone/admin-ui/context';
import { Button } from '@keystone-ui/button';
import { Fragment } from 'react';

const hooks: ListPageHooksProp = {
  ListPageHeader({ listKey }) {
    const list = useList(listKey);
    return (
      <div>
        Some value {listKey} - {list.labelField}
      </div>
    );
  },
  ListPrimaryActions({ listKey, refetch }) {
    return (
      <Stack across gap="small" align="start">
        <Button tone="active" size="small" weight="light">
          Test
        </Button>
        <Button tone="help" size="small" weight="light">
          Test
        </Button>
        <Button tone="negative" size="small" weight="none">
          Test
        </Button>
        <Button tone="passive" size="small" weight="link">
          Test
        </Button>
        <Button tone="positive" size="small" isLoading weight="bold">
          Test
        </Button>
        <Button tone="warning" size="small" isLoading weight="light">
          Test
        </Button>
      </Stack>
    );
  },
  ListSelectionActions({ listKey, refetch }) {
    return (
      <Stack across gap="small" align="start">
        <Button tone="active" size="small" weight="bold">
          Test
        </Button>
        <Button tone="help" size="small" weight="bold">
          Test
        </Button>
        <Button tone="negative" size="small" weight="bold">
          Test
        </Button>
        <Button tone="passive" size="small" weight="bold">
          Test
        </Button>
        <Button tone="positive" size="small" weight="bold">
          Test
        </Button>
        <Button tone="warning" size="small" weight="bold">
          Test
        </Button>
      </Stack>
    );
  },
};

export default getListPage({ listKey: 'Post', hooks });
