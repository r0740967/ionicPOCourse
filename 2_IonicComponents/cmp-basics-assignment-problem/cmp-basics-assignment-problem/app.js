const courseInput = document.querySelector("#course-input");
const ratingInput = document.querySelector("#rating-input");
const coursesList = document.querySelector("#courses-list");
const btnSubmit = document.querySelector("#btn-submit");

clear = () => {
    courseInput.value = '';
    ratingInput.value = '';
}

btnSubmit.addEventListener('click', () => {
    const enteredCourse = courseInput.value;
    const enteredRating = ratingInput.value;

    if (enteredCourse.trim().length <= 0 || enteredRating.trim().length <= 0 || enteredRating <= 0 || enteredRating > 5) {
        const alert = document.createElement("ion-alert");
        alert.header = "Invalid inputs";
        alert.message = "Please provide a valid course and rating";
        alert.buttons = ['Okay'];
        document.body.appendChild(alert);
        return alert.present();
    }

    const newItem = document.createElement('ion-item');
    
    newItem.innerHTML = '<span style="font-weight:bold">' + enteredCourse + '</span> - ' + enteredRating + '/5';

    coursesList.appendChild(newItem);
    clear();
})