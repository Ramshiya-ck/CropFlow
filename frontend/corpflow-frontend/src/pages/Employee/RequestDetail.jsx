import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRequestDetail } from "../../api/requests";

export default function RequestDetail() {
  const { id } = useParams();
  const [req, setReq] = useState(null);

  useEffect(() => {
    getRequestDetail(id).then((res) => setReq(res.data));
  }, [id]);

  if (!req) return <p>Loading...</p>;

  return (
    <div>
      <h2>{req.request_type}</h2>
      <p>Status: {req.status}</p>

      <h3>History</h3>
      <ul>
        {req.history.map((h) => (
          <li key={h.id}>
            {h.action} by {h.action_by_email} at{" "}
            {h.created_at}
          </li>
        ))}
      </ul>
    </div>
  );
}
