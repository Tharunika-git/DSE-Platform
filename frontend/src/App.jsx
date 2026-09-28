import { useEffect, useState } from "react";
import axios from "axios";

import {
  ShieldCheck,
  ShieldAlert,
  Activity,
  FileCheck2,
  Server,
  LockKeyhole,
  RefreshCw,
  Plus,
  Trash2,
  Pencil,
  X,
  Search,
  ArrowRight,
  User,
  Network,
  Database,
  Clock3,
  Filter,
  Settings,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [theme, setTheme] = useState(
  localStorage.getItem("dse-theme") || "dark"
);

useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("dse-theme", theme);
}, [theme]);
  const [dashboard, setDashboard] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [events, setEvents] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // AUTHENTICATION
  // =========================

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("dse_token"))
  );

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("dse_user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (loginData) => {
    localStorage.setItem("dse_token", loginData.token);
    localStorage.setItem(
      "dse_user",
      JSON.stringify(loginData.user)
    );

    setCurrentUser(loginData.user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("dse_token");
    localStorage.removeItem("dse_user");

    setCurrentUser(null);
    setIsLoggedIn(false);
    setDashboard(null);
    setPolicies([]);
    setEvents([]);
  };

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        dashboardRes,
        policiesRes,
        eventsRes,
      ] = await Promise.all([
        axios.get(`${API}/dashboard`),
        axios.get(`${API}/policies`),
        axios.get(`${API}/security-events`),
      ]);

      setDashboard(dashboardRes.data);
      setPolicies(
        dashboardRes.data
          ? policiesRes.data.policies || []
          : []
      );
      setEvents(eventsRes.data.events || []);
    } catch (error) {
      console.error(
        "Failed to load DSE data:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="app loading-screen">
        <div>
          <ShieldCheck size={48} />

          <h2>DSE Security Control Plane</h2>

          <p>
            Loading security posture...
          </p>
        </div>
      </div>
    );
  }

  const stats = dashboard?.statistics || {};

  return (
    <div className="app">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-icon">
            <ShieldCheck size={26} />
          </div>

          <div>
            <h1>DSE</h1>

            <span>
              Dynamic Security Enforcement
            </span>
          </div>

        </div>


        <div className="header-status">

          <span className="status-dot"></span>

          SECURITY ENGINE ONLINE

          <button
            onClick={loadData}
            title="Refresh security data"
          >
            <RefreshCw size={18} />
          </button>

          <div className="user-session">
            <span>
              {currentUser?.name || currentUser?.email}
            </span>

            <span className="user-role">
              {currentUser?.role}
            </span>

            <button
              className="logout-button"
              onClick={handleLogout}
              title="Logout"
            >
              Logout
            </button>
          </div>

        </div>

      </header>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="view-nav">

        <button
          className={
            activeView === "dashboard"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveView("dashboard")
          }
        >
          <Activity size={16} />
          Security Posture
        </button>


        <button
          className={
            activeView === "policies"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveView("policies")
          }
        >
          <FileCheck2 size={16} />
          Policy Studio
        </button>


        <button
          className={
            activeView === "decisions"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveView("decisions")
          }
        >
          <ShieldAlert size={16} />
          Decision Explorer
        </button>


        <button
          className={
            activeView === "audit"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveView("audit")
          }
        >
          <Clock3 size={16} />
          Audit Log
        </button>

        <button
          className={
            activeView === "settings"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveView("settings")
          }
        >
          <Settings size={16} />
          Settings
        </button>

      </nav>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="content">

        {/* ===================================================
            POLICY STUDIO
        =================================================== */}

        {activeView === "policies" ? (

          <PolicyStudio
            policies={policies}
            onRefresh={loadData}
          />

        ) : activeView === "decisions" ? (

          <DecisionExplorer
            events={events}
            policies={policies}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
          />

        ) : activeView === "audit" ? (

          <AuditLog
            events={events}
          />

        ) : activeView === "settings" ? (

          <section className="settings-page">

            <div className="page-heading">

              <div>
                <p className="eyebrow">
                  SYSTEM PREFERENCES
                </p>

                <h2>
                  Settings
                </h2>

                <p>
                  Manage your DSE control plane appearance.
                </p>
              </div>

              <Settings size={24} />

            </div>

            <div className="panel settings-panel">

              <div className="panel-header">

                <div>
                  <span className="panel-label">
                    APPEARANCE
                  </span>

                  <h3>
                    Theme
                  </h3>
                </div>

                <Settings size={20} />

              </div>

              <div className="theme-options">

                <button
                  className={
                    theme === "dark"
                      ? "theme-option selected"
                      : "theme-option"
                  }
                  onClick={() => setTheme("dark")}
                >
                  <Moon size={20} />

                  <div>
                    <strong>Dark</strong>
                    <span>Use the dark DSE interface.</span>
                  </div>
                </button>

                <button
                  className={
                    theme === "light"
                      ? "theme-option selected"
                      : "theme-option"
                  }
                  onClick={() => setTheme("light")}
                >
                  <Sun size={20} />

                  <div>
                    <strong>Light</strong>
                    <span>Use a light interface.</span>
                  </div>
                </button>

                <button
                  className={
                    theme === "system"
                      ? "theme-option selected"
                      : "theme-option"
                  }
                  onClick={() => setTheme("system")}
                >
                  <Monitor size={20} />

                  <div>
                    <strong>System</strong>
                    <span>Follow your system appearance.</span>
                  </div>
                </button>

              </div>

            </div>

          </section>

        ) : (

          /* =================================================
             SECURITY POSTURE
          ================================================= */

          <>

            <section className="page-heading">

              <div>

                <p className="eyebrow">
                  SECURITY CONTROL PLANE
                </p>

                <h2>
                  Security Posture
                </h2>

                <p>
                  Centralized visibility into API
                  access decisions, security policies
                  and enforcement activity.
                </p>

              </div>


              <div className="posture-badge">

                {stats.deniedRequests > 0 ? (
                  <ShieldAlert size={20} />
                ) : (
                  <ShieldCheck size={20} />
                )}

                {stats.deniedRequests > 0
                  ? "ATTENTION REQUIRED"
                  : "SECURE"}

              </div>

            </section>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <section className="stats-grid">

              <StatCard
                icon={<Activity />}
                label="Total Requests"
                value={
                  stats.totalRequests ?? 0
                }
                detail="Security decisions"
              />


              <StatCard
                icon={<ShieldCheck />}
                label="Allowed"
                value={
                  stats.allowedRequests ?? 0
                }
                detail={
                  stats.allowRate || "0%"
                }
              />


              <StatCard
                icon={<ShieldAlert />}
                label="Denied"
                value={
                  stats.deniedRequests ?? 0
                }
                detail={
                  stats.denyRate || "0%"
                }
              />


              <StatCard
                icon={<FileCheck2 />}
                label="Active Policies"
                value={
                  stats.activePolicies ?? 0
                }
                detail="Policy rules"
              />

            </section>


            {/* =================================================
                SERVICE MAP + POLICY SUMMARY
            ================================================= */}

            <section className="dashboard-grid">

              <div className="panel service-panel">

                <div className="panel-header">

                  <div>

                    <span className="panel-label">
                      INFRASTRUCTURE
                    </span>

                    <h3>
                      Service Security Map
                    </h3>

                  </div>

                  <Network size={20} />

                </div>


                <div className="service-map">

                  <div className="service-node gateway">

                    <LockKeyhole size={22} />

                    <strong>
                      DSE Policy Engine
                    </strong>

                    <span>
                      Dynamic Security Enforcement
                    </span>

                  </div>


                  <div className="connection"></div>


                  <div className="service-row">

                    <ServiceNode
                      name="User Service"
                      status="Protected"
                      icon={<User size={18} />}
                    />

                    <ServiceNode
                      name="Order Service"
                      status="Protected"
                      icon={<Server size={18} />}
                    />

                    <ServiceNode
                      name="Inventory Service"
                      status="Protected"
                      icon={<Database size={18} />}
                    />

                  </div>

                </div>

              </div>


              {/* POLICY SUMMARY */}

              <div className="panel">

                <div className="panel-header">

                  <div>

                    <span className="panel-label">
                      POLICY INTELLIGENCE
                    </span>

                    <h3>
                      Active Security Policies
                    </h3>

                  </div>

                  <FileCheck2 size={20} />

                </div>


                <div className="policy-list">

                  {policies.map((policy) => (

                    <div
                      className="policy-item"
                      key={policy.id}
                    >

                      <div className="policy-main">

                        <strong>
                          {policy.name}
                        </strong>

                        <span>
                          {policy.role}
                          {" · "}
                          {policy.method}
                          {" · "}
                          {policy.service}
                        </span>

                      </div>


                      <div
                        className={`effect ${
                          policy.effect === "ALLOW"
                            ? "allow"
                            : "deny"
                        }`}
                      >
                        {policy.effect}
                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </section>


            {/* =================================================
                SECURITY TIMELINE
            ================================================= */}

            <section className="panel timeline-panel">

              <div className="panel-header">

                <div>

                  <span className="panel-label">
                    LIVE MONITORING
                  </span>

                  <h3>
                    Security Decision Timeline
                  </h3>

                </div>

                <Activity size={20} />

              </div>


              {events.length === 0 ? (

                <div className="empty-state">
                  No security events recorded.
                </div>

              ) : (

                <div className="timeline">

                  {[...events]
                    .reverse()
                    .map((event) => (

                      <div
                        className="event-row"
                        key={event.id}
                      >

                        <div
                          className={`event-indicator ${
                            event.decision === "ALLOW"
                              ? "allow"
                              : "deny"
                          }`}
                        >

                          {event.decision ===
                          "ALLOW" ? (
                            <ShieldCheck size={17} />
                          ) : (
                            <ShieldAlert size={17} />
                          )}

                        </div>


                        <div className="event-info">

                          <strong>
                            {event.method}{" "}
                            {event.endpoint}
                          </strong>

                          <span>
                            {event.email}
                            {" · "}
                            {event.service}
                          </span>

                        </div>


                        <div
                          className={`event-decision ${
                            event.decision === "ALLOW"
                              ? "allow"
                              : "deny"
                          }`}
                        >
                          {event.decision}
                        </div>

                      </div>

                    ))}

                </div>

              )}

            </section>

          </>

        )}

      </main>

    </div>
  );
}


/* ============================================================
   POLICY STUDIO
============================================================ */

function PolicyStudio({
  policies,
  onRefresh,
}) {

  const [showForm, setShowForm] =
    useState(false);

  const [editingPolicy, setEditingPolicy] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    role: "USER",
    service: "",
    endpoint: "",
    method: "GET",
    effect: "ALLOW",
  });


  const resetForm = () => {

    setForm({
      name: "",
      role: "USER",
      service: "",
      endpoint: "",
      method: "GET",
      effect: "ALLOW",
    });

    setEditingPolicy(null);
    setShowForm(false);
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingPolicy) {

        await axios.put(
          `${API}/policies/${editingPolicy.id}`,
          form
        );

      } else {

        await axios.post(
          `${API}/policies`,
          form
        );

      }

      resetForm();

      await onRefresh();

    } catch (error) {

      console.error(
        "Policy operation failed:",
        error
      );

      alert(
        "Policy operation failed"
      );
    }
  };


  const handleEdit = (policy) => {

    setEditingPolicy(policy);

    setForm({
      name: policy.name,
      role: policy.role,
      service: policy.service,
      endpoint: policy.endpoint,
      method: policy.method,
      effect: policy.effect,
    });

    setShowForm(true);
  };


  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Delete this security policy?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await axios.delete(
        `${API}/policies/${id}`
      );

      await onRefresh();

    } catch (error) {

      console.error(
        "Policy deletion failed:",
        error
      );

      alert(
        "Policy deletion failed"
      );
    }
  };


  return (
    <>

      <section className="page-heading">

        <div>

          <p className="eyebrow">
            POLICY INTELLIGENCE
          </p>

          <h2>
            Policy Studio
          </h2>

          <p>
            Create, modify and remove dynamic
            security enforcement policies.
          </p>

        </div>


        <button
          className="primary-button"
          onClick={() =>
            setShowForm(true)
          }
        >
          <Plus size={17} />

          New Policy
        </button>

      </section>


      <section className="panel policy-studio-panel">

        <div className="panel-header">

          <div>

            <span className="panel-label">
              POLICY CONFIGURATION
            </span>

            <h3>
              Security Enforcement Rules
            </h3>

          </div>

          <FileCheck2 size={20} />

        </div>


        <div className="policy-table-wrapper">

          <table className="policy-table">

            <thead>

              <tr>

                <th>ID</th>
                <th>Policy</th>
                <th>Role</th>
                <th>Service</th>
                <th>Endpoint</th>
                <th>Method</th>
                <th>Effect</th>
                <th>Actions</th>

              </tr>

            </thead>


            <tbody>

              {policies.map((policy) => (

                <tr key={policy.id}>

                  <td>
                    #{policy.id}
                  </td>


                  <td>
                    <strong>
                      {policy.name}
                    </strong>
                  </td>


                  <td>
                    <span className="table-tag">
                      {policy.role}
                    </span>
                  </td>


                  <td>
                    {policy.service}
                  </td>


                  <td className="mono">
                    {policy.endpoint}
                  </td>


                  <td>
                    {policy.method}
                  </td>


                  <td>

                    <span
                      className={`effect ${
                        policy.effect === "ALLOW"
                          ? "allow"
                          : "deny"
                      }`}
                    >
                      {policy.effect}
                    </span>

                  </td>


                  <td>

                    <div className="action-buttons">

                      <button
                        className="icon-button"
                        title="Edit policy"
                        onClick={() =>
                          handleEdit(policy)
                        }
                      >
                        <Pencil size={15} />
                      </button>


                      <button
                        className="icon-button danger"
                        title="Delete policy"
                        onClick={() =>
                          handleDelete(
                            policy.id
                          )
                        }
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>


      {showForm && (

        <div className="modal-overlay">

          <div className="policy-modal">

            <div className="modal-header">

              <div>

                <span className="panel-label">
                  SECURITY POLICY
                </span>

                <h3>
                  {editingPolicy
                    ? "Edit Policy"
                    : "Create Policy"}
                </h3>

              </div>


              <button
                className="icon-button"
                onClick={resetForm}
              >
                <X size={18} />
              </button>

            </div>


            <form
              className="policy-form"
              onSubmit={handleSubmit}
            >

              <FormField
                label="Policy Name"
                value={form.name}
                onChange={(value) =>
                  setForm({
                    ...form,
                    name: value,
                  })
                }
                placeholder="Example: User View Orders"
              />


              <FormField
                label="Role"
                value={form.role}
                onChange={(value) =>
                  setForm({
                    ...form,
                    role: value,
                  })
                }
                placeholder="USER"
              />


              <FormField
                label="Service"
                value={form.service}
                onChange={(value) =>
                  setForm({
                    ...form,
                    service: value,
                  })
                }
                placeholder="order-service"
              />


              <FormField
                label="Endpoint"
                value={form.endpoint}
                onChange={(value) =>
                  setForm({
                    ...form,
                    endpoint: value,
                  })
                }
                placeholder="/api/orders"
              />


              <div className="form-row">

                <div className="form-group">

                  <label>
                    HTTP Method
                  </label>

                  <select
                    value={form.method}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        method:
                          e.target.value,
                      })
                    }
                  >

                    <option value="GET">
                      GET
                    </option>

                    <option value="POST">
                      POST
                    </option>

                    <option value="PUT">
                      PUT
                    </option>

                    <option value="DELETE">
                      DELETE
                    </option>

                  </select>

                </div>


                <div className="form-group">

                  <label>
                    Effect
                  </label>

                  <select
                    value={form.effect}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        effect:
                          e.target.value,
                      })
                    }
                  >

                    <option value="ALLOW">
                      ALLOW
                    </option>

                    <option value="DENY">
                      DENY
                    </option>

                  </select>

                </div>

              </div>


              <div className="form-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingPolicy
                    ? "Update Policy"
                    : "Create Policy"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </>
  );
}


