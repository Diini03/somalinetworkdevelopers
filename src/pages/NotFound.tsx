import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
    <div className="text-center">
      <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Error 404</div>
      <h1 className="text-5xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
      >
        Back to candidates
      </Link>
    </div>
  </div>
);

export default NotFound;
