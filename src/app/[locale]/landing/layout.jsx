export default function LandingLayout({ children }) {
    return (
      <div className="landing-layout">
        <header>
          <h1>Bienvenido a la sección de Landing</h1>
        </header>
        <main>{children}</main>
        <footer>
          <p>Todos los derechos reservados © 2025</p>
        </footer>
      </div>
    );
  }
  