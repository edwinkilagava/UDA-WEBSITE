import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

import logo from "../../assets/logo.png";

function Footer() {
  return (
    <footer className="bg-[#f7c821]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-3">

        {/* Logo */}
        <div className="flex items-start justify-center md:justify-start">
          <Link to="/" aria-label="UDA home">
            <img
              src={logo}
              alt="UDA"
              className="h-32 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-semibold text-white">
            Contact
          </h2>

          <div className="mt-4 h-0.5 w-10 bg-white" />

          <div className="mt-5 space-y-4 text-sm text-white">
            <p className="flex items-center gap-3">
              <Phone
                size={18}
                aria-hidden="true"
              />
              <a
                href="tel:0202020405"
                className="transition-opacity hover:opacity-70"
              >
                020 2020405
              </a>
            </p>

            <p className="flex items-center gap-3">
              <Mail
                size={18}
                aria-hidden="true"
              />
              <a
                href="mailto:hello@uda.ke"
                className="transition-opacity hover:opacity-70"
              >
                hello@uda.ke
              </a>
            </p>

            <p className="flex items-start gap-3">
              <MapPin
                size={18}
                aria-hidden="true"
                className="mt-0.5 shrink-0"
              />
              <span>
                Hustler Plaza, Ngong Road, Nairobi
              </span>
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h2 className="text-xl font-semibold text-white">
            Navigation
          </h2>

          <div className="mt-4 h-0.5 w-10 bg-white" />

          <nav
            className="mt-5"
            aria-label="Footer navigation"
          >
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-white transition-opacity hover:opacity-70"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="text-sm text-white transition-opacity hover:opacity-70"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/events"
                  className="text-sm text-white transition-opacity hover:opacity-70"
                >
                  Events
                </Link>
              </li>

              <li>
                <Link
                  to="/news"
                  className="text-sm text-white transition-opacity hover:opacity-70"
                >
                  News
                </Link>
              </li>

              <li>
                <Link
                  to="/resources"
                  className="text-sm text-white transition-opacity hover:opacity-70"
                >
                  Resource Center
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-sm text-white transition-opacity hover:opacity-70"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>

      </div>
    </footer>
  );
}

export default Footer;