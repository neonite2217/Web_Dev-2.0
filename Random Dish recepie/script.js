const get_meal_btn = document.getElementById('get_meal');
const meal_container = document.getElementById('meal');

get_meal_btn.addEventListener('click', () => {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(res => res.json())
        .then(res => {
        createMeal(res.meals[0]);
    });
});

const createMeal = (meal) => {
    const ingredients = [];
    // Get all ingredients from the object. Up to 20
    for(let i = 1; i <= 20; i++) {
        if(meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            // Stop if no more ingredients
            break;
        }
    }

    const newInnerHTML = `
        <div class="meal">
            <img src="${meal.strMealThumb}" alt="Meal Image">
            <div class="meal-content">
                <h3>${meal.strMeal}</h3>
                ${meal.strCategory ? `<p><strong>Category:</strong> ${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p><strong>Area:</strong> ${meal.strArea}</p>` : ''}
                ${meal.strTags ? `<p><strong>Tags:</strong> ${meal.strTags.split(',').join(', ')}</p>` : ''}
                <h5>Ingredients:</h5>
                <ul>
                    ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
                <h5>Instructions:</h5>
                <p>${meal.strInstructions}</p>
            </div>
        </div>
        ${meal.strYoutube ? `
        <div class="video-section">
            <h5>Video Recipe</h5>
            <div class="videoWrapper">
                <iframe width="560" height="315"
                src="https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}"
                frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                </iframe>
            </div>
        </div>` : ''}
    `;

    meal_container.innerHTML = newInnerHTML;
};
