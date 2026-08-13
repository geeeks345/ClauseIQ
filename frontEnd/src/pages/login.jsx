import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";

const roleContent = {
  admin: {
    label: "Admin",
    description: "Manage compliance reviews, team approvals, and organization-wide risk controls.",
  },
  user: {
    label: "User",
    description: "Upload contracts, track reviews, and monitor your assigned obligations.",
  },
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [selectedRole, setSelectedRole] = useState("user");
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setStatus({
      type: "",
      message: "",
    });

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({
      type: "",
      message: "",
    });

    try {
      const res = await loginUser(formData);
      const authenticatedRole = res.data.user?.role || "user";

      if (authenticatedRole !== selectedRole) {
        setStatus({
          type: "error",
          message: `This account is registered as ${authenticatedRole}. Switch to the ${authenticatedRole} view to continue.`,
        });
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setStatus({
        type: "success",
        message: `Login successful. Opening your ${authenticatedRole} workspace.`,
      });

      navigate("/dashboard");
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Login failed. Please verify your credentials and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="hero-panel">
        <div>
          <div className="brand-mark">ClauseIQ Secure Review</div>
          <h1 className="hero-title">Read faster. Approve smarter.</h1>
          <p className="hero-copy">
            A cleaner contract workflow for legal ops, founders, and review teams.
            Sign in as an admin or user and jump straight into the right workspace.
          </p>
        </div>

        <div className="hero-grid">
          <div className="hero-stat">
            <span>Review Velocity</span>
            <strong>2.4x faster</strong>
          </div>
          <div className="hero-stat">
            <span>Risk Coverage</span>
            <strong>98% tracked</strong>
          </div>
          <div className="hero-stat">
            <span>Role-Aware Access</span>
            <strong>Admin + User</strong>
          </div>
          <div className="hero-stat">
            <span>Escalation Flow</span>
            <strong>Live audit trail</strong>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <span className="panel-label">Welcome Back</span>
        <h2 className="auth-title">ClauseIQ Login</h2>
        <p className="auth-copy">
          Choose the workspace you want to enter, then continue with your account credentials.
        </p>

        <div className="role-switch" aria-label="Role selection">
          {Object.entries(roleContent).map(([role, content]) => (
            <button
              key={role}
              type="button"
              className={`role-chip ${selectedRole === role ? "active" : ""}`}
              onClick={() => setSelectedRole(role)}
            >
              <strong>{content.label}</strong>
              <span>{content.description}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label className="field-label" htmlFor="login-email">
              Work Email
            </label>
            <input
              id="login-email"
              className="field-input"
              type="email"
              placeholder="team@company.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="field-input"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {status.message ? (
            <div className={`status-banner ${status.type}`}>{status.message}</div>
          ) : null}

          <button className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : `Continue as ${roleContent[selectedRole].label}`}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?
          {" "}
          <Link to="/register">Create one here</Link>
        </p>
      </section>
    </div>
  );
};

export default Login;
