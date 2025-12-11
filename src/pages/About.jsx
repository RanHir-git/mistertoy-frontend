import { GoogleMap } from '../cmps/maps.jsx'

export function About() {
    return (
        <section className="about">
            <div className="about-content">
                <h1>About Mister Toy</h1>
                <p>
                    Welcome to Mister Toy! We are your one-stop shop for all your toy needs. 
                    Whether you're looking for the latest action figures, educational toys, 
                    or classic board games, we've got something special for everyone.
                </p>
                <p>
                    Visit us at our store location shown on the map below, or browse our 
                    online catalog to find the perfect toy for your loved ones.
                </p>
            </div>
            <GoogleMap />
        </section>
    )
}

