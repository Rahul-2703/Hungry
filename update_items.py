import sys

# 1. Update index.html
html_file = r'd:\HUNGRY\index.html'
with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

items_html = '''
                <a href=\"recipe.html?id=aloo-gobi\" data-diet=\"veg\" class=\"bento-item bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant group cursor-pointer block\">
                    <div class=\"aspect-square overflow-hidden\">
                        <img class=\"w-full h-full object-cover transition-transform duration-500 group-hover:scale-105\" src=\"./img/aloo_gobi.png\" alt=\"Aloo Gobi\" />
                    </div>
                    <div class=\"p-3 text-center\"><span class=\"font-label-md text-label-md font-bold uppercase text-on-surface\">Aloo Gobi</span></div>
                </a>
                <a href=\"recipe.html?id=paneer-butter-masala\" data-diet=\"veg\" class=\"bento-item bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant group cursor-pointer block\">
                    <div class=\"aspect-square overflow-hidden\">
                        <img class=\"w-full h-full object-cover transition-transform duration-500 group-hover:scale-105\" src=\"./img/paneer_butter_masala.png\" alt=\"Paneer Butter Masala\" />
                    </div>
                    <div class=\"p-3 text-center\"><span class=\"font-label-md text-label-md font-bold uppercase text-on-surface\">Paneer Butter Masala</span></div>
                </a>
                <a href=\"recipe.html?id=vegetable-biryani\" data-diet=\"veg\" class=\"bento-item bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant group cursor-pointer block\">
                    <div class=\"aspect-square overflow-hidden\">
                        <img class=\"w-full h-full object-cover transition-transform duration-500 group-hover:scale-105\" src=\"./img/vegetable_biryani.png\" alt=\"Vegetable Biryani\" />
                    </div>
                    <div class=\"p-3 text-center\"><span class=\"font-label-md text-label-md font-bold uppercase text-on-surface\">Vegetable Biryani</span></div>
                </a>
                <a href=\"recipe.html?id=dal-makhani\" data-diet=\"veg\" class=\"bento-item bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant group cursor-pointer block\">
                    <div class=\"aspect-square overflow-hidden\">
                        <img class=\"w-full h-full object-cover transition-transform duration-500 group-hover:scale-105\" src=\"./img/dal_makhani.png\" alt=\"Dal Makhani\" />
                    </div>
                    <div class=\"p-3 text-center\"><span class=\"font-label-md text-label-md font-bold uppercase text-on-surface\">Dal Makhani</span></div>
                </a>
                <a href=\"recipe.html?id=chicken-tikka-masala\" data-diet=\"non-veg\" class=\"bento-item bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant group cursor-pointer block\">
                    <div class=\"aspect-square overflow-hidden\">
                        <img class=\"w-full h-full object-cover transition-transform duration-500 group-hover:scale-105\" src=\"./img/chicken_tikka_masala.png\" alt=\"Chicken Tikka Masala\" />
                    </div>
                    <div class=\"p-3 text-center\"><span class=\"font-label-md text-label-md font-bold uppercase text-on-surface\">Chicken Tikka Masala</span></div>
                </a>
                <a href=\"recipe.html?id=fish-curry\" data-diet=\"non-veg\" class=\"bento-item bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant group cursor-pointer block\">
                    <div class=\"aspect-square overflow-hidden\">
                        <img class=\"w-full h-full object-cover transition-transform duration-500 group-hover:scale-105\" src=\"./img/fish_curry.png\" alt=\"Fish Curry\" />
                    </div>
                    <div class=\"p-3 text-center\"><span class=\"font-label-md text-label-md font-bold uppercase text-on-surface\">Fish Curry</span></div>
                </a>
                <a href=\"recipe.html?id=prawn-biryani\" data-diet=\"non-veg\" class=\"bento-item bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant group cursor-pointer block\">
                    <div class=\"aspect-square overflow-hidden\">
                        <img class=\"w-full h-full object-cover transition-transform duration-500 group-hover:scale-105\" src=\"./img/prawn_biryani.png\" alt=\"Prawn Biryani\" />
                    </div>
                    <div class=\"p-3 text-center\"><span class=\"font-label-md text-label-md font-bold uppercase text-on-surface\">Prawn Biryani</span></div>
                </a>
                <a href=\"recipe.html?id=mutton-korma\" data-diet=\"non-veg\" class=\"bento-item bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant group cursor-pointer block\">
                    <div class=\"aspect-square overflow-hidden\">
                        <img class=\"w-full h-full object-cover transition-transform duration-500 group-hover:scale-105\" src=\"./img/mutton_korma.png\" alt=\"Mutton Korma\" />
                    </div>
                    <div class=\"p-3 text-center\"><span class=\"font-label-md text-label-md font-bold uppercase text-on-surface\">Mutton Korma</span></div>
                </a>
                <a href=\"recipe.html?id=chicken-shawarma\" data-diet=\"non-veg\" class=\"bento-item bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant group cursor-pointer block\">
                    <div class=\"aspect-square overflow-hidden\">
                        <img class=\"w-full h-full object-cover transition-transform duration-500 group-hover:scale-105\" src=\"./img/chicken_shawarma.png\" alt=\"Chicken Shawarma\" />
                    </div>
                    <div class=\"p-3 text-center\"><span class=\"font-label-md text-label-md font-bold uppercase text-on-surface\">Chicken Shawarma</span></div>
                </a>
                <a href=\"recipe.html?id=egg-curry\" data-diet=\"non-veg\" class=\"bento-item bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant group cursor-pointer block\">
                    <div class=\"aspect-square overflow-hidden\">
                        <img class=\"w-full h-full object-cover transition-transform duration-500 group-hover:scale-105\" src=\"./img/egg_curry.png\" alt=\"Egg Curry\" />
                    </div>
                    <div class=\"p-3 text-center\"><span class=\"font-label-md text-label-md font-bold uppercase text-on-surface\">Egg Curry</span></div>
                </a>
'''

