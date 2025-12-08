import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toyService } from "../services/toy.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { saveToy } from '../store/actions/toy.actions.js'
import { useConfirmTabClose } from '../hooks/useConfirmTabClose.js'

const LABELS = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle',
    'Outdoor', 'Battery Powered']

export function ToyEdit() {
    const setHasUnsavedChanges = useConfirmTabClose()
    const originalToyRef = useRef(null)

    const [toyToEdit, setToyToEdit] = useState(() => {
        const emptyToy = toyService.getEmptytoy()
        // Ensure inStock is boolean for checkbox
        emptyToy.inStock = Boolean(emptyToy.inStock)
        return emptyToy
    })
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.toyId) loadToy()
        else {
            // For new toy, set original to empty toy
            const emptyToy = toyService.getEmptytoy()
            emptyToy.inStock = Boolean(emptyToy.inStock)
            originalToyRef.current = JSON.parse(JSON.stringify(emptyToy))
        }
    }, [params.toyId])

    function loadToy() {
        toyService.getById(params.toyId)
            .then(toy => {
                // Ensure inStock is boolean
                toy.inStock = Boolean(toy.inStock)
                setToyToEdit(toy)
                // Store original toy for comparison
                originalToyRef.current = JSON.parse(JSON.stringify(toy))
            })
            .catch(err => console.log('err:', err))
    }

    // Check if form has unsaved changes and update the hook
    useEffect(() => {
        if (!originalToyRef.current) return
        
        const hasChanges = JSON.stringify(toyToEdit) !== JSON.stringify(originalToyRef.current)
        setHasUnsavedChanges(hasChanges)
    }, [toyToEdit, setHasUnsavedChanges])

    function handleChange({ target }) {
        const field = target.name
        let value

        if (field === 'labels') {
            value = Array.from(target.selectedOptions, option => option.value)
        } else if (target.type === 'number') {
            value = +target.value || 0
        } else if (target.type === 'checkbox') {
            value = target.checked
        } else {
            value = target.value
        }

        setToyToEdit(prevToyToEdit => ({ ...prevToyToEdit, [field]: value }))
    }

    function onSaveToy(ev) {
        ev.preventDefault()
        saveToy(toyToEdit)
            .then((savedToy) => {
                // Clear unsaved changes flag before navigating
                setHasUnsavedChanges(false)
                originalToyRef.current = JSON.parse(JSON.stringify(savedToy))
                navigate('/toy')
                showSuccessMsg(`Toy Saved (id: ${savedToy._id})`)
            })
            .catch(err => {
                showErrorMsg('Cannot save toy')
                console.log('errddd:', err)
            })
    }

    const { name, price, inStock, imgUrl, labels } = toyToEdit
    return (
        <section className="toy-edit">
            <form onSubmit={onSaveToy} >
                <label htmlFor="name">Name:</label>
                <input onChange={handleChange} value={name} type="text" name="name" id="name" />

                <label htmlFor="price">Price:</label>
                <input onChange={handleChange} value={price} type="number" name="price" id="price" />

                <label htmlFor="inStock">In Stock:</label>
                <input onChange={handleChange} checked={inStock} type="checkbox" name="inStock" id="inStock" />

                <label htmlFor="imgUrl">Image URL:</label>
                <input onChange={handleChange} value={imgUrl} type="text" name="imgUrl" id="imgUrl" />

                <label htmlFor="labels">Labels:</label>
                <select onChange={handleChange} value={labels} name="labels" id="labels" multiple={true}>
                    {LABELS.map(label => (
                        <option key={label} value={label}>{label}</option>
                    ))}
                </select>

                <button>Save</button>
            </form>
        </section>
    )
}