
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle',
    'Outdoor', 'Battery Powered']
const BASE_URL = 'toy/'
const STORAGE_KEY = 'toysDB'
_createToys()


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
    return storageService.query(STORAGE_KEY)
        .then(toys => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                toys = toys.filter(toy => {
                    const toyName = toy.name || ''
                    return regExp.test(toyName)
                })
            }

            if (filterBy.labels && filterBy.labels.length > 0) {
                toys = toys.filter(toy => {
                    return toy.labels && Array.isArray(toy.labels) && toy.labels.some(label => filterBy.labels.includes(label))
                })
            }

            // Handle inStock filter: undefined = all, true = in stock (> 0), false = out of stock (=== 0)
            if (filterBy.inStock !== undefined) {
                if (filterBy.inStock === true) {
                    toys = toys.filter(toy => (toy.inStock || 0) > 0)
                } else if (filterBy.inStock === false) {
                    toys = toys.filter(toy => (toy.inStock || 0) === 0)
                }
            }

            if (filterBy.sortBy) {
                switch (filterBy.sortBy) {
                    case 'name':
                        toys = toys.sort((toy1, toy2) => {
                            const name1 = toy1.name || ''
                            const name2 = toy2.name || ''
                            return name1.localeCompare(name2)
                        })
                        break
                    case 'price':
                        toys = toys.sort((toy1, toy2) => {
                            const price1 = toy1.price || 0
                            const price2 = toy2.price || 0
                            return price1 - price2
                        })
                        break
                    case 'createdAt':
                        toys = toys.sort((toy1, toy2) => {
                            const date1 = toy1.createdAt ? new Date(toy1.createdAt) : new Date(0)
                            const date2 = toy2.createdAt ? new Date(toy2.createdAt) : new Date(0)
                            return date1 - date2
                        })
                        break
                }
            }

            return toys
        })
}

function getById(toyId) {
    return storageService.get(STORAGE_KEY, toyId)

}
function remove(toyId) {
    return storageService.remove(STORAGE_KEY, toyId)
}

function save(toy) {
    if (toy._id) {
        return storageService.put(STORAGE_KEY, toy)
    } else {
        return storageService.post(STORAGE_KEY, toy)
    }
}


function getEmptytoy() {
    return {
        price: '',
        name: '',
        inStock: '',
        imgUrl: '',
        labels: [],
        createdAt: ''
    }
}

function getRandomtoy() {
    const toy = getEmptytoy()
    toy._id = utilService.makeId()
    toy.price = utilService.getRandomIntInclusive(1000, 9000)
    toy.name = utilService.makeLorem(10)
    toy.inStock = utilService.getRandomIntInclusive(0, 100)
    toy.imgUrl = 'https://via.placeholder.com/150'
    toy.labels = [labels[utilService.getRandomIntInclusive(0, labels.length - 1)]]
    toy.createdAt = new Date().toISOString()
    return toy
}


function getDefaultFilter() {
    return { txt: '', inStock: undefined, labels: [], sortBy: 'name' }
}

function getToyColor() {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
        '#F8B88B', '#AED6F1', '#A9DFBF', '#F9E79F'
    ]
    return colors[utilService.getRandomIntInclusive(0, colors.length - 1)]
}


function _createToy(name, price, inStock, imgUrl, labels) {
    const toy = getEmptytoy()
    toy._id = utilService.makeId()
    toy.name = name || utilService.makeLorem(10)
    toy.price = price || utilService.getRandomIntInclusive(1000, 9000)
    toy.inStock = inStock || utilService.getRandomIntInclusive(0, 100)
    toy.imgUrl = imgUrl || 'https://via.placeholder.com/150'
    toy.labels = labels || [labels[utilService.getRandomIntInclusive(0, labels.length - 1)]]
    toy.createdAt = new Date().toISOString()
    return toy
}

function _createToys() {
    let toys = utilService.loadFromStorage(STORAGE_KEY)
    if (!toys || !toys.length) {
        toys = [
            _createToy('Toy 1', 1000, 100, 'https://via.placeholder.com/150', ['On wheels','outdoor']),
            _createToy('Wood Car', 2000, 200, 'https://via.placeholder.com/150', ['On wheels','outdoor']),
            _createToy('Building Blocks', 3000, 300, 'https://via.placeholder.com/150', ['Box game','art']),
            _createToy('Art Set', 4000, 400, 'https://via.placeholder.com/150', ['Art']),
            _createToy('Baby Doll', 5000, 500, 'https://via.placeholder.com/150', ['Baby','doll']),
            _createToy('Puzzle', 6000, 600, 'https://via.placeholder.com/150', ['Puzzle','art']),
            _createToy('Outdoor Toys', 7000, 700, 'https://via.placeholder.com/150', ['Outdoor','art']),
            _createToy('Battery Powered Toys', 8000, 800, 'https://via.placeholder.com/150', ['Battery Powered','art'])
        ]
        utilService.saveToStorage(STORAGE_KEY, toys)
    }
}
