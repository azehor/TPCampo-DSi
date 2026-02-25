// src/pages/login/login.tsx
import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { login } from "../../services/authService";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const [iniciandoSesion, setIniciandoSesion] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (iniciandoSesion) return;

    setIntentoEnvio(true);

    if (!email.trim() || !password.trim()) {
      return;
    }

    try {
      setIniciandoSesion(true);
      await login(email, password);
      navigate("/actividades-idi/trabajos-publicados");
    } catch (err) {
      setError("Credenciales incorrectas");
    } finally {
      setIniciandoSesion(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>

          {error && <p className="error">{error}</p>}

          <label>Correo Electrónico *</label>
          <input
            type="text"
            placeholder="usuario@ejemplo.com"
            value={email}
            required
            className={intentoEnvio && !email.trim() ? "input-error" : ""}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />
          {intentoEnvio && !email.trim() && <p className="helper-text">Campo obligatorio</p>}

          <label>Contraseña *</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              required
              className={intentoEnvio && !password.trim() ? "input-error" : ""}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />

            <span
              className="toggle-pass"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                /* OJO CERRADO (versión más chica para que no se corte) */
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="gray"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 2 12 2 12a19.8 19.8 0 0 1 5.06-6.94" />
                  <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                /* OJO ABIERTO */
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="gray"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </span>
          </div>
          {intentoEnvio && !password.trim() && <p className="helper-text">Campo obligatorio</p>}

          <button type="submit" disabled={iniciandoSesion}>
            {iniciandoSesion ? (
              <>
                <span className="button-spinner" aria-hidden="true" />
                Iniciando sesión...
              </>
            ) : (
              "Acceder"
            )}
          </button>

          <a className="recover-link" href="#">
            Recuperar Clave
          </a>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
