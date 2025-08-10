import { Dentist } from "@/lib/types";

export default function DentistList({
  dentists,
  loading,
  onCheckAvailability,
}: {
  dentists: Dentist[];
  loading: boolean;
  onCheckAvailability: (dentist: Dentist) => void;
}) {
  return loading ? (
    <>Loading dentists...</>
  ) : (
    <>
      <h2 className="my-4">Choose Your Dentist</h2>
      <div className="row g-4">
        {dentists.map((dentist) => (
          <div className="col-md-4" key={dentist.id}>
            <div className="card h-100 shadow-sm">
              <h5 className="card-header text-center">{dentist.name}</h5>
              <div className="card-body">
                <div className="card-text">
                  <h6>Services</h6>
                  <ul>
                    {dentist.services.map((service) => (
                      <li key={service.id}>{service.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="card-footer text-center">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => onCheckAvailability(dentist)}
                >
                  Check Availability
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
