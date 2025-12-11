import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toyService } from '../services/toy.service.js'
import { ToyList } from '../cmps/ToyList.jsx'
import { ToyFilter } from '../cmps/ToyFilter.jsx'
import { AddToy } from '../cmps/AddToy.jsx'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { loadToys, removeToy, removeToyOptimistic, saveToy, setFilterBy } from '../store/actions/toy.actions.js'

export function ToyIndex() {
    const toys = useSelector(store => store.toyModule.toys)
    const filterBy = useSelector(store => store.toyModule.filterBy)
    const isLoading = useSelector(store => store.toyModule.isLoading)
    const prevFilterByRef = useRef(null)
    const navigate = useNavigate()
    const [isAddToyModalOpen, setIsAddToyModalOpen] = useState(false)

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

    function onAddRandomToy() {
        const toy = toyService.getRandomtoy()
        saveToy(toy).then(() => {
            showSuccessMsg(`Toy added(toy name: ${toy.name})`)
        })
            .catch(err => {
                showErrorMsg('Cannot add toy')
            })
    }

    function onAddToy() {
        setIsAddToyModalOpen(true)
    }

    function onEditToy(toy) {
        navigate(`/toy/edit/${toy._id}`)
    }

    function onSort(field) {
        const newSortBy = field
        const newSortDir = filterBy.sortBy === field && filterBy.sortDir === 'asc' ? 'desc' : 'asc'
        setFilterBy({ sortBy: newSortBy, sortDir: newSortDir })
    }

    function getSortArrow(field) {
        if (filterBy.sortBy !== field) return '↕'
        return filterBy.sortDir === 'asc' ? '↑' : '↓'
    }

    return (
        <div className="toy-index">
            <h3>Toy List</h3>
            
            <ToyFilter filterBy={filterBy} />
            <div className="sortable-headers" >
                <button 
                    onClick={() => onSort('name')}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontSize: '16px',
                        fontWeight: filterBy.sortBy === 'name' ? 'bold' : 'normal',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    Name <span>{getSortArrow('name')}</span>
                </button>
                <button 
                    onClick={() => onSort('price')}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontSize: '16px',
                        fontWeight: filterBy.sortBy === 'price' ? 'bold' : 'normal',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    Price <span>{getSortArrow('price')}</span>
                </button>
                <button 
                    onClick={() => onSort('createdAt')}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontSize: '16px',
                        fontWeight: filterBy.sortBy === 'createdAt' ? 'bold' : 'normal',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    Created <span>{getSortArrow('createdAt')}</span>
                </button>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button onClick={onAddRandomToy}>Add Random Toy</button>
                <button onClick={onAddToy}>Add Toy</button>
            </div>
            {toys.length === 0 && <div>No toys to display</div>}
            {toys.length > 0 &&
                !isLoading ? <ToyList
                toys={toys}
                onRemoveToy={onRemoveToy}
                onEditToy={onEditToy} />
                : <div>Loading...</div>}
            
            <AddToy 
                isOpen={isAddToyModalOpen}
                onClose={() => setIsAddToyModalOpen(false)}
            />
        </div>
    )
}