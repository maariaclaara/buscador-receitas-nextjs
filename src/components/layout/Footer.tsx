export default function Footer() {
  return (
    <footer className="siteFooter">
      <div className="footerInner">
        <span className="footerText">
          © {new Date().getFullYear()} Buscador de Receitas. Todos os direitos reservados.
        </span>
      </div>
    </footer>
  );
}