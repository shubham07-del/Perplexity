import { useDispatch } from "react-redux";
import { setError, setLoading, setUser } from "../auth.slice";
import {
  getMe,
  googleLogin,
  login,
  logout,
  register,
} from "../services/auth.api";
import { toast } from "react-toastify";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ username, email, password }) {
    try {
      dispatch(setError(null));
      const data = await register({ username, email, password });
      dispatch(setUser(data.user));
      toast.success("Account created successfully");
      return true;
    } catch (err) {
      const validationError = err.response?.data?.errors?.[0]?.message;
      const errMsg =
        validationError ||
        err.response?.data?.message ||
        err.response?.data?.err ||
        "Registration failed.";
      dispatch(setError(errMsg));
      toast.error(errMsg);
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function handleLogin({ email, password }) {
    try {
      dispatch(setError(true));
      const data = await login({ email, password });
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      dispatch(setUser(data.user));
      toast.success("Login successful 😊");
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Login failed.";
      dispatch(setError(errMsg));
      toast.error(errMsg);
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function handleGetMe() {
    try {
      dispatch(setError(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (err) {
      dispatch(
        setError(err.response?.data?.message || "User fetching failed."),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function handleLogout() {
    try {
      dispatch(setLoading(true));
      await logout();
      localStorage.removeItem("token");
      dispatch(setUser(null));
      toast.success("Logged out successfully");
    } catch (err) {
      const errMsg = err.response?.data?.message || "Logout failed.";
      dispatch(setError(errMsg));
      toast.error(errMsg);
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGoogleLogin(credential) {
    try {
      dispatch(setLoading(true));

      const data = await googleLogin(credential);

      dispatch(setUser(data.user));

      toast.success("Login successful 😊");

      return true;
    } catch (error) {
      const errMsg = error.response?.data?.message || "Google login failed.";

      toast.error(errMsg);

      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }
  return {
    handleGetMe,
    handleLogin,
    handleRegister,
    handleLogout,
    handleGoogleLogin,
  };
}
