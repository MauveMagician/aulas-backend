"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log("Sending POST request to /api/signup with username:", username);
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    console.log("Response status:", response.status);
    if (response.ok) {
      const newData = await response.json();
      console.log("Response data:", newData);
      setUsername("");
      setPassword("");
      alert(newData.message);
    } else {
      console.error("Failed to sign up");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    console.log("Sending POST request to /api/signin with username:", username);
    const response = await fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    console.log("Response status:", response.status);
    if (response.ok) {
      const newData = await response.json();
      console.log("Response data:", newData);
      setUsername("");
      setPassword("");
      document.cookie = `session=${newData.sessionId}; max-age=3600; path=/; SameSite=Strict; Secure`;
      document.cookie = `username=${username}; max-age=3600; path=/; SameSite=Strict; Secure`;
      setLoggedInUser(username);
      alert(newData.message);
    } else {
      console.error("Failed to sign in");
    }
  };

  const [showCookieConsent, setShowCookieConsent] = useState(true);

  const handleCookieConsent = (consent) => {
    setShowCookieConsent(false);
    if (consent) {
      // Set a cookie to remember the user's consent
      document.cookie = "cookieConsent=true; max-age=31536000; path=/; SameSite=Strict; Secure";
    } else {
      // Set a cookie to remember the user's refusal
      document.cookie = "cookieConsent=false; max-age=31536000; path=/";
    }
  };

  useEffect(() => {
    // Check if the cookie consent has already been given
    const consent = document.cookie.split("; ").find(row => row.startsWith("cookieConsent="));
    if (consent) setShowCookieConsent(false);

    // Check if the user is already logged in
    const usernameCookie = document.cookie.split("; ").find(row => row.startsWith("username="));
    if (usernameCookie) {
      const loggedInUsername = usernameCookie.split("=")[1];
      setLoggedInUser(loggedInUsername);
    }
  }, []);

  return (
    <div>
      {loggedInUser ? (
  <div>
    <div>Currently logged in as {loggedInUser}</div>
    <button onClick={() => {
      document.cookie = "session=; max-age=0; path=/; SameSite=Strict; Secure";
      document.cookie = "username=; max-age=0; path=/; SameSite=Strict; Secure";
      setLoggedInUser(null);
    }}>Logout</button>
  </div>
) : (
        <>
          <h2>Sign Up</h2>
          <form onSubmit={handleSignUp}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button type="submit">Sign Up</button>
          </form>
          <h2>Sign In</h2>
          <form onSubmit={handleSignIn}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button type="submit">Sign In</button>
          </form>
        </>
      )}
      {showCookieConsent && (
        <div className="cookie-consent">
          <p>We use cookies to improve your experience. By using our site, you agree to our use of cookies.</p>
          <button onClick={() => handleCookieConsent(true)}>Accept</button>
          <button onClick={() => handleCookieConsent(false)}>Refuse</button>
        </div>
      )}
    </div>
  );
}