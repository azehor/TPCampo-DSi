import "./header.css";
import LogoUTN from "/UTN_logo.jpg";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img src={LogoUTN} alt="Logo UTN" className="header-logo" />

        <h1 className="header-title">
          SGMI - Sistema de Gestión de Memorias de Grupos y Centros de Investigación - UTN FRLP
        </h1>
      </div>
    </header>
  );
};

export default Header;