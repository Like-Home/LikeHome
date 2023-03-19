import Spinner from '../Spinner';
import './styles.scss';

function AppLoadingSpinner() {
  return (
    <div className="app-loading-spinner">
      <h2>LikeHome</h2>
      <Spinner />
    </div>
  );
}

export default AppLoadingSpinner;
