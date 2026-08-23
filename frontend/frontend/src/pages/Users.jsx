import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Users.css";

function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedUser, setSelectedUser] = useState(null);

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again. No token found.");
        return;
      }

      const response = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users || []);
    } catch (err) {
      console.error("Users error:", err.response?.data || err.message);

      setError(
        err.response?.data?.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // COUNTS
  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) =>
      user.isActive !== false &&
      user.status !== "inactive"
  ).length;

  const administrators = users.filter((user) => {
    const role = String(user.role || "").toLowerCase();

    return role === "admin" || role === "administrator";
  }).length;

  const regularUsers = users.filter((user) => {
    const role = String(user.role || "user").toLowerCase();

    return role === "user";
  }).length;

  // FILTER
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = String(
        user.name || user.username || ""
      ).toLowerCase();

      const email = String(user.email || "").toLowerCase();

      const searchText = search.toLowerCase();

      const searchMatch =
        name.includes(searchText) ||
        email.includes(searchText);

      const role = String(
        user.role || "user"
      ).toLowerCase();

      let roleMatch = true;

      if (roleFilter === "Admin") {
        roleMatch =
          role === "admin" ||
          role === "administrator";
      }

      if (roleFilter === "User") {
        roleMatch = role === "user";
      }

      const isActive =
        user.isActive !== false &&
        user.status !== "inactive";

      let statusMatch = true;

      if (statusFilter === "Active") {
        statusMatch = isActive;
      }

      if (statusFilter === "Inactive") {
        statusMatch = !isActive;
      }

      return (
        searchMatch &&
        roleMatch &&
        statusMatch
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  // ROLE
  const getRole = (user) => {
    const role = String(
      user.role || "user"
    ).toLowerCase();

    if (
      role === "admin" ||
      role === "administrator"
    ) {
      return "Admin";
    }

    return "User";
  };

  // STATUS
  const getUserStatus = (user) => {
    const active =
      user.isActive !== false &&
      user.status !== "inactive";

    return active
      ? {
          text: "Active",
          className: "active",
        }
      : {
          text: "Inactive",
          className: "inactive",
        };
  };

  // DELETE
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) => user._id !== userId
        )
      );

      setSelectedUser(null);

      alert("User deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  // DATE
  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  // LOADING
  if (loading) {
    return (
      <div className="users-page">
        <div className="users-loading">
          <div className="loading-icon">👥</div>
          <h2>Loading Users...</h2>
          <p>Please wait while users are loading.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">

      <div className="users-container">

        {/* HEADER */}

        <header className="users-header">

          <div>
            <button
              className="back-dashboard"
              onClick={() =>
                navigate("/admin-dashboard")
              }
            >
              ← Back to Dashboard
            </button>

            <p className="users-eyebrow">
              ADMINISTRATION
            </p>

            <h1>Users</h1>

            <p className="users-subtitle">
              Manage system users and their access.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={fetchUsers}
          >
            🔄 Refresh
          </button>

        </header>

        {/* SUMMARY */}

        <section className="users-summary">

          <div className="user-summary-card">
            <div className="user-summary-icon blue">
              👥
            </div>

            <div>
              <span>Total Users</span>
              <strong>{totalUsers}</strong>
            </div>
          </div>

          <div className="user-summary-card">
            <div className="user-summary-icon green">
              🟢
            </div>

            <div>
              <span>Active Users</span>
              <strong>{activeUsers}</strong>
            </div>
          </div>

          <div className="user-summary-card">
            <div className="user-summary-icon purple">
              🔐
            </div>

            <div>
              <span>Administrators</span>
              <strong>{administrators}</strong>
            </div>
          </div>

          <div className="user-summary-card">
            <div className="user-summary-icon orange">
              👤
            </div>

            <div>
              <span>Regular Users</span>
              <strong>{regularUsers}</strong>
            </div>
          </div>

        </section>

        {/* TOOLBAR */}

        <section className="users-toolbar">

          <div className="user-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}
          </div>

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
          >
            <option value="All">
              All Roles
            </option>

            <option value="Admin">
              Administrators
            </option>

            <option value="User">
              Regular Users
            </option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>

        </section>

        {/* ERROR */}

        {error && (
          <div className="users-error">
            <span>⚠️ {error}</span>

            <button onClick={fetchUsers}>
              Try Again
            </button>
          </div>
        )}

        {/* USERS TABLE */}

        <section className="users-card">

          <div className="users-card-header">

            <div>
              <h2>All Users</h2>

              <p>
                Showing{" "}
                <strong>
                  {filteredUsers.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {users.length}
                </strong>{" "}
                users
              </p>
            </div>

          </div>

          {filteredUsers.length === 0 ? (

            <div className="empty-users">

              <div className="empty-user-icon">
                👥
              </div>

              <h3>No users found</h3>

              <p>
                Try changing your search or
                filter options.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setRoleFilter("All");
                  setStatusFilter("All");
                }}
              >
                Clear Filters
              </button>

            </div>

          ) : (

            <div className="users-table-wrapper">

              <table className="users-table">

                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredUsers.map((user) => {

                    const displayName =
                      user.name ||
                      user.username ||
                      "User";

                    const role =
                      getRole(user);

                    const status =
                      getUserStatus(user);

                    return (
                      <tr key={user._id}>

                        <td>
                          <div className="user-cell">

                            <div className="user-avatar">
                              {displayName
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {displayName}
                              </strong>

                              <span>
                                ID:{" "}
                                {user._id
                                  ? user._id.slice(-6)
                                  : "N/A"}
                              </span>
                            </div>

                          </div>
                        </td>

                        <td>
                          <span className="user-email">
                            {user.email || "—"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`role-badge ${
                              role === "Admin"
                                ? "admin"
                                : "user"
                            }`}
                          >
                            {role === "Admin"
                              ? "🔐 Admin"
                              : "👤 User"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`user-status ${status.className}`}
                          >
                            ● {status.text}
                          </span>
                        </td>

                        <td>
                          <div className="user-actions">

                            <button
                              className="view-user"
                              title="View user"
                              onClick={() =>
                                setSelectedUser(user)
                              }
                            >
                              👁️
                            </button>

                            <button
                              className="delete-user"
                              title="Delete user"
                              onClick={() =>
                                handleDelete(
                                  user._id
                                )
                              }
                            >
                              🗑️
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>

      {/* USER MODAL */}

      {selectedUser && (

        <div
          className="user-modal-overlay"
          onClick={() =>
            setSelectedUser(null)
          }
        >

          <div
            className="user-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedUser(null)
              }
            >
              ×
            </button>

            <div className="modal-avatar">
              {(
                selectedUser.name ||
                selectedUser.username ||
                "U"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <h2>
              {selectedUser.name ||
                selectedUser.username ||
                "User"}
            </h2>

            <p className="modal-email">
              {selectedUser.email ||
                "No email available"}
            </p>

            <div className="modal-details">

              <div>
                <span>User ID</span>

                <strong>
                  {selectedUser._id ||
                    "Not available"}
                </strong>
              </div>

              <div>
                <span>Role</span>

                <strong>
                  {getRole(selectedUser)}
                </strong>
              </div>

              <div>
                <span>Status</span>

                <strong>
                  {getUserStatus(
                    selectedUser
                  ).text}
                </strong>
              </div>

              <div>
                <span>Joined</span>

                <strong>
                  {formatDate(
                    selectedUser.createdAt
                  )}
                </strong>
              </div>

            </div>

            <button
              className="modal-done"
              onClick={() =>
                setSelectedUser(null)
              }
            >
              Done
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Users;