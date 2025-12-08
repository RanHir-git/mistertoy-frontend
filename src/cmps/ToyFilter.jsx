import { useEffect, useRef, useState } from "react"
import { utilService } from "../services/util.service.js"
import { setFilterBy } from "../store/actions/toy.actions.js"

const LABELS = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle',
    'Outdoor', 'Battery Powered']

export function ToyFilter({ filterBy: filterByProp }) {
    const [filterBy, setFilterByState] = useState({ ...filterByProp })
    const isFormInputRef = useRef(false)
    const prevFilterByPropRef = useRef(filterByProp)

    // Debounced function to dispatch filter changes to store
    const debouncedSetFilter = useRef(
        utilService.debounce((filterBy) => {
            setFilterBy(filterBy)
        }, 300)
    )

    useEffect(() => {
        const hasChanged = JSON.stringify(prevFilterByPropRef.current) !== JSON.stringify(filterByProp)
        prevFilterByPropRef.current = filterByProp
        
        if (!isFormInputRef.current && hasChanged) {
            setFilterByState({ ...filterByProp })
        }
        isFormInputRef.current = false
    }, [filterByProp])

    useEffect(() => {
        if (isFormInputRef.current) {
            debouncedSetFilter.current(filterBy)
        }
    }, [filterBy])

    function handleChange({ target }) {
        isFormInputRef.current = true
        let { value, name: field, type } = target
        
        if (field === 'inStock') {
            // Handle In Stock filter: 'all' = undefined, 'inStock' = true, 'outOfStock' = false
            if (value === 'all') {
                value = undefined
            } else if (value === 'inStock') {
                value = true
            } else if (value === 'outOfStock') {
                value = false
            }
        } else if (field === 'labels') {
            // Handle multiselect
            const selectedOptions = Array.from(target.selectedOptions, option => option.value)
            // If "All" is selected, clear all labels (disable filtering)
            if (selectedOptions.includes('all')) {
                value = []
            } else {
                value = selectedOptions
            }
        } else if (type === 'number') {
            value = +value
        }
        
        setFilterByState(prevFilterBy => ({ ...prevFilterBy, [field]: value }))
    }

    function getInStockValue() {
        if (filterBy.inStock === undefined) return 'all'
        if (filterBy.inStock === true) return 'inStock'
        if (filterBy.inStock === false) return 'outOfStock'
        return 'all'
    }

    return (
        <div className="toy-filter">
            <h2>Filter</h2>
            <form onSubmit={(ev) => ev.preventDefault()}>
                <label htmlFor="txt">Search By Name:</label>
                <input 
                    type="text" 
                    name="txt" 
                    placeholder="Search..." 
                    value={filterBy.txt || ''} 
                    onChange={handleChange} 
                />
                
                <label htmlFor="inStock">In Stock:</label>
                <select 
                    name="inStock" 
                    value={getInStockValue()} 
                    onChange={handleChange}
                >
                    <option value="all">All</option>
                    <option value="inStock">In Stock</option>
                    <option value="outOfStock">Out of Stock</option>
                </select>
                
                <label htmlFor="labels">Labels:</label>
                <select 
                    name="labels" 
                    multiple 
                    value={filterBy.labels && filterBy.labels.length > 0 ? filterBy.labels : []} 
                    onChange={handleChange}
                    style={{ minHeight: '100px' }}
                >
                    <option value="all">All Labels</option>
                    {LABELS.map(label => (
                        <option key={label} value={label}>{label}</option>
                    ))}
                </select>
                <label htmlFor="sortBy">Sort By:</label>
                <select 
                    name="sortBy" 
                    value={filterBy.sortBy || 'name'} 
                    onChange={handleChange}
                >
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="createdAt">Created</option>
                </select>
            </form>
        </div>
    )
}