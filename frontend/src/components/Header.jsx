import logo from "../assets/logo.gif"

export function Header() {
    return (
        <header className="header">
            <img src={logo} alt="Logo"  className="logo-header"/>

            <div className="header-titulo">
                <h1>Eclipse</h1>
                <h2>Predicción meteorológica</h2>
            </div>
        </header>
    )
}