import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Formik, Form, Field, useFormikContext } from 'formik'
import * as Yup from 'yup'
import { toyService } from "../services/toy.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { saveToy } from '../store/actions/toy.actions.js'
import { useConfirmTabClose } from '../hooks/useConfirmTabClose.js'
import '../assets/style/pages/ToyEdit.css'
import Button from '@mui/material/Button'
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

const ToySchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be at most 50 characters')
        .required('Name is required'),
    price: Yup.number()
        .min(1, 'Price must be at least 1')
        .max(10000, 'Price must be at most 10000')
        .required('Price is required'),
    imgUrl: Yup.string()
        .test('is-url-or-empty', 'Must be a valid URL', function(value) {
            if (!value || value === '') return true
            return Yup.string().url().isValidSync(value)
        }),
})

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        className: 'toy-edit-multiselect-menu',
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
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

function ToyEditFormContent({ originalToyRef, setHasUnsavedChanges, theme }) {
    const { errors, touched, values, setFieldValue } = useFormikContext()
    
    // Check if form has unsaved changes and update the hook
    useEffect(() => {
        if (!originalToyRef.current) return
        
        const hasChanges = JSON.stringify(values) !== JSON.stringify(originalToyRef.current)
        setHasUnsavedChanges(hasChanges)
    }, [values, setHasUnsavedChanges, originalToyRef])

    return (
        <Form>
            <label htmlFor="name">Name:</label>
            <Field name="name" id="name" type="text" />
            {errors.name && touched.name && (
                <div className='errors'>{errors.name}</div>
            )}

            <label htmlFor="price">Price:</label>
            <Field name="price" id="price" type="number" />
            {errors.price && touched.price && (
                <div className='errors'>{errors.price}</div>
            )}

            <label htmlFor="inStock">In Stock:</label>
            <Field name="inStock" id="inStock" type="checkbox" />

            <label htmlFor="imgUrl">Image URL:</label>
            <Field name="imgUrl" id="imgUrl" type="text" />
            {errors.imgUrl && touched.imgUrl && (
                <div className='errors'>{errors.imgUrl}</div>
            )}

            <FormControl sx={{ width: '100%' }} className="toy-edit-multiselect">
                <InputLabel id="labels-chip-label">Labels</InputLabel>
                <Select
                    labelId="labels-chip-label"
                    id="labels-chip"
                    multiple
                    name="labels"
                    value={values.labels || []}
                    onChange={(e) => {
                        const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value
                        setFieldValue('labels', value)
                    }}
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
                            {...getMenuItemProps(label, values.labels || [], theme)}
                        >
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <div className="button-group">
                <Button variant="contained" color="success" type="submit">Save</Button>
                <Button variant="contained" color="error" component={Link} to="/toy">Cancel</Button>
            </div>
        </Form>
    )
}

export function ToyEdit() {
    const theme = useTheme()
    const setHasUnsavedChanges = useConfirmTabClose()
    const originalToyRef = useRef(null)

    const [toyToEdit, setToyToEdit] = useState(() => {
        const emptyToy = toyService.getEmptytoy()
        return emptyToy
    })
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.toyId) loadToy()
        else {
            // For new toy, set original to empty toy
            const emptyToy = toyService.getEmptytoy()
            originalToyRef.current = JSON.parse(JSON.stringify(emptyToy))
        }
    }, [params.toyId])

    function loadToy() {
        toyService.getById(params.toyId)
            .then(toy => {
                setToyToEdit(toy)
                // Store original toy for comparison
                originalToyRef.current = JSON.parse(JSON.stringify(toy))
            })
            .catch(err => console.log('err:', err))
    }

    function onSaveToy(values) {
        saveToy(values)
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
            <Formik
                initialValues={{
                    name: name || '',
                    price: price || '',
                    inStock: inStock || false,
                    imgUrl: imgUrl || '',
                    labels: labels || [],
                }}
                validationSchema={ToySchema}
                onSubmit={onSaveToy}
                enableReinitialize={true}
            >
                <ToyEditFormContent 
                    originalToyRef={originalToyRef}
                    setHasUnsavedChanges={setHasUnsavedChanges}
                    theme={theme}
                />
            </Formik>
        </section>
    )
}