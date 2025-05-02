import React from 'react';
import Link from 'next/link';

const TrendingNow = () => {
  return (
    <div className="py-8 px-4 bg-gray-50 mt-10">
      <div className="max-w-[1340px] mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Trending Now
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Featured Skill - First Column */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold text-gray-800">ChatGPT is a top skill</h3>
              <Link
                href="/courses/chatgpt"
                className="text-[#29cc60] hover:text-[#25ad53] flex items-center text-sm font-medium mt-1"
              >
                See ChatGPT courses
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <p className="text-sm text-gray-600 mt-1">4,393,788 learners</p>
            </div>

            <Link
              href="/trending-skills"
              className="inline-block w-full text-center border border-gray-300 rounded py-2 px-4 mt-4 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span className="flex items-center justify-center">
                Show all trending skills
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Development - Second Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Development</h3>

            <div className="space-y-5">
              <div>
                <Link
                  href="/courses/python"
                  className="text-[#29cc60] hover:text-[#25ad53] flex items-center"
                >
                  Python
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <p className="text-sm text-gray-600">47,951,644 learners</p>
              </div>

              <div>
                <Link
                  href="/courses/web-development"
                  className="text-[#29cc60] hover:text-[#25ad53] flex items-center"
                >
                  Web Development
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <p className="text-sm text-gray-600">14,041,790 learners</p>
              </div>

              <div>
                <Link
                  href="/courses/data-science"
                  className="text-[#29cc60] hover:text-[#25ad53] flex items-center"
                >
                  Data Science
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <p className="text-sm text-gray-600">7,817,815 learners</p>
              </div>
            </div>
          </div>

          {/* Design - Third Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Design</h3>

            <div className="space-y-5">
              <div>
                <Link
                  href="/courses/blender"
                  className="text-[#29cc60] hover:text-[#25ad53] flex items-center"
                >
                  Blender
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <p className="text-sm text-gray-600">2,924,000 learners</p>
              </div>

              <div>
                <Link
                  href="/courses/graphic-design"
                  className="text-[#29cc60] hover:text-[#25ad53] flex items-center"
                >
                  Graphic Design
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <p className="text-sm text-gray-600">4,504,892 learners</p>
              </div>

              <div>
                <Link
                  href="/courses/ux-design"
                  className="text-[#29cc60] hover:text-[#25ad53] flex items-center"
                >
                  User Experience (UX) Design
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <p className="text-sm text-gray-600">2,074,975 learners</p>
              </div>
            </div>
          </div>

          {/* Business - Fourth Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Business</h3>

            <div className="space-y-5">
              <div>
                <Link
                  href="/courses/pmp"
                  className="text-[#29cc60] hover:text-[#25ad53] flex items-center"
                >
                  PMI Project Management Professional (PMP)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <p className="text-sm text-gray-600">2,584,638 learners</p>
              </div>

              <div>
                <Link
                  href="/courses/power-bi"
                  className="text-[#29cc60] hover:text-[#25ad53] flex items-center"
                >
                  Microsoft Power BI
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <p className="text-sm text-gray-600">4,960,687 learners</p>
              </div>

              <div>
                <Link
                  href="/courses/project-management"
                  className="text-[#29cc60] hover:text-[#25ad53] flex items-center"
                >
                  Project Management
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <p className="text-sm text-gray-600">4,005,449 learners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingNow;
