import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { toyService } from '../services/toy.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { saveToy } from '../store/actions/toy.actions.js'
import { NicePopup } from './NicePopup.jsx'
import '../assets/style/pages/ToyEdit.css'

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

export function AddToy({ isOpen, onClose }) {
    const emptyToy = toyService.getEmptytoy()

    function onSaveToy(values, { resetForm }) {
        saveToy(values)
            .then((savedToy) => {
                resetForm() // Reset form using Formik's resetForm
                onClose() // Close modal
                showSuccessMsg(`Toy added (name: ${savedToy.name})`)
            })
            .catch(err => {
                showErrorMsg('Cannot add toy')
                console.log('err:', err)
            })
    }
    
    return (
        <NicePopup
            isOpen={isOpen}
            onClose={onClose}
            heading="Add New Toy"
        >
            <Formik
                initialValues={{
                    name: emptyToy.name || '',
                    price: emptyToy.price || '',
                    inStock: emptyToy.inStock || false,
                    imgUrl: emptyToy.imgUrl || '',
                    labels: emptyToy.labels || [],
                }}
                validationSchema={ToySchema}
                onSubmit={onSaveToy}
                enableReinitialize={true}
            >
                {({ errors, touched, values, setFieldValue }) => {
                    return (
                        <Form className="toy-form">
                            <label htmlFor="add-name">Name:</label>
                            <Field 
                                name="name" 
                                id="add-name"
                                type="text"
                            />
                            {errors.name && touched.name && (
                                <div className='errors'>{errors.name}</div>
                            )}

                            <label htmlFor="add-price">Price:</label>
                            <Field 
                                name="price" 
                                id="add-price"
                                type="number"
                            />
                            {errors.price && touched.price && (
                                <div className='errors'>{errors.price}</div>
                            )}

                            <label htmlFor="add-inStock" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <Field 
                                    name="inStock" 
                                    id="add-inStock" 
                                    type="checkbox"
                                    style={{ marginRight: '8px' }}
                                />
                                In Stock
                            </label>

                            <label htmlFor="add-imgUrl">Image URL:</label>
                            <Field 
                                name="imgUrl" 
                                id="add-imgUrl"
                                type="text"
                            />
                            {errors.imgUrl && touched.imgUrl && (
                                <div className='errors'>{errors.imgUrl}</div>
                            )}

                            <label htmlFor="add-labels">Labels:</label>
                            <Field 
                                name="labels"
                                as="select"
                                id="add-labels" 
                                multiple={true}
                                style={{ minHeight: '120px' }}
                                onMouseDown={(ev) => {
                                    if (ev.target.tagName === 'OPTION') {
                                        ev.preventDefault()
                                        ev.stopPropagation()
                                        const clickedLabel = ev.target.value
                                        const currentLabels = values.labels || []
                                        const isSelected = currentLabels.includes(clickedLabel)
                                        
                                        const newLabels = isSelected
                                            ? currentLabels.filter(l => l !== clickedLabel)
                                            : [...currentLabels, clickedLabel]
                                        
                                        setFieldValue('labels', newLabels)
                                        return false
                                    }
                                }}
                            >
                                {LABELS.map(label => (
                                    <option key={label} value={label}>{label}</option>
                                ))}
                            </Field>

                            <button type="submit">Save</button>
                        </Form>
                    )
                }}
            </Formik>
        </NicePopup>
    )
}

