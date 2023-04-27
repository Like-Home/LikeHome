import Spinner from '../Spinner';
import './styles.scss';

function AppLoadingSpinner() {
  return (
    <div className="app-loading-spinner card-root">
      <h2>LikeHome</h2>
      <Spinner />
    </div>
  );
}

export default AppLoadingSpinner;
