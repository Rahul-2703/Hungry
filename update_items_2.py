import re

# Update index.html
with open('d:/HUNGRY/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

items_html = """                <a href="recipe.html?id=mutton-biryani" data-diet="non-veg" class="bento-item bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant group cursor-pointer block">
                    <div class="aspect-square overflow-hidden">
                        <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="./img/mutton_biryani.png" alt="Mutton Biryani" />
                    </div>
                    <div class="p-3 text-center"><span class="font-label-md text-label-md font-bold uppercase text-on-surface">Mutton Biryani</span></div>
                </a>
                <a href="recipe.html?id=chicken-kebab" data-diet="non-veg" class="bento-item bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant group cursor-pointer block">
                    <div class="aspect-square overflow-hidden">
                        <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="./img/chicken_kebab.png" alt="Chicken Kebab" />
                    </div>
                    <div class="p-3 text-center"><span class="font-label-md text-label-md font-bold uppercase text-on-surface">Chicken Kebab</span></div>
                </a>
"""
insert_pos = content.find('            </div>\n        </section>\n\n        <section class="px-8 py-16 bg-gray-50 mt-12"')
if insert_pos != -1:
    content = content[:insert_pos] + items_html + content[insert_pos:]
    with open('d:/HUNGRY/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated index.html")
else:
    print("Could not find insert position in index.html")

# Update app.js
with open('d:/HUNGRY/js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

js_items = """,
    "mutton-biryani": {
        name: "Mutton Biryani",
        image: "./img/mutton_biryani.png",
        price: 320,
        rating: 4.8,
        time: "45 min",
        chef: "Chef Ali",
        description: "A rich and flavorful traditional Mutton Biryani, layered with fragrant basmati rice and tender pieces of meat.",
        type: "non-veg",
        ingredients: ["Mutton", "Basmati Rice", "Yogurt", "Onions", "Spices", "Saffron", "Mint"],
        instructions: [
            "Marinate the mutton with yogurt, spices, and mint for at least 2 hours.",
            "Partially cook the basmati rice with whole spices.",
            "Layer the marinated mutton and rice in a heavy-bottomed pot.",
            "Drizzle saffron milk and ghee on top.",
            "Seal the pot and cook on low heat (dum) for 40 minutes.",
            "Serve hot with raita."
        ]
    },
    "chicken-kebab": {
        name: "Chicken Kebab",
        image: "./img/chicken_kebab.png",
        price: 240,
        rating: 4.7,
        time: "30 min",
        chef: "Chef Qureshi",
        description: "Juicy, perfectly spiced Chicken Seekh Kebabs roasted to perfection, served with fresh mint chutney.",
        type: "non-veg",
        ingredients: ["Minced Chicken", "Onions", "Garlic", "Ginger", "Green Chilies", "Garam Masala", "Coriander"],
        instructions: [
            "Mix the minced chicken with finely chopped onions, garlic, ginger, and chilies.",
            "Add dry spices and fresh coriander, mix well.",
            "Molding the mixture onto skewers.",
            "Grill or pan-fry the kebabs until golden brown and cooked through.",
            "Serve hot with lemon wedges and mint chutney."
        ]
    }"""

insert_pos_js = app_js.find('};', app_js.find('const RECIPES = {'))
if insert_pos_js != -1:
    # Need to go just before the closing brace. Actually insert_pos_js is the index of `}` in `};`
    app_js = app_js[:insert_pos_js-1] + js_items + '\n' + app_js[insert_pos_js-1:]
    with open('d:/HUNGRY/js/app.js', 'w', encoding='utf-8') as f:
        f.write(app_js)
    print("Updated app.js")
else:
    print("Could not find insert position in app.js")
