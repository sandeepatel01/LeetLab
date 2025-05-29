import {
  Home,
  ChevronRight,
  Clock,
  Users,
  ThumbsUp,
  Bookmark,
  Share2,
} from "lucide-react";
import { Link } from "react-router-dom";

const ProblemNavbar = ({
  title,
  createdAt,
  submissionCount,
  isBookmarked,
  toggleBookmark,
  selectedLanguage,
  handleLanguageChange,
  codeSnippets = {},
}) => {
  return (
    <nav className="navbar bg-base-100 shadow-lg px-4">
      <div className="flex-1 gap-2">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Home className="w-6 h-6" />
          <ChevronRight className="w-4 h-4" />
        </Link>
        <div className="mt-2">
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="flex items-center gap-2 text-sm text-base-content/70 mt-5">
            <Clock className="w-4 h-4" />
            <span>
              Updated{" "}
              {new Date(createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="text-base-content/30">•</span>
            <Users className="w-4 h-4" />
            <span>{submissionCount} Submissions</span>
            <span className="text-base-content/30">•</span>
            <ThumbsUp className="w-4 h-4" />
            <span>95% Success Rate</span>
          </div>
        </div>
      </div>

      <div className="flex-none gap-4">
        <button
          className={`btn btn-ghost btn-circle ${
            isBookmarked ? "text-primary" : ""
          }`}
          onClick={toggleBookmark}
        >
          <Bookmark className="w-5 h-5" />
        </button>
        <button className="btn btn-ghost btn-circle">
          <Share2 className="w-5 h-5" />
        </button>
        <select
          className="select select-bordered select-primary w-40"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          {Object.keys(codeSnippets).map((lang) => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
};

export default ProblemNavbar;
