const modal = document.querySelector('.modal')

export function renderModalInfo(item) {
    const { img, id, title, info } = item

    modal.innerHTML = `
            <div class="modal-card" data-id="${id}">
                <div class="modal-title">${title}</div>
                <div class="modal-composition">
                    <div class="modal-img">
                        <img src="${img}" alt="">
                    </div>
                    <ul>
                        <li>Огурец</li>
                        <li>Помидора</li>
                        <li>Огурец</li>
                        <li>Огурец</li>
                    </ul>
                </div>
                <div class="modal-info">
                    Lorem Lorem
                </div>
            </div>
        `
    modal.classList.add("modal--show")
    document.body.classList.add("stop-scrolling")
}

function closeModal() {
    modal.classList.remove("modal--show");
    document.body.classList.remove("stop-scrolling");
}

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
})

window.addEventListener("keydown", (e) => {
    if (e.keyCode === 27) {
        closeModal();
    }
})