import React, { useState } from "react";
import "./css/login.css"

function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [logEmail, setLogEmail] = useState("");
    const [logPassword, setLogPassword] = useState("");
    const [signName, setSignName] = useState("");
    const [signEmail, setSignEmail] = useState("");
    const [signPassword, setSignPassword] = useState("");
    const [logError, setLogError] = useState("");
    const [signError, setSignError] = useState("");

    // Remove any token if on login page
    React.useEffect(() => {
        localStorage.removeItem("token");
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLogError("");

        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: logEmail, password: logPassword }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = data.redirect;
        } else {
            setLogError(data.error || "Login failed");
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setSignError("");

        const response = await fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: signName, email: signEmail, password: signPassword }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = data.redirect;
        } else {
            setSignError(data.error || "Sign-up failed");
        }
    };
    return (
        <>
            <section className="SignLogContainer">
            {!isSignUp ? (
                <div className="SignLog">
                    <form onSubmit={handleLogin}>
                        <h2>Log In</h2>
                        <label>Email:</label>
                        <input type="email" placeholder="Email" value={logEmail} onChange={(e) => setLogEmail(e.target.value)} required />

                        <label>Password:</label>
                        <input type="password" placeholder="Password" value={logPassword} onChange={(e) => setLogPassword(e.target.value)} required/>

                        <button type="submit">Login</button>
                        
                        <p> Don't have an account?{" "}
                            <span onClick={() => setIsSignUp(true)} style={{ cursor: "pointer", color: "blue" }}> Sign up</span>
                        </p>
                    </form>
                    
                    {logError && <p className="errorMessage">{logError}</p>}
                </div>
            ) : (
                <div className="SignLog">
                    <form onSubmit={handleSignUp}>
                        <h2>Sign Up</h2>

                        <label>Name:</label>
                        <input type="text" placeholder="Name" value={signName} onChange={(e) => setSignName(e.target.value)} required/>

                        <label>Email:</label>
                        <input type="email" placeholder="Email" value={signEmail} onChange={(e) => setSignEmail(e.target.value)} required/>

                        <label>Password:</label>
                        <input type="password" placeholder="Password" value={signPassword} onChange={(e) => setSignPassword(e.target.value)} required/>

                        <button type="submit">Sign Up</button>

                        <p>
                            Have an account?{" "}
                            <span onClick={() => setIsSignUp(false)} style={{ cursor: "pointer", color: "blue" }}> Login </span>
                        </p>
                    </form>
                    {signError && <p className="errorMessage">{signError}</p>}
                </div>
            )}
            </section>
        </>
    );
}

export default Login;