/* ============================================================
   DECISION EXPLORER
============================================================ */

function DecisionExplorer({
  events,
  policies,
  selectedEvent,
  setSelectedEvent,
}) {

  return (
    <section>

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            SECURITY INVESTIGATION
          </p>

          <h2>
            Decision Explorer
          </h2>

          <p>
            Investigate why DSE allowed or denied
            individual API access requests.
          </p>

        </div>

      </div>


      <div className="decision-layout">

        {/* EVENTS */}

        <div className="panel">

          <div className="panel-header">

            <div>

              <span className="panel-label">
                SECURITY EVENTS
              </span>

              <h3>
                Access Decisions
              </h3>

            </div>

            <Search size={20} />

          </div>


          <div className="decision-event-list">

            {events.length === 0 ? (

              <div className="empty-state">
                No security events recorded.
              </div>

            ) : (

              [...events]
                .reverse()
                .map((event) => (

                  <button
                    className={`decision-event ${
                      selectedEvent?.id === event.id
                        ? "selected"
                        : ""
                    }`}
                    key={event.id}
                    onClick={() =>
                      setSelectedEvent(event)
                    }
                  >

                    <div
                      className={`event-indicator ${
                        event.decision === "ALLOW"
                          ? "allow"
                          : "deny"
                      }`}
                    >

                      {event.decision ===
                      "ALLOW" ? (
                        <ShieldCheck size={16} />
                      ) : (
                        <ShieldAlert size={16} />
                      )}

                    </div>


                    <div className="decision-event-info">

                      <strong>
                        {event.method}{" "}
                        {event.endpoint}
                      </strong>

                      <span>
                        {event.email}
                        {" · "}
                        {event.service}
                      </span>

                    </div>


                    <span
                      className={`effect ${
                        event.decision === "ALLOW"
                          ? "allow"
                          : "deny"
                      }`}
                    >
                      {event.decision}
                    </span>

                  </button>

                ))

            )}

          </div>

        </div>


        {/* DECISION DETAIL */}

        <div className="panel decision-detail">

          <div className="panel-header">

            <div>

              <span className="panel-label">
                DECISION ANALYSIS
              </span>

              <h3>
                Why Was This Request Decided?
              </h3>

            </div>

            <Activity size={20} />

          </div>


          {!selectedEvent ? (

            <div className="empty-state">
              Select a security event to investigate
              its decision path.
            </div>

          ) : (

            <div className="decision-analysis">

              <div className="decision-result">

                <span>
                  FINAL DECISION
                </span>

                <strong
                  className={
                    selectedEvent.decision ===
                    "ALLOW"
                      ? "decision-allow"
                      : "decision-deny"
                  }
                >
                  {selectedEvent.decision}
                </strong>

              </div>


              <DecisionField
                label="USER"
                value={
                  selectedEvent.email
                }
              />


              <DecisionField
                label="ROLE"
                value={
                  selectedEvent.role
                }
              />


              <DecisionField
                label="SERVICE"
                value={
                  selectedEvent.service
                }
              />


              <DecisionField
                label="ENDPOINT"
                value={
                  selectedEvent.endpoint
                }
              />


              <DecisionField
                label="HTTP METHOD"
                value={
                  selectedEvent.method
                }
              />


              <DecisionField
                label="REASON"
                value={
                  selectedEvent.reason
                }
              />


              <DecisionField
                label="MATCHED POLICY"
                value={
                  selectedEvent.policyId
                    ? `Policy #${selectedEvent.policyId}`
                    : "No matching policy"
                }
              />


              {selectedEvent.policyId && (

                <div className="matched-policy">

                  <span className="panel-label">
                    POLICY DETAILS
                  </span>


                  {(() => {

                    const policy =
                      policies.find(
                        (p) =>
                          p.id ===
                          selectedEvent.policyId
                      );


                    if (!policy) {

                      return (
                        <p>
                          Policy details unavailable.
                        </p>
                      );

                    }


                    return (

                      <div>

                        <strong>
                          {policy.name}
                        </strong>


                        <span>
                          {policy.role}
                          {" · "}
                          {policy.service}
                          {" · "}
                          {policy.method}
                        </span>


                        <b
                          className={`effect ${
                            policy.effect ===
                            "ALLOW"
                              ? "allow"
                              : "deny"
                          }`}
                        >
                          {policy.effect}
                        </b>

                      </div>

                    );

                  })()}

                </div>

              )}


              <div className="decision-flow">

                <div className="flow-step">

                  <User size={17} />

                  <span>
                    Identity
                  </span>

                </div>


                <ArrowRight size={16} />


                <div className="flow-step">

                  <FileCheck2 size={17} />

                  <span>
                    Policy
                  </span>

                </div>


                <ArrowRight size={16} />


                <div className="flow-step">

                  <ShieldCheck size={17} />

                  <span>
                    Decision
                  </span>

                </div>


                <ArrowRight size={16} />


                <div className="flow-step">

                  <Server size={17} />

                  <span>
                    Service
                  </span>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </section>
  );
}


/* ============================================================
   AUDIT LOG
============================================================ */

function AuditLog({ events }) {

  const [filter, setFilter] =
    useState("ALL");

  const filteredEvents =
    filter === "ALL"
      ? events
      : events.filter(
          (event) =>
            event.decision === filter
        );


  return (
    <section>

      {/* HEADER */}

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            SECURITY OPERATIONS
          </p>

          <h2>
            Audit Log
          </h2>

          <p>
            Review recorded security decisions
            and enforcement activity.
          </p>

        </div>


        <div className="audit-filter">

          <Filter size={15} />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >

            <option value="ALL">
              All Events
            </option>

            <option value="ALLOW">
              Allowed
            </option>

            <option value="DENY">
              Denied
            </option>

          </select>

        </div>

      </div>


      {/* AUDIT SUMMARY */}

      <div className="audit-summary">

        <div className="audit-summary-card">

          <span>
            TOTAL EVENTS
          </span>

          <strong>
            {events.length}
          </strong>

        </div>


        <div className="audit-summary-card allow-card">

          <span>
            ALLOWED
          </span>

          <strong>
            {
              events.filter(
                (event) =>
                  event.decision === "ALLOW"
              ).length
            }
          </strong>

        </div>


        <div className="audit-summary-card deny-card">

          <span>
            DENIED
          </span>

          <strong>
            {
              events.filter(
                (event) =>
                  event.decision === "DENY"
              ).length
            }
          </strong>

        </div>

      </div>


      {/* AUDIT TABLE */}

      <section className="panel audit-panel">

        <div className="panel-header">

          <div>

            <span className="panel-label">
              AUDIT TRAIL
            </span>

            <h3>
              Security Events
            </h3>

          </div>

          <Clock3 size={20} />

        </div>


        <div className="audit-table-wrapper">

          <table className="audit-table">

            <thead>

              <tr>

                <th>
                  TIME
                </th>

                <th>
                  USER
                </th>

                <th>
                  ROLE
                </th>

                <th>
                  SERVICE
                </th>

                <th>
                  ENDPOINT
                </th>

                <th>
                  METHOD
                </th>

                <th>
                  DECISION
                </th>

                <th>
                  POLICY
                </th>

              </tr>

            </thead>


            <tbody>

              {[...filteredEvents]
                .reverse()
                .map((event) => (

                  <tr key={event.id}>

                    <td className="audit-time">

                      {event.timestamp
                        ? new Date(
                            event.timestamp
                          ).toLocaleString()
                        : "—"}

                    </td>


                    <td>

                      <strong>
                        {event.email}
                      </strong>

                    </td>


                    <td>

                      <span className="table-tag">
                        {event.role}
                      </span>

                    </td>


                    <td>
                      {event.service}
                    </td>


                    <td className="mono">
                      {event.endpoint}
                    </td>


                    <td>
                      {event.method}
                    </td>


                    <td>

                      <span
                        className={`effect ${
                          event.decision ===
                          "ALLOW"
                            ? "allow"
                            : "deny"
                        }`}
                      >
                        {event.decision}
                      </span>

                    </td>


                    <td>

                      {event.policyId
                        ? `#${event.policyId}`
                        : "None"}

                    </td>

                  </tr>

                ))}

            </tbody>

          </table>


          {filteredEvents.length === 0 && (

            <div className="empty-state">

              No events match the selected filter.

            </div>

          )}

        </div>

      </section>

    </section>
  );
}


/* ============================================================
   DECISION FIELD
============================================================ */

function DecisionField({
  label,
  value,
}) {

  return (

    <div className="decision-field">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>

  );
}


/* ============================================================
   FORM FIELD
============================================================ */

function FormField({
  label,
  value,
  onChange,
  placeholder,
}) {

  return (

    <div className="form-group">

      <label>
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        required
      />

    </div>

  );
}


/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon,
  label,
  value,
  detail,
}) {

  return (

    <div className="stat-card">

      <div className="stat-icon">
        {icon}
      </div>


      <div className="stat-info">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

        <small>
          {detail}
        </small>

      </div>

    </div>

  );
}