insert_pos = content.find('            </div>\n        </section>\n\n        <!-- Trending Now Section')
if insert_pos != -1:
    content = content[:insert_pos] + items_html + content[insert_pos:]
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print('index.html updated successfully.')
else:
    print('Could not find insertion point in index.html')

# 2. Update js/app.js
app_js_file = r'd:\HUNGRY\js\app.js'
with open(app_js_file, 'r', encoding='utf-8') as f:
    app_js = f.read()

recipes_js = '''
    "aloo-gobi": {
        name: "Aloo Gobi",
        image: "./img/aloo_gobi.png",
        price: 180,
        rating: 4.5,
        time: "30 min",
        chef: "Chef Sanjeev",
        description: "A vibrant, delicious-looking bowl of Aloo Gobi (Indian potato and cauliflower curry) with fresh coriander garnish.",
        calories: "320 kcal",
        protein: "8g"
    },
    "paneer-butter-masala": {
        name: "Paneer Butter Masala",
        image: "./img/paneer_butter_masala.png",
        price: 250,
        rating: 4.8,
        time: "40 min",
        chef: "Chef Kunal",
        description: "A rich, creamy bowl of Paneer Butter Masala with a swirl of cream and cilantro on top.",
        calories: "550 kcal",
        protein: "16g"
    },
    "vegetable-biryani": {
        name: "Vegetable Biryani",
        image: "./img/vegetable_biryani.png",
        price: 220,
        rating: 4.6,
        time: "45 min",
        chef: "Chef Vikas",
        description: "A colorful pot of Vegetable Biryani with saffron rice, mixed vegetables, and cashews.",
        calories: "450 kcal",
        protein: "12g"
    },
    "dal-makhani": {
        name: "Dal Makhani",
        image: "./img/dal_makhani.png",
        price: 200,
        rating: 4.9,
        time: "60 min",
        chef: "Chef Ranveer",
        description: "A rich, dark bowl of creamy Dal Makhani (black lentil dal) with butter melting on top.",
        calories: "400 kcal",
        protein: "18g"
    },
    "chicken-tikka-masala": {
        name: "Chicken Tikka Masala",
        image: "./img/chicken_tikka_masala.png",
        price: 350,
        rating: 4.9,
        time: "50 min",
        chef: "Chef Gordon",
        description: "A mouth-watering bowl of Chicken Tikka Masala with bright orange gravy and roasted chicken chunks.",
        calories: "600 kcal",
        protein: "35g"
    },
    "fish-curry": {
        name: "Fish Curry",
        image: "./img/fish_curry.png",
        price: 320,
        rating: 4.7,
        time: "45 min",
        chef: "Chef Pillai",
        description: "A spicy and tangy South Indian Fish Curry served in an earthen bowl.",
        calories: "480 kcal",
        protein: "32g"
    },
    "prawn-biryani": {
        name: "Prawn Biryani",
        image: "./img/prawn_biryani.png",
        price: 450,
        rating: 4.8,
        time: "55 min",
        chef: "Chef Rahul",
        description: "A delicious plate of Prawn Biryani with large roasted prawns on top of aromatic spiced rice.",
        calories: "650 kcal",
        protein: "40g"
    },
    "mutton-korma": {
        name: "Mutton Korma",
        image: "./img/mutton_korma.png",
        price: 480,
        rating: 4.9,
        time: "70 min",
        chef: "Chef Ali",
        description: "A rich and creamy bowl of Mutton Korma garnished with almonds and fresh cream.",
        calories: "720 kcal",
        protein: "45g"
    },
    "chicken-shawarma": {
        name: "Chicken Shawarma",
        image: "./img/chicken_shawarma.png",
        price: 180,
        rating: 4.6,
        time: "20 min",
        chef: "Chef Ziad",
        description: "A delicious Chicken Shawarma wrap cut in half showing juicy meat, garlic sauce, and pickles.",
        calories: "450 kcal",
        protein: "28g"
    },
    "egg-curry": {
        name: "Egg Curry",
        image: "./img/egg_curry.png",
        price: 150,
        rating: 4.5,
        time: "30 min",
        chef: "Chef Anita",
        description: "A delicious bowl of Indian Egg Curry (Anda Curry) with boiled eggs in a thick red tomato gravy.",
        calories: "350 kcal",
        protein: "18g"
    },
'''

insert_pos_js = app_js.find('};', app_js.find('const RECIPES = {'))
if insert_pos_js != -1:
    # insert before the closing brace
    app_js = app_js[:insert_pos_js] + recipes_js + app_js[insert_pos_js:]
    with open(app_js_file, 'w', encoding='utf-8') as f:
        f.write(app_js)
    print('app.js updated successfully.')
else:
    print('Could not find RECIPES insertion point in app.js')
