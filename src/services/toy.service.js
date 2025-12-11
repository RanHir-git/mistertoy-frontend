
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'

const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle',
    'Outdoor', 'Battery Powered']
const BASE_URL = 'toy/'


export const toyService = {
    query,
    getById,
    save,
    remove,
    getEmptytoy,
    getDefaultFilter,
    getRandomtoy,
    getToyColor
}


function query(filterBy = {}) {
    console.log('query:')
    
    // Transform frontend filterBy to backend format
    // Backend expects flat query parameters
    const params = {
        txt: filterBy.txt || '',
        labels: filterBy.labels && filterBy.labels.length > 0 ? filterBy.labels : undefined,
        inStock: filterBy.inStock !== undefined ? filterBy.inStock.toString() : undefined,
        sortBy: filterBy.sortBy || '',
        sortDir: filterBy.sortDir || 'asc'
    }
    
    // Remove undefined values
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key])
    
    return httpService.get(BASE_URL, params)
}

function getById(toyId) {
    return httpService.get(`${BASE_URL}${toyId}`)
}

function remove(toyId) {
    return httpService.delete(`${BASE_URL}${toyId}`)
}

function save(toy) {
    if (toy._id) {
        // Backend PUT endpoint is /api/toy (not /api/toy/:toyId)
        return httpService.put(BASE_URL, toy)
    } else {
        return httpService.post(BASE_URL, toy)
    }
}


function getEmptytoy() {
    return {
        price: '',
        name: '',
        inStock: false,
        imgUrl: '',
        labels: [],
        createdAt: ''
    }
}

function getRandomtoy() {
    const toy = getEmptytoy()
    // Don't assign _id - let the backend generate it when creating a new toy
    toy.price = utilService.getRandomIntInclusive(100, 900)
    toy.name = utilService.makeLorem(3)
    toy.inStock = Math.random() > 0.5
    toy.imgUrl = ''
    toy.labels = [labels[utilService.getRandomIntInclusive(0, labels.length - 1)]]
    toy.createdAt = new Date().toISOString()
    return toy
}


function getDefaultFilter() {
    return { txt: '', inStock: undefined, labels: [], sortBy: 'name', sortDir: 'asc' }
}

function getToyColor() {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
        '#F8B88B', '#AED6F1', '#A9DFBF', '#F9E79F'
    ]
    return colors[utilService.getRandomIntInclusive(0, colors.length - 1)]
}


