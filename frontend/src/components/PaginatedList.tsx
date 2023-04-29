import React from 'react';
import { Stack, Divider, List } from '@mui/material';

import Pagination from '@mui/material/Pagination';
import { PaginationResponse } from '../api/types';
import * as fetch from '../api/fetch';

type PaginatedListItemWithId = {
  id: number;
  code?: string;
};

type PaginatedListItemWithCode = {
  code: string;
  id?: number;
};

export default function PaginatedList<T extends PaginatedListItemWithId | PaginatedListItemWithCode>({
  response,
  placeholder,
  listItemComponent,
}: {
  response: PaginationResponse<T>;
  placeholder: React.ReactNode;
  listItemComponent: React.FC<{ item: T }>;
}) {
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState<Record<number, PaginationResponse<T>>>({
    1: response,
  });

  const handleChange = async (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (pages[newPage] === undefined) {
      const newPageLink = response.links.generic.replace('PAGE_NUMBER', `${newPage}`);
      const newPageResponse = await fetch.get<PaginationResponse<T>>(newPageLink);
      setPages({
        ...pages,
        [newPage]: newPageResponse,
      });
    }
    setPage(newPage);
  };

  return (
    <>
      {response.total > 0 ? (
        <Stack alignItems={'center'} spacing={2}>
          {response.page_total > 1 && (
            <Pagination page={page} count={response.page_total} color="primary" onChange={handleChange} />
          )}
          <List sx={{ width: '100%' }}>
            {pages[page].results.map((item, index) => (
              <>
                {React.createElement(listItemComponent, {
                  key: item.id || item.code,
                  item,
                })}
                {index + 1 !== response.results.length && <Divider variant="inset" component="li" />}
              </>
            ))}
          </List>
          {response.page_total > 1 && (
            <Pagination page={page} count={response.page_total} color="primary" onChange={handleChange} />
          )}
        </Stack>
      ) : (
        placeholder
      )}
    </>
  );
}
