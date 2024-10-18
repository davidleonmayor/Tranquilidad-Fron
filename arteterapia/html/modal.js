const openModalBtn = document.querySelectorAll('.openModalBtn');
const closeModal = document.querySelectorAll('.close')

openModalBtn.forEach(btn => {
    btn.addEventListener("click", function(){
        const modalId = this.getAttribute("data-modal");
        const modal = document.getElementById(modalId);
        modal.style.display = "block"
    })
})

closeModal.forEach(btn => {
    btn.addEventListener("click", function(){
        const modalId = this.getAttribute("data-modal");
        const modal = document.getElementById(modalId);
        modal.style.display = "none"
    })
})

window.onclick = function(event){
    if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
    }
}