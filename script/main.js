import { getLSById, setLSById, checkingValueCard } from './blanks.js'
import {renderModalInfo} from './modal.js'

const foods_menu = document.querySelector('.foods-menu')
const category_food_item = document.querySelectorAll('.category-food_item')
const category_foods = document.querySelector('.category-foods')
const basket_item = document.querySelector('.basket-main')
const basket_footer_order_btn = document.querySelector('.basket-footer_order-btn')
const basket_footer_details_amount = document.querySelector('.basket-footer-details_amount')


let foodData = []

category_foods.addEventListener('click', coloringCategory)
foods_menu.addEventListener('click', handlerAddFoodInBasket)
foods_menu.addEventListener('click', openModal)
basket_item.addEventListener('click', handlerDeleteFoodInBasket)
basket_item.addEventListener('click', addAmountFood)
basket_item.addEventListener('click', shrinkAmountFood)

getFoods()
async function getFoods() {
    try {
        if (!foodData.length) {
            const resp = await fetch('../json/foods.json')
            if (!resp.ok) {
                throw new Error(resp.statusText)
            }

            foodData = await resp.json()
        }

        loadingPage()


    } catch (err) {
        console.log(err.message)
    }
}

function loadingPage() {
    const filterFood = foodData.filter((food) => food.category.toLowerCase() === 'бургеры')

    renderFoods(filterFood)

    const basketId = getLSById()
    setLSById(basketId)

    coloringBtnAddFoodInBasket(basketId)
    renderFoodsInBasket(basketId)

}

function coloringCategory(event) {
    const targ_btn = event.target.closest('.category-food_item')
    if (!targ_btn) return

    category_food_item.forEach((food) => food.classList.remove('active'))

    targ_btn.classList.add('active')

    const child_targ_btn = targ_btn.children[1].textContent

    activeFood(child_targ_btn)

}

function activeFood(category) {
    const food_title = document.querySelector('.food-title')
    const filterFood = foodData.filter((food) => food.category.toLowerCase() === category.toLowerCase())
    
    renderFoods(filterFood)

    food_title.textContent = category
    const basketId = getLSById()
    coloringBtnAddFoodInBasket(basketId)
}

function handlerAddFoodInBasket(event) {
    const targ_btn = event.target.closest('.menu-add-btn')
    if (!targ_btn) return
    const card = targ_btn.closest('.menu-item')
    const id = card.dataset.foodId

    const finded = foodData.find((food) => food.id === id)
    const basketId = getLSById()
    const isHaveInBasket = basketId.some((item) => item.id === finded.id)
    console.log(isHaveInBasket)

    if (isHaveInBasket) return

    basketId.push(finded)
    setLSById(basketId)
    coloringBtnAddFoodInBasket(basketId)
    renderFoodsInBasket(basketId)
}

function coloringBtnAddFoodInBasket(basket) {
    const menu_add_btn = document.querySelectorAll('.menu-add-btn')
    console.log(menu_add_btn)
    menu_add_btn.forEach((btn) => {
        const card = btn.closest('.menu-item')
        const id = card.dataset.foodId
        let isHaveInBasket = basket.some((item) => item.id === id)

        btn.classList.toggle('active_btn', isHaveInBasket)
        btn.textContent = isHaveInBasket ? 'Добавлена' : 'Добавить'
    })
    sumPrice()
}

function handlerDeleteFoodInBasket(event) {
    const targ_btn = event.target.closest('.basket-main-item_delete')
    if (!targ_btn) return
    const card = targ_btn.closest('.basket-main_item')
    const id = card.dataset.basketMainId

    const basketId = getLSById()

    const filtered = basketId.filter((item) => item.id !== id)
    renderFoodsInBasket(filtered)
    coloringBtnAddFoodInBasket(filtered)
    setLSById(filtered)
    sumPrice()
}

function sumPrice() {
    const basketId = getLSById()
    if (!basketId.length) {
        basket_footer_details_amount.textContent = `0`
        return
    }

    const arr_price = basketId.map((item) => item.priceForm ? item.priceForm : item.price)

    const reduce_arr_price = arr_price.reduce((res, item) => res + item)

    basket_footer_details_amount.textContent = `${reduce_arr_price}₽`
    setLSById(basketId)
}

