import { useOnlineStatus } from '../hooks/useOnlineStatus.js'

export function HomePage() {
    const isOnline = useOnlineStatus()

    return (
        <section className="home">
            <h1>Mister Toy</h1>
            
            {/* Online Status Indicator */}
            <div className={`online-status ${isOnline ? 'online' : 'offline'}`}>
                <span className="status-indicator"></span>
                {isOnline ? 'Online' : 'Offline'}
            </div>
        </section>
    )
}