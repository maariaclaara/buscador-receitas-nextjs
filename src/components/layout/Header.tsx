import Link from "next/link";

export default function Header() {
  return (
    <header className="siteHeader">
      <div className="headerInner">
        <Link href="/" className="brand">
          <span className="brandTitle">Buscador de Receitas</span>
          <span className="brandSubtitle">Encontre suas receitas favoritas</span>
        </Link>

        <nav className="nav" aria-label="Navegação principal">
          <Link className="navLink" href="/">
            Buscar
          </Link>
        </nav>
      </div>
    </header>
  );
}