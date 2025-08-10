import { useAuth } from "@/context/AuthContext";
import { PATHS } from "@/lib/constants";
import Link from "next/link";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  const navbarleftSection = isAuthenticated ? (
    <>
      <Link className="nav-item nav-link" href={PATHS.SCHEDULE}>
        Schedule
      </Link>
      <Link className="nav-item nav-link" href={PATHS.MANAGE}>
        Manage
      </Link>
    </>
  ) : (
    <>
      <Link className="nav-item nav-link" href={PATHS.SCHEDULE}>
        Schedule
      </Link>
    </>
  );

  const navbarRightSection = isAuthenticated ? (
    <>
      <Link href={PATHS.PROFILE}>
        <button type="button" className="btn">
          <i className="bi bi-person-circle"></i>
        </button>
      </Link>
      |
      <button type="button" className="btn" onClick={logout}>
        <i className="bi bi-box-arrow-right"></i>
      </button>
    </>
  ) : (
    <>
      <Link href={PATHS.LOGIN}>
        <button type="button" className="btn btn-primary">
          Login
        </button>
      </Link>
    </>
  );

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand mb-1" href={PATHS.HOME}>
          Dental Office
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">{navbarleftSection}</div>
          <div className="ms-auto d-flex align-items-center">
            {navbarRightSection}
          </div>
        </div>
      </div>
    </nav>
  );
}
