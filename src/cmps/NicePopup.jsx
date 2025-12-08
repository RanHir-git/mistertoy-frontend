import { useEffect } from 'react'

export function NicePopup({ isOpen, onClose, heading, footing, children }) {
    
    // Handle ESC key press to close popup
    useEffect(() => {
        if (!isOpen) return
        
        function handleEscKey(event) {
            if (event.key === 'Escape') {
                onClose()
            }
        }
        
        document.addEventListener('keydown', handleEscKey)
        
        return () => {
            document.removeEventListener('keydown', handleEscKey)
        }
    }, [isOpen, onClose])
    
    if (!isOpen) return null
    
    // Handle backdrop click (clicking outside the popup content)
    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            onClose()
        }
    }
    
    return (
        <div 
            className="nice-popup-backdrop" 
            onClick={handleBackdropClick}
        >
            <div className="nice-popup-content">
                {heading && (
                    <header className="nice-popup-header">
                        <h2>{heading}</h2>
                        <button 
                            className="nice-popup-close-btn"
                            onClick={onClose}
                            aria-label="Close popup"
                        >
                            ×
                        </button>
                    </header>
                )}
                
                <main className="nice-popup-main">
                    {children}
                </main>
                
                {footing && (
                    <footer className="nice-popup-footer">
                        <p>{footing}</p>
                    </footer>
                )}
            </div>
        </div>
    )
}

