import { Link } from 'react-router-dom';

export default function PageHeader({ title, subtitle, backTo = '/', backLabel = 'Back to Dashboard' }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-actions">
        <Link className="btn btn-secondary" to={backTo}>{backLabel}</Link>
      </div>
    </div>
  );
}
