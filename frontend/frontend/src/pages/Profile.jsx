import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("User data error:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="profile-page">

      <header className="profile-header">

        <div className="profile-brand">
          <div className="profile-logo">
            🚗
          </div>

          <div>
            <h2>Vehicle Management</h2>
            <span>My Profile</span>
          </div>
        </div>

        <button
          className="profile-back-button"
          onClick={() => navigate("/user-dashboard")}
        >
          ← Dashboard
        </button>

      </header>

      <main className="profile-main">

        <section className="profile-card">

          <div className="profile-avatar">
            {(user?.name || user?.username || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <h1>
            {user?.name || user?.username || "User"}
          </h1>

          <p>
            {user?.email || "Email not available"}
          </p>

          <div className="profile-details">

            <div className="profile-item">
              <span>Name</span>
              <strong>
                {user?.name || user?.username || "Not available"}
              </strong>
            </div>

            <div className="profile-item">
              <span>Email</span>
              <strong>
                {user?.email || "Not available"}
              </strong>
            </div>

            <div className="profile-item">
              <span>Role</span>
              <strong>
                {user?.role || "User"}
              </strong>
            </div>

            <div className="profile-item">
              <span>Status</span>
              <strong className="active">
                ● Active
              </strong>
            </div>

          </div>

          <button
            className="profile-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </section>

      </main>

    </div>
  );
}

export default Profile;