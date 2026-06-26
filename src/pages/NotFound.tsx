import { Link } from "react-router-dom";
import { Masthead } from "@/components/editorial/Masthead";

const NotFound = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Masthead />
    <div className="max-w-3xl mx-auto px-6 py-32 text-center">
      <div className="caption mb-6">Error · 404</div>
      <h1 className="font-display text-[clamp(4rem,14vw,10rem)] leading-none">Lost.</h1>
      <p className="mt-8 text-muted-foreground">The page you're looking for isn't in this issue.</p>
      <Link to="/" className="caption story-link mt-10 inline-block">← Back to cover</Link>
    </div>
  </div>
);

export default NotFound;
