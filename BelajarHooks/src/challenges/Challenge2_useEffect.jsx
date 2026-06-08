import { useState } from "react";

const Challenge2_useEffect = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setsearch] = useState("");

  const fectUsers = useCallback(() => {});

  return <div>Challenge2_useEffect</div>;
};

export default Challenge2_useEffect;
