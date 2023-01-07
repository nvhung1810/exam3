const select = document.querySelector('.select');
export const sort = document.querySelector('.sort');

select.addEventListener('click', handlerToggle);

function handlerToggle() {
    sort.classList.toggle('active');
}
