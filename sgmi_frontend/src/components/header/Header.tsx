import "./header.css";
import LogoUTN from "/UTN_logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { Button, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useCurrentUser, isAdmin } from "../../hooks/useCurrentUser";

const Header = () => {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="header-content">
        <img src={LogoUTN} alt="Logo UTN" className="header-logo" />

        <h1 className="header-title">
          SGMI - Sistema de Gestión de Memorias de Grupos y Centros de Investigación - UTN FRLP
        </h1>

        <Box sx={{ ml: "auto", display: "flex", gap: 1, alignItems: "center" }}>
          {isAdmin(user) && (
            <Button
              startIcon={<AdminPanelSettingsIcon />}
              color="inherit"
              onClick={() => navigate("/admin-panel")}
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)"
                }
              }}
            >
              Panel Admin
            </Button>
          )}
          <Link to="/perfil" style={{ textDecoration: "none" }}>
            <Button
              startIcon={<AccountCircleIcon />}
              color="inherit"
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)"
                }
              }}
            >
              Mi Perfil
            </Button>
          </Link>
        </Box>
      </div>
    </header>
  );
};

export default Header;