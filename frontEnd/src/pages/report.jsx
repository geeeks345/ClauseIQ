import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
      }}
    >
      <h1>ClauseIQ Dashboard</h1>

      <h2>Welcome {user?.name}</h2>

      <p>Email : {user?.email}</p>

      <p>Role : {user?.role}</p>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;