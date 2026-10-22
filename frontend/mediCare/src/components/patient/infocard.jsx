function InfoCard({ title, value, badge, children }) {
  return (
    <div className="col-md-6">
      <div className="card p-4 shadow-sm text-center mb-4">
        <h5>{title}</h5>
        {value && <div className="fs-4 text-success fw-bold">{value}</div>}
        {badge && <div className="badge bg-success mt-2">{badge}</div>}
        {children}
      </div>
    </div>
  );
}

export default InfoCard;
