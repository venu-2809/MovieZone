import React, { useState } from "react";

const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        // Simulate async auth
        setTimeout(() => {
            setLoading(false);
            if (!form.email || !form.password || (isSignUp && !form.name)) {
                setError("Please fill in all required fields.");
                return;
            }
            if (isSignUp && form.password !== form.confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            // Success (simulate)
            alert(`${isSignUp ? "Sign Up" : "Sign In"} successful!`);
        }, 1200);
    };

    return (
        <div style={styles.bg}>
            <div style={styles.card}>
                <div style={styles.logoWrap}>
                    <span style={styles.logo}>🎬</span>
                    <h2 style={styles.title}>MovieZone</h2>
                </div>
                <h3 style={styles.heading}>
                    {isSignUp ? "Create your account" : "Welcome back"}
                </h3>
                <form style={styles.form} onSubmit={handleSubmit} autoComplete="off">
                    {isSignUp && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Name</label>
                            <input
                                style={styles.input}
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                autoFocus
                            />
                        </div>
                    )}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            style={styles.input}
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@email.com"
                            autoFocus={!isSignUp}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password"
                        />
                    </div>
                    {isSignUp && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Confirm Password</label>
                            <input
                                style={styles.input}
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm password"
                            />
                        </div>
                    )}
                    {error && <div style={styles.error}>{error}</div>}
                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : {}),
                        }}
                        disabled={loading}
                    >
                        {loading
                            ? isSignUp
                                ? "Signing Up..."
                                : "Signing In..."
                            : isSignUp
                            ? "Sign Up"
                            : "Sign In"}
                    </button>
                </form>
                <div style={styles.switchWrap}>
                    <span>
                        {isSignUp
                            ? "Already have an account?"
                            : "Don't have an account?"}
                    </span>
                    <button
                        style={styles.switchBtn}
                        onClick={() => {
                            setIsSignUp((prev) => !prev);
                            setForm({
                                name: "",
                                email: "",
                                password: "",
                                confirmPassword: "",
                            });
                            setError("");
                        }}
                        type="button"
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </div>
                <div style={styles.divider}>
                    <span style={styles.dividerText}>or</span>
                </div>
                <button style={styles.socialBtn} type="button" disabled>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
                        alt="Google"
                        style={styles.socialIcon}
                    />
                    Continue with Google
                </button>
            </div>
            <footer style={styles.footer}>
                &copy; {new Date().getFullYear()} MovieZone. All rights reserved.
            </footer>
        </div>
    );
};

const styles = {
    bg: {
        minHeight: "100vh",
        background:
            "linear-gradient(120deg, #232526 0%, #414345 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
    },
    card: {
        background: "#18191a",
        borderRadius: 18,
        boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
        padding: "2.5rem 2rem 2rem 2rem",
        width: 360,
        maxWidth: "90vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#fff",
        position: "relative",
    },
    logoWrap: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
    },
    logo: {
        fontSize: 34,
    },
    title: {
        fontWeight: 700,
        fontSize: 26,
        margin: 0,
        letterSpacing: 1,
    },
    heading: {
        fontWeight: 500,
        fontSize: 18,
        margin: "10px 0 22px 0",
        color: "#e0e0e0",
        letterSpacing: 0.5,
    },
    form: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
    },
    label: {
        fontSize: 13,
        color: "#b0b3b8",
        marginBottom: 2,
        fontWeight: 500,
    },
    input: {
        padding: "10px 12px",
        borderRadius: 7,
        border: "1px solid #333",
        background: "#232526",
        color: "#fff",
        fontSize: 15,
        outline: "none",
        transition: "border 0.2s",
    },
    error: {
        color: "#ff5252",
        background: "#2d1818",
        borderRadius: 6,
        padding: "7px 12px",
        fontSize: 13,
        marginTop: -6,
        marginBottom: 4,
        textAlign: "center",
    },
    button: {
        marginTop: 6,
        padding: "11px 0",
        borderRadius: 7,
        border: "none",
        background:
            "linear-gradient(90deg, #ff512f 0%, #dd2476 100%)",
        color: "#fff",
        fontWeight: 600,
        fontSize: 16,
        cursor: "pointer",
        transition: "background 0.2s, opacity 0.2s",
        boxShadow: "0 2px 8px rgba(221,36,118,0.15)",
    },
    buttonDisabled: {
        opacity: 0.7,
        cursor: "not-allowed",
    },
    switchWrap: {
        marginTop: 18,
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 14,
        color: "#b0b3b8",
    },
    switchBtn: {
        background: "none",
        border: "none",
        color: "#ff512f",
        fontWeight: 600,
        cursor: "pointer",
        fontSize: 14,
        textDecoration: "underline",
        padding: 0,
    },
    divider: {
        width: "100%",
        textAlign: "center",
        borderBottom: "1px solid #333",
        lineHeight: "0.1em",
        margin: "22px 0 18px 0",
        position: "relative",
    },
    dividerText: {
        background: "#18191a",
        color: "#b0b3b8",
        padding: "0 12px",
        fontSize: 13,
        position: "relative",
        top: 8,
    },
    socialBtn: {
        width: "100%",
        padding: "10px 0",
        borderRadius: 7,
        border: "1px solid #333",
        background: "#232526",
        color: "#fff",
        fontWeight: 500,
        fontSize: 15,
        cursor: "not-allowed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        opacity: 0.7,
    },
    socialIcon: {
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "#fff",
        objectFit: "cover",
    },
    footer: {
        marginTop: 32,
        color: "#b0b3b8",
        fontSize: 13,
        textAlign: "center",
        letterSpacing: 0.2,
    },
};

export default Auth;