import { useLocation } from 'react-router-dom';

function Reports() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const variable = queryParams.get('id') || 'default-value'; // Set a default value if the query parameter is not provided

  return (
    <div>
      <h2>About Page</h2>
      <p>Variable: {variable}</p>
    </div>
  );
}

export default Reports;