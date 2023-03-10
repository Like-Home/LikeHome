import React from 'react';
import { useParams } from 'react-router-dom';

function SearchPage() {
  const { query } = useParams();

  return (
    <div>
      <h1>search page</h1>
      <pre>query : {query}</pre>
    </div>
  );
}

export default SearchPage;
