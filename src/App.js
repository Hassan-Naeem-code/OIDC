import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user?.length !== 0) {
      setLoading(true);
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [user]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <h2 className="mb-4 text-center">React Google Login</h2>

      {loading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : profile ? (
        <div
          className="card text-center p-4 shadow-sm"
          style={{ maxWidth: "400px" }}
        >
          <img
            src={profile.picture}
            alt="User"
            className="rounded-circle mx-auto mb-3"
            style={{ width: "100px", height: "100px" }}
          />
          <h4>{profile.name}</h4>
          <p className="text-muted mb-3">{profile.email}</p>
          <button className="btn btn-danger" onClick={logOut}>
            Log out
          </button>
        </div>
      ) : (
        <button
          className="btn btn-primary btn-lg"
          onClick={() => login()}
          style={{
            backgroundColor: "#4285F4",
            borderColor: "#4285F4",
          }}
        >
          Sign in with Google 🚀
        </button>
      )}
    </div>
  );
}

export default App;
