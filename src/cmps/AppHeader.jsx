import { Link, NavLink } from 'react-router-dom'

export function AppHeader() {
    return (
        <header className="app-header container">
            <section>
                <h1>Mister Toy</h1>
                <nav className="app-nav">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/toy">Toys</NavLink>
                </nav>
            </section>
        </header>
    )
}