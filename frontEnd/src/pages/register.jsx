import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

const roleOptions = [
  {
    value: "user",
    label: "User Workspace",
    description: "For individual reviewers tracking their own contracts and tasks.",
  },
  {
    value: "admin",
    label: "Admin Workspace",
    description: "For managers overseeing review queues, risks, and team access.",
  },
];

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
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
      await registerUser(formData);
      setStatus({
        type: "success",
        message: "Registration successful. You can now sign in with your selected role.",
      });
      navigate("/");
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || err.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="hero-panel">
        <div>
          <div className="brand-mark">ClauseIQ Onboarding</div>
          <h1 className="hero-title">Build one contract system for every role.</h1>
          <p className="hero-copy">
            Create an admin or user account and land in a workspace designed for the way you review,
            escalate, and close obligations.
          </p>
        </div>

        <div className="hero-grid">
          {roleOptions.map((option) => (
            <div key={option.value} className="hero-stat">
              <span>{option.label}</span>
              <strong>{option.value === "admin" ? "Portfolio control" : "Personal review queue"}</strong>
            </div>
          ))}
          <div className="hero-stat">
            <span>Smart Triage</span>
            <strong>Priority-based insights</strong>
          </div>
          <div className="hero-stat">
            <span>Collaboration</span>
            <strong>Comments and audit trail</strong>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <span className="panel-label">Create Account</span>
        <h2 className="auth-title">Set up your ClauseIQ workspace</h2>
        <p className="auth-copy">
          Choose the access level that fits your workflow, then finish the account setup.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label className="field-label" htmlFor="register-name">
              Full Name
            </label>
            <input
              id="register-name"
              className="field-input"
              name="name"
              placeholder="Avery Carter"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="register-email">
              Work Email
            </label>
            <input
              id="register-email"
              className="field-input"
              type="email"
              name="email"
              placeholder="legal@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="register-password">
              Password
            </label>
            <input
              id="register-password"
              className="field-input"
              type="password"
              name="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="register-role">
              Workspace Type
            </label>
            <select
              id="register-role"
              className="field-select"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="auth-copy">
              {roleOptions.find((option) => option.value === formData.role)?.description}
            </div>
          </div>

          {status.message ? (
            <div className={`status-banner ${status.type}`}>{status.message}</div>
          ) : null}

          <button className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Workspace"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?
          {" "}
          <Link to="/">Return to login</Link>
        </p>
      </section>
    </div>
  );
};

export default Register;
