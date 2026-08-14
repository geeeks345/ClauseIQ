import { useNavigate } from "react-router-dom";

const roleConfig = {
  admin: {
    badge: "Admin Workspace",
    intro:
      "Oversee team activity, unblock risky clauses, and keep approvals moving without losing context.",
    metrics: [
      {
        label: "Contracts In Review",
        value: "124",
        trend: "+18 this week",
      },
      {
        label: "Critical Risks",
        value: "09",
        trend: "2 need escalation today",
      },
      {
        label: "Team Coverage",
        value: "87%",
        trend: "Across legal, finance, and ops",
      },
    ],
    signals: [
      {
        eyebrow: "Oversight",
        title: "Approval queue needs attention",
        description:
          "Nine agreements are waiting for final sign-off from legal ops.",
      },
      {
        eyebrow: "Compliance",
        title: "Renewal clauses spiking",
        description:
          "Auto-renew language appeared in 23% more uploads than last month.",
      },
    ],
    workspace: {
      title: "Admin priorities",
      description:
        "Use this space to coordinate reviewers, reduce turnaround time, and standardize decisions.",
      actions: [
        "Review escalated clauses",
        "Assign owners by department",
        "Export weekly risk summary",
      ],
    },
  },

  user: {
    badge: "User Workspace",
    intro:
      "Track your contracts, monitor risks, and keep your review cycle organized from one dashboard.",
    metrics: [
      {
        label: "My Active Contracts",
        value: "16",
        trend: "4 updated in the last 24 hours",
      },
      {
        label: "Pending Reviews",
        value: "05",
        trend: "1 blocked on redline feedback",
      },
      {
        label: "Average Risk Score",
        value: "72",
        trend: "Down 6 points from last week",
      },
    ],
    signals: [
      {
        eyebrow: "Next up",
        title: "MSA renewal requires review",
        description:
          "A liability cap clause changed and should be checked before approval.",
      },
      {
        eyebrow: "Reminder",
        title: "One task due today",
        description:
          "Confirm vendor obligations and upload the final negotiated draft.",
      },
    ],
    workspace: {
      title: "User priorities",
      description:
        "Stay focused on your assigned agreements and move each one confidently to the next step.",
      actions: [
        "Upload a new contract",
        "Check open tasks",
        "View latest risk summary",
      ],
    },
  },
};

const Dashboard = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const role = user?.role === "admin" ? "admin" : "user";
  const content = roleConfig[role];

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-panel">
          <span className="panel-label">Session Required</span>

          <h1 className="dashboard-title">
            ClauseIQ Dashboard
          </h1>

          <p className="dashboard-copy">
            Your session is not active yet. Sign in again to
            access the correct admin or user workspace.
          </p>

          <div className="quick-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => navigate("/")}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-panel">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <span className="panel-label">
              ClauseIQ Dashboard
            </span>

            <h1 className="dashboard-title">
              Welcome back, {user.name}
            </h1>

            <p className="dashboard-copy">
              {content.intro}
            </p>
          </div>

          <div className="pill-badge">
            {content.badge}
          </div>
        </div>

        <div className="dashboard-grid">

          {/* Main Content */}
          <section>

            {/* Metrics */}
            <div className="metrics-grid">
              {content.metrics.map((metric) => (
                <article
                  key={metric.label}
                  className="metric-card"
                >
                  <span className="metric-label">
                    {metric.label}
                  </span>

                  <strong className="metric-value">
                    {metric.value}
                  </strong>

                  <div className="metric-trend">
                    {metric.trend}
                  </div>
                </article>
              ))}
            </div>

            {/* Signals */}
            <div
              className="signals-grid"
              style={{ marginTop: "18px" }}
            >
              {content.signals.map((signal) => (
                <article
                  key={signal.title}
                  className="signal-card"
                >
                  <span className="section-eyebrow">
                    {signal.eyebrow}
                  </span>

                  <h3>{signal.title}</h3>

                  <p>{signal.description}</p>
                </article>
              ))}
            </div>

            {/* Workspace */}
            <div
              className="workspace-grid"
              style={{ marginTop: "18px" }}
            >
              <article className="workspace-card">
                <span className="section-eyebrow">
                  Workspace
                </span>

                <h3>{content.workspace.title}</h3>

                <p>{content.workspace.description}</p>

                <ul>
                  {content.workspace.actions.map(
                    (action) => (
                      <li key={action}>{action}</li>
                    )
                  )}
                </ul>
              </article>

              {/* Profile */}
              <article className="workspace-card">
                <span className="section-eyebrow">
                  Profile
                </span>

                <h3>Account Snapshot</h3>

                <p>
                  Your current access level and account
                  details are shown here.
                </p>

                <dl className="profile-card">
                  <dt>Name</dt>
                  <dd>{user.name}</dd>

                  <dt>Email</dt>
                  <dd>{user.email}</dd>

                  <dt>Role</dt>
                  <dd>{user.role}</dd>
                </dl>
              </article>
            </div>
          </section>

          {/* Quick Actions */}
          <aside>
            <article className="quick-card">
              <span className="section-eyebrow">
                Quick Actions
              </span>

              <h3>
                {role === "admin"
                  ? "Lead the review queue"
                  : "Keep your reviews moving"}
              </h3>

              <p>
                {role === "admin"
                  ? "Jump into escalations, hand out assignments, and keep approval SLAs healthy."
                  : "Start a new upload, revisit flagged clauses, or continue your most recent review."}
              </p>

              <div className="quick-actions">

                {/* Upload / Review Queue */}
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => {
                    if (role === "admin") {
                      navigate("/review-queue");
                    } else {
                      navigate("/upload");
                    }
                  }}
                >
                  {role === "admin"
                    ? "Open Review Queue"
                    : "Upload Contract"}
                </button>

                {/* My Contracts */}
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => navigate("/contracts")}
                >
                  My Contracts
                </button>

                {/* Tasks / Reports */}
                <button
                  className="secondary-button"
                  type="button"
                >
                  {role === "admin"
                    ? "View Risk Reports"
                    : "View My Tasks"}
                </button>

                {/* Logout */}
                <button
                  className="secondary-button"
                  type="button"
                  onClick={logout}
                >
                  Logout
                </button>

              </div>
            </article>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;