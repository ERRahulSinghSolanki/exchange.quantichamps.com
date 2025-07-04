import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import chat from "assets/images/illustrations/chat.png";
import { API_URL } from "config";

function Illustration() {
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(null); // Clear previous errors

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success == 1) {
        const currentTime = new Date().getTime();
        const expirationTime = currentTime + 12 * 60 * 60 * 1000;

        // Store token, role, permissions in localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("permissions", JSON.stringify(data.permissions)); // Store permissions
        localStorage.setItem("loggedUserId", data.user.id);
        localStorage.setItem("LoggedUserEmail", data.user.email);
        localStorage.setItem("LoggedUserName", data.user.name);
        localStorage.setItem("loginExpiration", expirationTime);

        // Redirect to dashboard
        window.location.href = "/dashboards/default";
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IllustrationLayout
      title="Sign In"
      description="Enter your email and password to sign in"
      illustration={{
        image: chat,
        title: '"Attention is the new currency"',
        description: "The more effortless the writing looks, the more effort the writer actually put into the process.",
      }}
    >
      <SoftBox component="form" role="form" onSubmit={handleLogin}>
        <SoftBox mb={2}>
          <SoftInput
            type="text"
            placeholder="username"
            size="large"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftInput
            type="password"
            placeholder="Password"
            size="large"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </SoftBox>
        <SoftBox display="flex" alignItems="center">
          <Switch checked={rememberMe} onChange={handleSetRememberMe} disabled={loading} />
          <SoftTypography
            variant="button"
            fontWeight="regular"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            &nbsp;&nbsp;Remember me
          </SoftTypography>
        </SoftBox>

        {error && <SoftTypography color="error" variant="caption">{error}</SoftTypography>}

        <SoftBox mt={4} mb={1}>
          <SoftButton
            variant="gradient"
            type="submit"
            color="info"
            size="large"
            fullWidth
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </SoftButton>
        </SoftBox>
        <SoftBox mt={3} textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Don&apos;t have an account?{" "}
            <SoftTypography
              component={Link}
              to="/authentication/sign-up/illustration"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              Sign up
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </IllustrationLayout>
  );
}

export default Illustration;
