import { useParams } from 'react-router-dom';

export default function SearchPage() {
  const { query } = useParams();

  return (
    <div>
      <h1>search page</h1>
      <pre>query : {query}</pre>
    </div>
  );
}
