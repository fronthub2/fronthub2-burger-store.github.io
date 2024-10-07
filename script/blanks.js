export function getLSById() {
    const cardJSON = localStorage.getItem('id')
    return cardJSON ? JSON.parse(cardJSON) : []
}

export function setLSById(id) {
    const basket_header_length = document.querySelector('.basket-header_length')
    localStorage.setItem('id', JSON.stringify(id))
    basket_header_length.textContent = id.length
}

// export function getLSCategory() {
//     const category = localStorage.getItem('category')
//     return category ? JSON.parse(category) : []
// }

// export function setLSCategory(category) {
//     localStorage.setItem('category', JSON.stringify(category))
// }

export function checkingValueCard(data) {
    const basket = getLSById()
    basket.forEach((id, index) => {
        const existValue = data.some((item) => item.id === Number(id))
        if (!existValue) {
            basket.splice(index, 1)
        }
    })
    setLSById(basket)
}