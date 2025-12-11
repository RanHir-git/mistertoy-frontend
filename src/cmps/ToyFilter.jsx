import { useEffect, useRef, useState } from "react"
import { utilService } from "../services/util.service.js"
import { setFilterBy } from "../store/actions/toy.actions.js"
import '../assets/style/cmps/ToyFilter.css'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'

const LABELS = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle',
    'Outdoor', 'Battery Powered']

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        className: 'toy-filter-multiselect-menu',
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 200, // Smaller width for filter
        },
    },
}

function getMenuItemProps(name, selectedLabels, theme) {
    const isSelected = selectedLabels.includes(name)
    return {
        className: isSelected ? 'menu-item-selected' : 'menu-item-unselected',
        style: {
            fontWeight: isSelected
                ? theme.typography.fontWeightMedium
                : theme.typography.fontWeightRegular,
        },
    }
}


export function ToyFilter({ filterBy: filterByProp }) {
    const theme = useTheme()
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
            // Handle Material-UI multiselect - value is already an array
            value = typeof value === 'string' ? value.split(',') : value
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

                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="inStock-select-label">In Stock</InputLabel>
                        <Select
                            labelId="inStock-select-label"
                            id="inStock-select"
                            name="inStock"
                            value={getInStockValue()}
                            label="In Stock"
                            onChange={handleChange}
                            MenuProps={{
                                PaperProps: {
                                    className: 'toy-filter-instock-menu',
                                },
                            }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="inStock">In Stock</MenuItem>
                            <MenuItem value="outOfStock">Out of Stock</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <FormControl sx={{ width: '100%' }} className="toy-filter-multiselect">
                    <InputLabel id="filter-labels-chip-label">Labels</InputLabel>
                    <Select
                        labelId="filter-labels-chip-label"
                        id="filter-labels-chip"
                        multiple
                        name="labels"
                        value={filterBy.labels || []}
                        onChange={handleChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Labels" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {LABELS.map((label) => (
                            <MenuItem
                                key={label}
                                value={label}
                                {...getMenuItemProps(label, filterBy.labels || [], theme)}
                            >
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </form>
        </div>
    )
}