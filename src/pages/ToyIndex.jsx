import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toyService } from '../services/toy.service.js'
import { ToyList } from '../cmps/ToyList.jsx'
import { ToyFilter } from '../cmps/ToyFilter.jsx'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { loadToys, removeToy, removeToyOptimistic, saveToy } from '../store/actions/toy.actions.js'

export function ToyIndex() {
    const toys = useSelector(store => store.toyModule.toys)
    const filterBy = useSelector(store => store.toyModule.filterBy)
    const isLoading = useSelector(store => store.toyModule.isLoading)
    const prevFilterByRef = useRef(null)

    useEffect(() => {
        const currentFilterByStr = JSON.stringify(filterBy)
        // Only load toys if filterBy actually changed (or on initial load)
        if (prevFilterByRef.current === null || prevFilterByRef.current !== currentFilterByStr) {
            prevFilterByRef.current = currentFilterByStr
            loadToys().catch(err => {
                showErrorMsg('Cannot load toys')
            })
        }
    }, [filterBy])

    function onRemoveToy(toyId) {
        removeToyOptimistic(toyId).then(() => {
            showSuccessMsg('Toy removed')
        })
            .catch(err => {
                showErrorMsg('Cannot remove toy')
            })
    }
    
    function onAddToy() {
        const toy = toyService.getRandomtoy()
        saveToy(toy).then(() => {
            showSuccessMsg(`Toy added(toy name: ${toy.name})`)
        })
            .catch(err => {
                showErrorMsg('Cannot add toy')
            })
    }
    function onEditToy(toy) {
        const price = prompt('Enter new price', toy.price)
        const name = prompt('Enter new name', toy.name)
        const toyToSave = { ...toy, price: price, name: name }
        saveToy(toyToSave).then(() => {
            showSuccessMsg(`Toy updated(toy name: ${toyToSave.name})`)
        })
            .catch(err => {
                showErrorMsg('Cannot update toy')
            })
    }
    return (
        <div className="toy-index">
            <h3>Toy List</h3>
            <button onClick={onAddToy}>Add Toy</button>
            <ToyFilter filterBy={filterBy} />
            {toys.length === 0 && <div>No toys to display</div>}
            {toys.length > 0 &&
                !isLoading ? <ToyList
                toys={toys}
                onRemoveToy={onRemoveToy}
                onEditToy={onEditToy} />
                : <div>Loading...</div>}
        </div>
    )
}