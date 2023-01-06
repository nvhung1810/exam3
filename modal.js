import { nameMember, jobPosition } from './index.js';

const modal = document.getElementById('myModal');

// Get the button that opens the modal
const btn = document.getElementById('myBtn');

// Get the <span> element that closes the modal
const closeBtn = document.getElementsByClassName('close')[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
    modal.style.display = 'block';
};

// When the user clicks on <closeBtn> (x), close the modal
closeBtn.onclick = function () {
    nameMember.value = '';
    jobPosition.value = '';
    modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};
