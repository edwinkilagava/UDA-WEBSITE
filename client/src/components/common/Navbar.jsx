
import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/Auth.Context.jsx";
import logo from "../../assets/logo.png";

const navigationLinks = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "About Us",
    path: "/about",
    dropdown: [
      {
        label: "History and Values",
        path: "/about/history-and-values",
      },
      {
        label: "Our Team",
        path: "/about/our-team",
      },
      {
        label: "Our Locations",
        path: "/about/our-locations",
      },
    ],
  },
  {
    label: "Events",
    path: "/events",
  },
  {
    label: "News",
    path: "/news",
  },
  {
    label: "Resource Center",
    path: "/resources",
  },
  {
    label: "Contact",
    path: "/contact",
  },
  {
    label: "Grassroots Elections",
    path: "/grassroots-elections",
  },
];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const accountMenuRef = useRef(null);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setMobileAboutOpen(false);
    setAccountMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenus();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        closeMenus();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const accountName =
    user?.fullName || user?.name || user?.email || "My Account";

  const linkClass = ({ isActive }) =>
    `relative block text-sm font-medium transition-colors ${
      isActive
        ? "text-green-700"
        : "text-gray-700 hover:text-green-700"
    }`;

  const accountActions = (
    <>
      {!loading &&
        (user ? (
          <div className="relative" ref={accountMenuRef}>
            <button
              type="button"
              onClick={() => {
                setAccountMenuOpen((open) => !open);
                setMobileAboutOpen(false);
              }}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-green-700 lg:w-auto"
              aria-expanded={accountMenuOpen}
              aria-haspopup="true"
            >
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 21a8 8 0 0 0-16 0"
                  />
                  <circle cx="12" cy="8" r="4" />
                </svg>

                <span>My Account</span>
              </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${
                  accountMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6 9 6 6 6-6"
                />
              </svg>
            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 top-full z-[70] mt-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {accountName}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Signed in
                  </p>
                </div>

                <NavLink
                  to="/profile"
                  onClick={closeMenus}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-green-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 21a8 8 0 0 0-16 0"
                    />
                  </svg>
                  My Profile
                </NavLink>

                {user.role === "admin" && (
                  <NavLink
                    to="/admin/dashboard"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-green-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                      />
                      <rect
                        x="14"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                      />
                      <rect
                        x="14"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                      />
                      <rect
                        x="3"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                      />
                    </svg>
                    Admin Dashboard
                  </NavLink>
                )}

                <div className="my-1 border-t border-gray-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 17l5-5-5-5m5 5H3"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${linkClass({ isActive })} rounded-lg px-3 py-3 lg:py-2`
            }
            onClick={closeMenus}
          >
            Sign In
          </NavLink>
        ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <nav
        className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:gap-5 lg:px-8"
        aria-label="Main navigation"
      >
        {/* UDA logo */}
        <NavLink
          to="/"
          className="flex min-w-0 shrink-0 items-center"
          onClick={closeMenus}
          aria-label="UDA Home"
        >
          <img
            src={logo}
            alt="UDA"
            className="h-10 w-auto max-w-[150px] object-contain sm:h-12"
          />
        </NavLink>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-4 lg:flex xl:gap-6">
          {navigationLinks.map((link) => (
            <li key={link.path} className="group relative">
              <NavLink
                to={link.path}
                className={linkClass}
                onClick={closeMenus}
              >
                {link.label}
              </NavLink>

              {link.dropdown && (
                <div className="invisible absolute left-0 top-full z-[60] w-56 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                    {link.dropdown.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={closeMenus}
                        className={({ isActive }) =>
                          `block px-5 py-3 text-sm transition-colors ${
                            isActive
                              ? "bg-green-50 font-medium text-green-700"
                              : "text-gray-700 hover:bg-gray-50 hover:text-green-700"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop account actions */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          {accountActions}

          <NavLink
            to="/grassroots"
            className="whitespace-nowrap rounded-md bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800"
            onClick={closeMenus}
          >
            Grassroots
          </NavLink>
        </div>

        {/* Mobile hamburger button */}
        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-800 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 lg:hidden"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="mobile-navigation"
          aria-expanded={mobileMenuOpen}
          onClick={() => {
            setMobileMenuOpen((open) => !open);
            setMobileAboutOpen(false);
            setAccountMenuOpen(false);
          }}
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile navigation panel */}
      <div
        id="mobile-navigation"
        className={`absolute left-0 right-0 top-full z-50 border-t border-gray-200 bg-white shadow-xl lg:hidden ${
          mobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="max-h-[calc(100dvh-80px)] overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          <ul className="flex flex-col gap-4">
            {navigationLinks.map((link) => (
              <li key={link.path}>
                {link.dropdown ? (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <NavLink
                        to={link.path}
                        onClick={closeMenus}
                        className={({ isActive }) =>
                          `block flex-1 py-2 text-sm font-medium ${
                            isActive
                              ? "text-green-700"
                              : "text-gray-800 hover:text-green-700"
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>

                      <button
                        type="button"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700"
                        onClick={() =>
                          setMobileAboutOpen((open) => !open)
                        }
                        aria-label="Toggle About Us submenu"
                        aria-expanded={mobileAboutOpen}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 transition-transform ${
                            mobileAboutOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m6 9 6 6 6-6"
                          />
                        </svg>
                      </button>
                    </div>

                    {mobileAboutOpen && (
                      <div className="ml-3 mt-2 flex flex-col gap-1 border-l-2 border-green-100 pl-4">
                        {link.dropdown.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={closeMenus}
                            className={({ isActive }) =>
                              `block rounded-md px-3 py-3 text-sm transition-colors ${
                                isActive
                                  ? "bg-green-50 font-semibold text-green-700"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
                              }`
                            }
                          >
                            {item.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={link.path}
                    onClick={closeMenus}
                    className={({ isActive }) =>
                      `block py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "text-green-700"
                          : "text-gray-800 hover:text-green-700"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}

            <li className="border-t border-gray-100 pt-3">
              {accountActions}
            </li>

            <li>
              <NavLink
                to="/grassroots"
                onClick={closeMenus}
                className="block rounded-lg bg-green-700 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-green-800"
              >
                Grassroots
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
