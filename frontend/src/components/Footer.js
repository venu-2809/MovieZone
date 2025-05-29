import React from "react";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => (
  <footer
    style={{
      background: "#181c24",
      color: "#b2bec3",
      padding: "2rem 0",
      textAlign: "center",
      borderRadius: "24px 24px 0 0",
      marginTop: "3rem",
      animation: "fadeInUp 0.7s",
    }}
  >
    <div style={{ marginBottom: "1rem" }}>
      <a href="#" style={{ color: "#00b894", margin: "0 1rem" }}>About</a>
      <a href="#" style={{ color: "#00b894", margin: "0 1rem" }}>Help</a>
      <a href="#" style={{ color: "#00b894", margin: "0 1rem" }}>Contact</a>
    </div>
    <div>
      <span style={{ margin: "0 0.5rem" }}>© {new Date().getFullYear()} CinemaOne</span>
      <span style={{ margin: "0 0.5rem" }}>|</span>
      <span style={{ margin: "0 0.5rem" }}>Follow us:</span>
      <FaTwitter style={{ margin: "0 0.5rem", color: "#00b894" }} />
      <FaInstagram style={{ margin: "0 0.5rem", color: "#00b894" }} />
      <FaLinkedin style={{ margin: "0 0.5rem", color: "#00b894" }} />
    </div>
  </footer>
);

export default Footer;