/* ============================================================
   SERVICE NODE
============================================================ */

function ServiceNode({
  name,
  status,
  icon,
}) {

  return (

    <div className="service-node">

      <div className="service-icon">
        {icon || <Server size={18} />}
      </div>


      <strong>
        {name}
      </strong>


      <span>

        <i></i>

        {status}

      </span>

    </div>

  );
}



/* ============================================================
   LOGIN PAGE
============================================================ */

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoginLoading(true);

      const response = await axios.post(
        `${API}/auth/login`,
        { email, password }
      );

      onLogin(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Invalid email or password."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="dse-login-page">
      <div className="dse-login-card">
        <div className="dse-login-brand">
          <div className="dse-login-icon">
            <ShieldCheck size={32} />
          </div>

          <h1>DSE</h1>
          <p>Dynamic Security Enforcement</p>
        </div>

        <div className="dse-login-heading">
          <h2>Sign in</h2>
          <p>Access the DSE Security Control Plane</p>
        </div>

        <form className="dse-login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="login-form-group">
            <label>Password</label>

            <div className="login-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="dse-login-error">
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="dse-login-button"
            disabled={loginLoading}
          >
            {loginLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="dse-login-footer">
          <span>Protected Security Console</span>
          <span>DSE</span>
        </div>
      </div>
    </div>
  );
}

export default App;