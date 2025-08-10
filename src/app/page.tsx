import { PATHS } from "@/lib/constants";

export default function Page() {
  return (
    <section
      id="hero"
      className="d-flex align-items-center justify-content-center text-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="container">
        <div className="d-flex flex-column gap-4 align-items-center">
          <h1 className="text-primary fw-bold">Dental Office</h1>

          <p className="text-secondary fs-5" style={{ maxWidth: "700px" }}>
            Providing quality dental care for the whole family. From general
            checkups to orthodontics and cosmetic dentistry, we’re here to keep
            your smile healthy and bright.
          </p>

          <div className="w-100" style={{ maxWidth: "200px" }}>
            <h4 className="mb-3">Our Services</h4>
            <ul className="list-group list-group-flush text-center">
              <li className="list-group-item">Adjustment</li>
              <li className="list-group-item">Tooth Filling (Pasta)</li>
              <li className="list-group-item">Braces</li>
              <li className="list-group-item">Extraction</li>
              <li className="list-group-item">Restoration</li>
            </ul>
          </div>

          <a href={PATHS.SCHEDULE} className="btn btn-primary btn-lg mt-4">
            Schedule an Appointment
          </a>
        </div>
      </div>
    </section>
  );
}