function addAmountFood(event) {
    const targ_btn = event.target.closest('#btn-add')
    if (!targ_btn) return
    const card = targ_btn.closest('.basket-main_item')
    const id = card.dataset.basketMainId

    const details_weight = card.children[2].children[1]
    console.log(details_weight)

    const details_price = card.children[2].children[2]
    console.log(details_price)


    const basketId = getLSById()
    const finded = basketId.find((item) => item.id === id)
    finded.quantity++


    const basket_main_quantity = targ_btn.closest('.basket-main_quantity').children[1]
    basket_main_quantity.textContent = finded.quantity

    finded.weightForm = (finded.weight * finded.quantity)

    finded.priceForm = (finded.price * finded.quantity)

    details_weight.textContent = `${finded.weightForm}г`
    details_price.textContent = `${finded.priceForm}₽`

    setLSById(basketId)
    sumPrice()
}

function shrinkAmountFood(event) {
    const targ_btn = event.target.closest('#btn-shrink')
    if (!targ_btn) return
    const card = targ_btn.closest('.basket-main_item')
    const id = card.dataset.basketMainId

    const details_weight = card.children[2].children[1]
    console.log(details_weight)

    const details_price = card.children[2].children[2]
    console.log(details_price)


    const basketId = getLSById()
    const finded = basketId.find((item) => item.id === id)
    if (finded.quantity <= 1) return
    finded.quantity--

    const basket_main_quantity = targ_btn.closest('.basket-main_quantity').children[1]
    basket_main_quantity.textContent = finded.quantity

    finded.weightForm = (finded.weightForm - finded.weight)

    finded.priceForm = (finded.priceForm - finded.price)

    details_weight.textContent = `${finded.weightForm}г`
    details_price.textContent = `${finded.priceForm}₽`

    setLSById(basketId)
    sumPrice()
}


function openModal(event) {
    const targ_btn = event.target.closest('.menu-img')
    if (!targ_btn) return
    const card = targ_btn.closest('.menu-item')
    const id = card.dataset.foodId

    const finded = foodData.find((item) => item.id === id)
    console.log(finded)
    renderModalInfo(finded)
}

function renderFoods(data) {
    if (!data || !data.length) {
        noProducts()
        return
    }

    foods_menu.innerHTML = ''
    data.forEach((food) => {
        const { title, price, img, id, category, weight, quantity } = food

        const card = `
            <div class="menu-item" data-food-id="${id}" data-category="${category}" data-quantity="${quantity}">
                <div class="menu-img">
                    <img src="${img}" alt="${img}">
                </div>
                <div class="menu-price">${price}<span> ₽</span></div>
                <div class="menu-title">${title}</div>
                <div class="menu-weight">${weight}<span>г</span></div>
                <button class="menu-add-btn">Добавить</button>
            </div>
        `

        foods_menu.insertAdjacentHTML("beforeend", card)
    })
}

function renderFoodsInBasket(data) {
    if (!data || !data.length) {
        basket_footer_order_btn.classList.add('default')
    } else {
        basket_footer_order_btn.classList.remove('default')
    }

    basket_item.innerHTML = ''

    data.forEach((item) => {
        const { img, title, weight, price, quantity, id, category, priceForm, weightForm } = item

        const card = `
            <div class="basket-main_item" data-basket-main-id="${id}" data-category="${category}">
                <div class="basket-main-item_delete">X</div>
                <div class="basket-main-item_img">
                    <img src="${img}" alt="">
                </div>
                <div class="basket-main_details">
                    <div class="basket-main-details_title">${title}</div>
                    <div class="basket-main-details_weight">${weightForm ? weightForm : weight}<span>г</span></div>
                    <div class="basket-main-details_price">${priceForm ? priceForm : price}<span>₽</span></div>
                </div>
                <div class="basket-main_quantity">
                    <button id="btn-shrink" class="basket-main-quantity_btn">-</button>
                    <p class="basket-main-quantity_text">${quantity}</p>
                    <button id="btn-add" class="basket-main-quantity_btn">+</button>
                </div>
            </div>
        `

        basket_item.insertAdjacentHTML("beforeend", card)
    })
}

function noProducts() {
    foods_menu.innerHTML = `Нет в наличии :(`
}
