import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toyService } from "../services/toy.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"
import { NicePopup } from "../cmps/NicePopup.jsx"
import { Chat } from "../cmps/Chat.jsx"

export function ToyDetails() {

    const [toy, setToy] = useState(null)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadToy()
    }, [params.toyId])


    function loadToy() {
        toyService.getById(params.toyId)
            .then(setToy)
            .catch(err => {
                console.error('err:', err)
                showErrorMsg('Cannot load toy')
                navigate('/toy')
            })
    }

    function onBack() {
        // If nothing to do here, better use a Link
        navigate('/toy')
        // navigate(-1)
    }

    if (!toy) return <div>Loading...</div>
    return (
        <section className="toy-details">
            <h1>Toy name: {toy.name}</h1>
            <h2>Toy is {(toy.inStock > 0)? 'In Stock' : 'Out of Stock'}</h2>
            <h2>Labels: {toy.labels.join(', ')}</h2>
            <h2>Created At: {toy.createdAt}</h2>
            <h1>Toy price: {toy.price}</h1>
            <img src={toy.imgUrl} alt={toy.name} width="200" height="200" />
            <button onClick={onBack}>Back to list</button>
            
            {/* Chat icon button - opens the popup */}
            <button 
                className="chat-icon-btn"
                onClick={() => setIsChatOpen(true)}
                title="Open chat"
            >
                💬 Chat
            </button>
            
            {/* NicePopup with Chat component inside */}
            <NicePopup
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                heading="Chat about this toy"
                footing="Type your message and press Enter"
            >
                <Chat />
            </NicePopup>
        </section>
    )
}