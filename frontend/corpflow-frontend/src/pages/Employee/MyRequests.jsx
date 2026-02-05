import { useEffect, useState } from "react";
import { myRequests } from "../../api/requests";
import { Link } from "react-router-dom";

export default function MyRequests() {
  const [list, setList] = useState([]);

  useEffect(() => {
    myRequests().then((res) => setList(res.data));
  }, []);

  return (
    <div>
      <h2>My Requests</h2>

      <ul>
        {list.map((r) => (
          <li key={r.id}>
            {r.request_type} - {r.status}
            <Link to={`/employee/requests/${r.id}`}>
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
