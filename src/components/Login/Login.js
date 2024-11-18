import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Ensure you have the CSS file for styling


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Hardcoded credentials
    const validUsername = "user";
    const validPassword = "pw";

    if (username === validUsername && password === validPassword) {
      setError("");
      navigate("/home");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-page">
      <div className="logo-section">
        <img src="/algolingo_logo.png" alt="Logo" className="logo" />
      </div>

      <h1 className="app-title">AlgoLingo</h1>

      <form className="login-form" onSubmit={handleLogin}>
        <h1>Login</h1>
        <div className="input-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button"> 
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;


// function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     // Hardcoded credentials
//     const validUsername = "user";
//     const validPassword = "pw";

//     if (username === validUsername && password === validPassword) {
//       setError("");
//       navigate("/home");
//     } else {
//       setError("Invalid username or password");
//     }
//   };

//   return (
//     <div className="login-page">
//       {/* Logo section */}
//       <div className="logo-section">
//         <img src="algolingo_logo.png" alt="Logo" className="logo" />
//       </div>

//       {/* Login form */}
//       <div className="login-form">
//         <h1>Login</h1>
//         <div className="input-group">
//           <label>Username:</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Enter your username"
//           />
//         </div>
//         <div className="input-group">
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your password"
//           />
//         </div>
//         {error && <p className="error-message">{error}</p>}
//         <button onClick={handleLogin} className="login-button">
//           Login
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Login;



