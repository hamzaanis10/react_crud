import apiClient, { CanceledError } from "./services/api-client";
import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/users", {
          signal: controller.signal,
        });
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        if (err instanceof CanceledError) {
          return;
        }
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  const addUser = async () => {
    const originalUsers = [...users];
    const user = {
      id: 0,
      name: "hamza",
      email: "hamza@gmail.com",
      address: {
        street: "f 26",
        city: "karachi",
      },
    };
    setUsers([user, ...users]);

    try {
      const { data } = await apiClient.post("/users", user);
      setUsers([data, ...users]);
    } catch (err) {
      setError(err.message);
      setUsers(originalUsers);
    }
  };

  const deleteUser = async (user) => {
    const originalUsers = [...users];
    setUsers(users.filter((u) => u.id !== user.id));
    try {
      const res = await apiClient.delete(`/users/${user.id}`);
    } catch (err) {
      setError(err.message);
      setUsers(originalUsers);
    }
  };

  const updateUser = async (user) => {
    const originalUsers = [...users];
    const updatedUser = {
      ...user,
      address: { ...user.address, city: "islamabad" },
    };

    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
    try {
      const res = await apiClient.patch(`/users/${user.id}`, updatedUser);
    } catch (err) {
      setError(err.message);
      setUsers(originalUsers);
    }
  };
  return (
    <div className="container my-5">
      {error && <p className="text-danger">{error}</p>}
      {loading && <div className="spinner-border"></div>}
      <button className="btn btn-primary mb-3" onClick={addUser}>
        Add User
      </button>
      <ul className="list-group">
        {users.map((user) => (
          <div className="card mb-3" key={user.id}>
            <div className="card-body">
              <h5 className="card-title">{user.name}</h5>
              <p className="card-text">{user.email}</p>
              <p className="card-text">
                <span>Street:</span> {user.address.street} <span>City:</span>
                {user.address.city}
              </p>
              <button
                className="btn btn-outline-danger mx-2"
                onClick={() => deleteUser(user)}
              >
                Delete
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => updateUser(user)}
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;
