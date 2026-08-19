// Cart logic
let cart = [];
try {
    cart = JSON.parse(localStorage.getItem('hungry_cart')) || [];
} catch (e) {
    cart = [];
}

function addToCart(item) {
    if (!item.quantity) item.quantity = 1;
    if (!item.type) item.type = 'grocery';
    if (!item.image && item.img) item.image = item.img;
    if (!item.price) item.price = 0;
    item.price = Number(item.price);

    try { cart = JSON.parse(localStorage.getItem('hungry_cart')) || []; } catch (e) { cart = []; }

    const existingIndex = cart.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase());
    if (existingIndex > -1) {
        cart[existingIndex].quantity += item.quantity;
        if (!cart[existingIndex].image && item.image) cart[existingIndex].image = item.image;
    } else {
        cart.push(item);
    }
    localStorage.setItem('hungry_cart', JSON.stringify(cart));
    updateCartBadge();
    showToast(`${item.name} added to cart!`);
}

function getCart() {
    try { cart = JSON.parse(localStorage.getItem('hungry_cart')) || []; } catch (e) { cart = []; }
    return cart;
}

function removeFromCart(index) {
    try { cart = JSON.parse(localStorage.getItem('hungry_cart')) || []; } catch (e) { cart = []; }
    cart.splice(index, 1);
    localStorage.setItem('hungry_cart', JSON.stringify(cart));
    updateCartBadge();
    if (typeof renderCart === 'function') {
        renderCart();
    }
}

function updateCartQuantity(index, amount) {
    try { cart = JSON.parse(localStorage.getItem('hungry_cart')) || []; } catch (e) { cart = []; }
    if (cart[index]) {
        cart[index].quantity += amount;
        if (cart[index].quantity <= 0) {
            removeFromCart(index);
        } else {
            localStorage.setItem('hungry_cart', JSON.stringify(cart));
            updateCartBadge();
            if (typeof renderCart === 'function') {
                renderCart();
            }
        }
    }
}

function clearCart() {
    cart = [];
    localStorage.setItem('hungry_cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    try {
        const stored = JSON.parse(localStorage.getItem('hungry_cart')) || [];
        const count = stored.reduce((acc, item) => acc + (item.quantity || 1), 0);
        const badges = document.querySelectorAll('.cart-badge, #cart-badge-count');
        badges.forEach(badge => {
            badge.innerText = count;
            if (count > 0) {
                badge.classList.remove('hidden');
            } else {
                if (badge.id !== 'cart-badge-count') badge.classList.add('hidden');
            }
        });
    } catch (e) { }
}

document.addEventListener('DOMContentLoaded', updateCartBadge);

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-24 right-4 bg-primary text-on-primary px-6 py-3 rounded-lg shadow-xl font-bold z-[100] transform transition-all translate-x-20 opacity-0';
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-x-20', 'opacity-0');
    }, 100);

    setTimeout(() => {
        toast.classList.add('translate-x-20', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function findNearbyDelivery(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setTimeout(() => {
                    callback(true, {
                        restaurant: "Hungry Cloud Kitchen (2.4 miles away)",
                        eta: "35 mins"
                    });
                }, 1500);
            },
            (error) => {
                setTimeout(() => {
                    callback(true, {
                        restaurant: "Hungry Cloud Kitchen (Downtown)",
                        eta: "45 mins"
                    });
                }, 1500);
            }
        );
    } else {
        setTimeout(() => {
            callback(true, {
                restaurant: "Hungry Cloud Kitchen (Main)",
                eta: "40 mins"
            });
        }, 1500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});

// RECIPE DATABASE
const RECIPES = {
    'chicken-biryani': {
        name: 'Chicken Biryani',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800',
        price: 301.00,
        oldPrice: 557.00,
        ingredients: [
            { name: 'Chicken', baseQty: 1, unit: 'KG' },
            { name: 'Basmati Rice', baseQty: 1.25, unit: 'KG' },
            { name: 'Onions (Sliced)', baseQty: 0.5, unit: 'KG' },
            { name: 'Yogurt', baseQty: 250, unit: 'g' }
        ],
        steps: [
            "Marinate the chicken with yogurt, spices, and lemon juice for at least 2 hours.",
            "Wash and soak basmati rice for 30 minutes. Parboil the rice with whole spices until 70% cooked.",
            "Fry the thinly sliced onions until golden brown (birista) and set aside.",
            "In a heavy-bottomed pot, layer the marinated chicken, parboiled rice, fried onions, and saffron milk.",
            "Seal the pot with dough (dum) and cook on low heat for 45 minutes.",
            "Garnish with fresh coriander and mint leaves before serving hot."
        ]
    },
    'masala-dosa': {
        name: 'Masala Dosa',
        image: 'img/masala_dosa.png',
        price: 412.00,
        oldPrice: 551.00,
        ingredients: [
            { name: 'Dosa Batter', baseQty: 1, unit: 'L' },
            { name: 'Potatoes (Boiled)', baseQty: 0.5, unit: 'KG' },
            { name: 'Onions', baseQty: 2, unit: 'pcs' },
            { name: 'Mustard Seeds', baseQty: 10, unit: 'g' }
        ],
        steps: [
            "Prepare the potato filling by tempering mustard seeds, curry leaves, and onions, then mixing in mashed potatoes and turmeric.",
            "Heat a non-stick or cast-iron tawa (griddle) and pour a ladle of batter, spreading it in a circular motion.",
            "Drizzle ghee or oil around the edges and cook until the bottom is crisp and golden brown.",
            "Place a generous scoop of the potato masala in the center.",
            "Fold the dosa and serve immediately with coconut chutney and hot sambar."
        ]
    },
    'paneer-tikka': {
        name: 'Paneer Tikka',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800',
        price: 350.00,
        oldPrice: 551.00,
        ingredients: [
            { name: 'Paneer (Cubed)', baseQty: 500, unit: 'g' },
            { name: 'Capsicum & Onion', baseQty: 300, unit: 'g' },
            { name: 'Hung Curd', baseQty: 200, unit: 'g' },
            { name: 'Tikka Masala', baseQty: 30, unit: 'g' }
        ],
        steps: [
            "Mix hung curd with tikka masala, ginger-garlic paste, and mustard oil to form a marinade.",
            "Coat the paneer cubes, capsicum, and onion squares evenly in the marinade.",
            "Let it rest in the refrigerator for at least 1 hour.",
            "Thread the marinated pieces onto skewers alternating between paneer and veggies.",
            "Grill in an oven or tandoor at 200°C for 15-20 minutes, basting with butter halfway.",
            "Sprinkle with chaat masala and serve with mint chutney and lemon wedges."
        ]
    },
    'dhal-soup': {
        name: 'Dhal Soup',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800',
        price: 492.00,
        oldPrice: 562.00,
        ingredients: [
            { name: 'Yellow Lentils (Moong Dal)', baseQty: 250, unit: 'g' },
            { name: 'Garlic', baseQty: 5, unit: 'cloves' },
            { name: 'Cumin Seeds', baseQty: 5, unit: 'g' },
            { name: 'Ghee', baseQty: 2, unit: 'tbsp' }
        ],
        steps: [
            "Wash the lentils thoroughly and pressure cook with turmeric, salt, and 3 cups of water until completely soft.",
            "Whisk the cooked lentils until smooth. Adjust consistency with hot water if needed.",
            "In a small pan, heat ghee and add cumin seeds, minced garlic, and a pinch of asafoetida for the tadka (tempering).",
            "Once garlic turns golden brown, pour the tadka over the dal immediately.",
            "Simmer for 2 minutes, garnish with fresh coriander, and serve hot as a soup or with rice."
        ]
    },
    'samosa': {
        name: 'Punjabi Samosa',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800',
        price: 487.00,
        oldPrice: 572.00,
        ingredients: [
            { name: 'All-Purpose Flour (Maida)', baseQty: 500, unit: 'g' },
            { name: 'Potatoes (Boiled)', baseQty: 600, unit: 'g' },
            { name: 'Green Peas', baseQty: 100, unit: 'g' },
            { name: 'Garam Masala', baseQty: 15, unit: 'g' }
        ],
        steps: [
            "Knead a stiff dough using flour, ajwain (carom seeds), salt, and ghee/oil. Let it rest for 30 minutes.",
            "Prepare the filling by sautéing boiled potatoes, peas, green chilies, and dry spices until well combined.",
            "Divide the dough into small balls, roll into ovals, and cut in half.",
            "Form a cone with each half, stuff with the potato filling, and seal the edges with a little water.",
            "Deep fry the samosas on low-medium heat until golden and crispy (about 12-15 minutes).",
            "Serve hot with sweet tamarind chutney and spicy green chutney."
        ]
    },
    'butter-chicken': {
        name: 'Butter Chicken',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800',
        price: 475.00,
        oldPrice: 555.00,
        ingredients: [
            { name: 'Chicken (Boneless)', baseQty: 750, unit: 'g' },
            { name: 'Tomatoes', baseQty: 1, unit: 'KG' },
            { name: 'Butter', baseQty: 100, unit: 'g' },
            { name: 'Heavy Cream', baseQty: 150, unit: 'ml' }
        ],
        steps: [
            "Marinate the chicken in yogurt, ginger-garlic paste, and Kashmiri red chili powder. Grill or pan-fry until charred and cooked.",
            "In a heavy pot, simmer roughly chopped tomatoes, onions, cashews, garlic, and whole spices in water until soft (about 20 mins).",
            "Blend the tomato mixture into a fine puree and strain it for a silky smooth texture.",
            "Melt butter in a pan, pour in the puree, and add kasuri methi (dried fenugreek leaves) and a pinch of sugar.",
            "Add the cooked chicken pieces and simmer for 10 minutes.",
            "Finish with heavy cream and serve with hot garlic naan."
        ]
    },
    'palak-paneer': {
        name: 'Palak Paneer',
        image: 'img/palak_paneer.png',
        price: 450.00,
        oldPrice: 589.00,
        ingredients: [
            { name: 'Spinach (Palak)', baseQty: 1, unit: 'KG' },
            { name: 'Paneer', baseQty: 400, unit: 'g' },
            { name: 'Onions', baseQty: 3, unit: 'pcs' },
            { name: 'Garlic', baseQty: 8, unit: 'cloves' }
        ],
        steps: [
            "Blanch the spinach leaves in boiling water for 2 minutes, then immediately plunge into ice water to retain color.",
            "Blend the blanched spinach with green chilies into a smooth puree.",
            "Sauté finely chopped onions, garlic, and ginger until golden brown, then add basic spices (coriander, cumin powder).",
            "Pour in the spinach puree and simmer for 5-7 minutes. Do not overcook to keep it green.",
            "Add the paneer cubes (pan-fried or raw) and a splash of cream.",
            "Serve hot with roti or jeera rice."
        ]
    },
    'chole-bhature': {
        name: 'Chole Bhature',
        image: 'img/chole_bhature.png',
        price: 250.00,
        oldPrice: 552.00,
        ingredients: [
            { name: 'Chickpeas (Kabuli Chana)', baseQty: 500, unit: 'g' },
            { name: 'Tea Bags (for color)', baseQty: 2, unit: 'pcs' },
            { name: 'Maida (for Bhature)', baseQty: 600, unit: 'g' },
            { name: 'Chole Masala', baseQty: 30, unit: 'g' }
        ],
        steps: [
            "Soak chickpeas overnight. Pressure cook them with salt and tea bags to get that dark, authentic color.",
            "For the curry, fry onions, tomatoes, and chole masala until oil separates, then add the boiled chickpeas.",
            "Simmer the chole until the gravy thickens and flavors meld.",
            "For the bhature, knead maida with yogurt, a pinch of baking soda, salt, and oil. Rest for 2 hours.",
            "Roll the dough into thick discs and deep fry in smoking hot oil until they puff up completely.",
            "Serve the spicy chole with hot puffed bhature and sliced red onions."
        ]
    },
    'gulab-jamun': {
        name: 'Gulab Jamun',
        image: 'img/gulab_jamun.png',
        price: 272.00,
        oldPrice: 555.00,
        ingredients: [
            { name: 'Khoya (Milk Solids)', baseQty: 400, unit: 'g' },
            { name: 'Paneer', baseQty: 100, unit: 'g' },
            { name: 'Sugar (for syrup)', baseQty: 800, unit: 'g' },
            { name: 'Cardamom & Saffron', baseQty: 5, unit: 'g' }
        ],
        steps: [
            "Prepare the sugar syrup by boiling sugar and water with crushed cardamom and saffron until slightly sticky (no thread consistency needed).",
            "Grate the khoya and paneer, add a little maida, and knead into a very soft, smooth dough without any cracks.",
            "Form small, perfectly round balls.",
            "Deep fry the balls in medium-hot ghee or oil until dark golden brown, stirring constantly for even color.",
            "Immediately drop the hot jamuns into the warm sugar syrup.",
            "Let them soak for at least 2 hours before serving."
        ]
    },
    'tandoori-chicken': {
        name: 'Tandoori Chicken',
        image: 'img/tandoori_chicken.png',
        price: 353.00,
        oldPrice: 551.00,
        ingredients: [
            { name: 'Whole Chicken (Cut)', baseQty: 1, unit: 'KG' },
            { name: 'Hung Curd', baseQty: 200, unit: 'g' },
            { name: 'Kashmiri Red Chili', baseQty: 30, unit: 'g' },
            { name: 'Lemon Juice', baseQty: 3, unit: 'tbsp' }
        ],
        steps: [
            "Make deep incisions in the chicken pieces. Apply the first marinade of lemon juice, salt, and red chili powder. Rest for 30 mins.",
            "Prepare the second marinade by whisking hung curd, ginger-garlic paste, garam masala, and mustard oil.",
            "Coat the chicken heavily in the second marinade and refrigerate overnight.",
            "Preheat an oven or tandoor to 220°C. Skewer the chicken or place on a roasting rack.",
            "Roast for 25-30 minutes, basting with melted butter halfway through to keep it juicy.",
            "Serve sizzling hot with mint chutney and onion rings."
        ]
    },
    'vada-pav': {
        name: 'Vada Pav',
        image: 'img/vada_pav.png',
        price: 309.00,
        oldPrice: 559.00,
        ingredients: [
            { name: 'Potatoes (Boiled)', baseQty: 500, unit: 'g' },
            { name: 'Besan (Gram Flour)', baseQty: 200, unit: 'g' },
            { name: 'Pav (Bread Buns)', baseQty: 6, unit: 'pcs' },
            { name: 'Garlic Chutney', baseQty: 50, unit: 'g' }
        ],
        steps: [
            "Mash the boiled potatoes. Sauté mustard seeds, curry leaves, ginger, garlic, and green chilies, then mix into the potatoes.",
            "Form the potato mixture into round balls (batatas).",
            "Prepare a thick batter of besan, water, salt, and a pinch of turmeric.",
            "Dip the potato balls in the batter and deep fry until golden and crisp to make the vadas.",
            "Slit the pav horizontally. Smear spicy garlic and green chutney inside.",
            "Place the hot vada inside the pav and serve immediately with fried green chilies."
        ]
    },
    'mutton-curry': {
        name: 'Mutton Curry',
        image: 'img/mutton_curry.png',
        price: 323.00,
        oldPrice: 592.00,
        ingredients: [
            { name: 'Mutton (Bone-in)', baseQty: 1, unit: 'KG' },
            { name: 'Onions', baseQty: 5, unit: 'pcs' },
            { name: 'Tomatoes', baseQty: 4, unit: 'pcs' },
            { name: 'Meat Masala', baseQty: 40, unit: 'g' }
        ],
        steps: [
            "Marinate the mutton pieces with yogurt, turmeric, and salt for at least 1 hour.",
            "In a heavy-bottomed pan or pressure cooker, heat mustard oil and fry whole spices (cinnamon, cardamom, cloves, bay leaf).",
            "Add finely chopped onions and fry until dark brown. Add ginger-garlic paste and sauté.",
            "Add the marinated mutton and sear on high heat for 10-15 minutes until browned.",
            "Add pureed tomatoes and powdered spices. Cook until the oil separates.",
            "Add water, cover, and pressure cook (or slow cook) until the meat is fall-off-the-bone tender. Garnish with coriander."
        ]
    },

    "aloo-gobi": {
        name: "Aloo Gobi",
        image: "./img/aloo_gobi.png",
        price: 180,
        rating: 4.5,
        time: "30 min",
        chef: "Chef Sanjeev",
        description: "A vibrant, delicious-looking bowl of Aloo Gobi (Indian potato and cauliflower curry) with fresh coriander garnish.",
        calories: "320 kcal",
        protein: "8g",
        ingredients: [
            { name: 'Cauliflower', baseQty: 1, unit: 'head' },
            { name: 'Potatoes (Boiled)', baseQty: 3, unit: 'pcs' },
            { name: 'Onions', baseQty: 2, unit: 'pcs' },
            { name: 'Tomatoes', baseQty: 2, unit: 'pcs' },
            { name: 'Spices', baseQty: 2, unit: 'Tbsp' }
        ],
        steps: [
            "Cut cauliflower into florets and cube the potatoes.",
            "Heat oil in a pan, add cumin seeds, and saut chopped onions until golden.",
            "Add ginger-garlic paste and chopped tomatoes. Cook until soft.",
            "Add spices (turmeric, coriander, chili powder, garam masala) and mix well.",
            "Toss in the cauliflower and potatoes. Cover and cook on low heat until tender.",
            "Garnish with fresh coriander leaves before serving."
        ]
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
        protein: "16g",
        ingredients: [
            { name: 'Paneer', baseQty: 250, unit: 'g' },
            { name: 'Tomatoes', baseQty: 4, unit: 'pcs' },
            { name: 'Onions', baseQty: 1, unit: 'pcs' },
            { name: 'Cashews', baseQty: 15, unit: 'pcs' },
            { name: 'Butter', baseQty: 50, unit: 'g' }
        ],
        steps: [
            "Boil tomatoes, onions, and cashews until soft. Blend into a smooth puree.",
            "Heat butter in a pan, add the puree and cook until oil separates.",
            "Add spices (kashmiri chili powder, garam masala, salt, and a pinch of sugar).",
            "Stir in fresh cream and crushed kasuri methi.",
            "Add paneer cubes and simmer for 5 minutes.",
            "Serve hot with naan or rice."
        ]
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
        protein: "12g",
        ingredients: [
            { name: 'Basmati Rice', baseQty: 1, unit: 'KG' },
            { name: 'Mixed Vegetables', baseQty: 500, unit: 'g' },
            { name: 'Onions', baseQty: 2, unit: 'pcs' },
            { name: 'Yogurt', baseQty: 150, unit: 'g' },
            { name: 'Spices', baseQty: 3, unit: 'Tbsp' }
        ],
        steps: [
            "Soak basmati rice for 30 minutes, then parboil with whole spices.",
            "Marinate mixed vegetables in yogurt and biryani masala for 30 minutes.",
            "Fry thinly sliced onions until golden and crisp (birista).",
            "In a heavy-bottomed pot, layer the marinated vegetables and parboiled rice.",
            "Top with fried onions, mint, coriander, and saffron milk.",
            "Seal and cook on dum (low heat) for 25-30 minutes."
        ]
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
        protein: "18g",
        ingredients: [
            { name: 'Black Lentils', baseQty: 250, unit: 'g' },
            { name: 'Kidney Beans', baseQty: 50, unit: 'g' },
            { name: 'Butter', baseQty: 100, unit: 'g' },
            { name: 'Tomatoes', baseQty: 3, unit: 'pcs' },
            { name: 'Cream', baseQty: 100, unit: 'ml' }
        ],
        steps: [
            "Soak lentils and kidney beans overnight. Pressure cook until very soft.",
            "In a heavy pot, heat butter and saut ginger-garlic paste.",
            "Add tomato puree and cook until butter separates.",
            "Add the cooked lentils and simmer on low heat for at least 1 hour, stirring occasionally.",
            "Stir in fresh cream and kasuri methi before serving."
        ]
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
        protein: "35g",
        ingredients: [
            { name: 'Chicken', baseQty: 500, unit: 'g' },
            { name: 'Yogurt', baseQty: 150, unit: 'g' },
            { name: 'Tomatoes', baseQty: 4, unit: 'pcs' },
            { name: 'Cream', baseQty: 100, unit: 'ml' },
            { name: 'Tikka Masala Paste', baseQty: 2, unit: 'Tbsp' }
        ],
        steps: [
            "Marinate chicken in yogurt and tikka spices for 2 hours.",
            "Grill or pan-fry the chicken pieces until slightly charred and cooked through.",
            "For the sauce, saut onions, garlic, and ginger, then add tomato puree.",
            "Simmer the sauce with tikka masala paste until thick and fragrant.",
            "Add the grilled chicken and cream to the sauce and simmer for 10 minutes."
        ]
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
        protein: "32g",
        ingredients: [
            { name: 'Fish', baseQty: 500, unit: 'g' },
            { name: 'Onions', baseQty: 2, unit: 'pcs' },
            { name: 'Tomatoes', baseQty: 2, unit: 'pcs' },
            { name: 'Coconut Milk', baseQty: 200, unit: 'ml' },
            { name: 'Tamarind Paste', baseQty: 1, unit: 'Tbsp' }
        ],
        steps: [
            "Marinate fish pieces with turmeric, salt, and lemon juice for 15 minutes.",
            "Heat oil, add mustard seeds, curry leaves, and chopped onions.",
            "Add ginger-garlic paste, tomatoes, and spices. Cook until oil separates.",
            "Pour in tamarind paste and coconut milk. Bring to a gentle simmer.",
            "Add fish pieces and cook for 5-7 minutes until the fish is tender."
        ]
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
        protein: "40g",
        ingredients: [
            { name: 'Prawns', baseQty: 500, unit: 'g' },
            { name: 'Basmati Rice', baseQty: 500, unit: 'g' },
            { name: 'Onions', baseQty: 3, unit: 'pcs' },
            { name: 'Spices', baseQty: 2, unit: 'Tbsp' },
            { name: 'Yogurt', baseQty: 100, unit: 'g' }
        ],
        steps: [
            "Clean and devein prawns. Marinate with yogurt and biryani spices.",
            "Parboil basmati rice with whole spices until 70% cooked.",
            "Saut sliced onions until golden brown.",
            "Lightly pan-fry the marinated prawns for 2-3 minutes.",
            "Layer the prawns, rice, and fried onions in a pot. Dum cook for 20 minutes."
        ]
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
        protein: "45g",
        ingredients: [
            { name: 'Mutton', baseQty: 500, unit: 'g' },
            { name: 'Onions', baseQty: 3, unit: 'pcs' },
            { name: 'Yogurt', baseQty: 200, unit: 'g' },
            { name: 'Cashews', baseQty: 50, unit: 'g' },
            { name: 'Spices', baseQty: 2, unit: 'Tbsp' }
        ],
        steps: [
            "Fry thinly sliced onions until golden and crisp. Blend with cashews and yogurt into a paste.",
            "Heat ghee in a pressure cooker. Add whole spices and mutton pieces.",
            "Sear the mutton until browned. Add ginger-garlic paste and powdered spices.",
            "Stir in the onion-yogurt paste and cook until oil separates.",
            "Add water and pressure cook until the mutton is tender (about 20-30 minutes)."
        ]
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
        protein: "28g",
        ingredients: [
            { name: 'Chicken', baseQty: 500, unit: 'g' },
            { name: 'Pita Bread', baseQty: 4, unit: 'pcs' },
            { name: 'Yogurt', baseQty: 100, unit: 'g' },
            { name: 'Garlic Sauce', baseQty: 4, unit: 'Tbsp' },
            { name: 'Pickles', baseQty: 50, unit: 'g' }
        ],
        steps: [
            "Marinate chicken in yogurt, garlic, lemon juice, and shawarma spices overnight.",
            "Grill or pan-roast the chicken until charred, then slice thinly.",
            "Warm the pita breads and spread a generous layer of garlic sauce.",
            "Add the sliced chicken, pickles, and fresh vegetables.",
            "Roll tightly and toast on a grill pan before serving."
        ]
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
        protein: "18g",
        ingredients: [
            { name: 'Eggs (Boiled)', baseQty: 6, unit: 'pcs' },
            { name: 'Onions', baseQty: 2, unit: 'pcs' },
            { name: 'Tomatoes', baseQty: 2, unit: 'pcs' },
            { name: 'Spices', baseQty: 1, unit: 'Tbsp' },
            { name: 'Coriander Leaves', baseQty: 1, unit: 'bunch' }
        ],
        steps: [
            "Hard boil the eggs, peel them, and make shallow slits on the whites.",
            "Lightly fry the boiled eggs in oil with a pinch of turmeric and chili powder.",
            "In the same pan, saut chopped onions, ginger, and garlic until golden.",
            "Add tomato puree and cook until the oil separates from the masala.",
            "Add water to adjust consistency, drop in the eggs, and simmer for 10 minutes."
        ]
    },
    "mutton-biryani": {
        name: "Mutton Biryani",
        image: "./img/mutton_biryani.png",
        price: 320,
        oldPrice: 380,
        rating: 4.8,
        time: "45 min",
        chef: "Chef Ali",
        description: "A rich and flavorful traditional Mutton Biryani, layered with fragrant basmati rice and tender pieces of meat.",
        type: "non-veg",
        ingredients: [
            { name: 'Mutton (Bone-in)', baseQty: 1, unit: 'KG' },
            { name: 'Basmati Rice', baseQty: 1, unit: 'KG' },
            { name: 'Onions (Sliced)', baseQty: 500, unit: 'g' },
            { name: 'Yogurt', baseQty: 250, unit: 'g' },
            { name: 'Spices', baseQty: 3, unit: 'Tbsp' }
        ],
        steps: [
            "Marinate mutton with yogurt, papaya paste, and spices for at least 4 hours.",
            "Parboil soaked basmati rice with whole spices until 70% cooked.",
            "Fry thinly sliced onions until golden brown (birista).",
            "In a heavy-bottomed pot, layer the marinated mutton, parboiled rice, and fried onions.",
            "Seal the pot with dough (dum) and cook on low heat for 1 to 1.5 hours."
        ]
    },
    "chicken-kebab": {
        name: "Chicken Kebab",
        image: "./img/chicken_kebab.png",
        price: 240,
        oldPrice: 290,
        rating: 4.7,
        time: "30 min",
        chef: "Chef Qureshi",
        description: "Juicy, perfectly spiced Chicken Seekh Kebabs roasted to perfection, served with fresh mint chutney.",
        type: "non-veg",
        ingredients: [
            { name: 'Chicken (Minced)', baseQty: 500, unit: 'g' },
            { name: 'Onions', baseQty: 1, unit: 'pcs' },
            { name: 'Coriander Leaves', baseQty: 1, unit: 'bunch' },
            { name: 'Spices', baseQty: 2, unit: 'Tbsp' },
            { name: 'Lemon', baseQty: 1, unit: 'pcs' }
        ],
        steps: [
            "Mix minced chicken with finely chopped onions, coriander, green chilies, and spices.",
            "Knead the mixture well and let it rest in the refrigerator for 30 minutes.",
            "Shape the mixture onto skewers into long cylindrical kebabs.",
            "Grill or pan-fry the kebabs, turning occasionally, until cooked and charred on the outside.",
            "Serve hot with mint chutney and lemon wedges."
        ]
    }

    ,
    "salmon": {
        name: "Honey Glazed Atlantic Salmon",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIc-zk1PsKRM0LdpaX9AhjeJq0yjfZaOFA-xcxLme8e0LLj3nkIzhkPQ6NSzhHVgXwC4h9XYTGp79mrJfRuaeFnRqd00PmeMwESmcDafDEcLTVRnr4mZWg9Q0uNdNmpMOM055a7SPakGaNwLicahqb7UXvrNbKtt4wJ1ZLP7U2TN9FzjC0AVzimozeKZsqkRXwYhKncIaO6RuRkengMduufBe1v8g5sLuE1vXLiLePfSFY9QVly--k",
        price: 599,
        rating: 4.9,
        time: "30 min",
        chef: "Chef Mario",
        description: "Voted #1 trending dish this week. Experience the perfect balance of sweet and savory.",
        type: "non-veg",
        calories: "450 kcal",
        protein: "35g",
        ingredients: [
            { name: 'Atlantic Salmon', baseQty: 1, unit: 'Fillet' }, { name: 'Honey', baseQty: 2, unit: 'Tbsp' }, { name: 'Soy Sauce', baseQty: 1, unit: 'Tbsp' }, { name: 'Garlic', baseQty: 2, unit: 'cloves' }, { name: 'Lemon', baseQty: 1, unit: 'pcs' }
        ],
        steps: [
            "Whisk honey, soy sauce, and minced garlic to make the glaze.", "Marinate the salmon fillet in the glaze for 15 minutes.", "Preheat oven or grill to medium-high heat.", "Cook salmon for 10-12 minutes until flaky and caramelized.", "Serve hot with a squeeze of fresh lemon."
        ]
    },
    "monster-burger": {
        name: "The Monster Burger",
        image: "./img/burger.jpg",
        price: 450,
        rating: 4.7,
        time: "25 min",
        chef: "Chef Alex",
        description: "1,240 orders today. A massive, juicy burger loaded with double patties, bacon, and cheese.",
        type: "non-veg",
        calories: "950 kcal",
        protein: "45g",
        ingredients: [
            { name: 'Beef Patties', baseQty: 2, unit: 'pcs' }, { name: 'Burger Buns', baseQty: 1, unit: 'pair' }, { name: 'Cheddar Cheese', baseQty: 2, unit: 'slices' }, { name: 'Bacon', baseQty: 3, unit: 'strips' }, { name: 'Lettuce', baseQty: 1, unit: 'leaf' }
        ],
        steps: [
            "Grill the beef patties on high heat until a crust forms, then flip.", "Add cheddar cheese slices on the patties to melt during the last minute.", "Toast the burger buns until golden brown.", "Fry the bacon strips until crispy.", "Assemble the burger with lettuce, patties, bacon, and your favorite sauces."
        ]
    },
    "buddha-bowl": {
        name: "Vitality Buddha Bowl",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDORD0wwE9AcRaqR_Qp88dr2FLiu2NPhP7c48TbqojxAd2AGs19d6DoTjgORThIXBTdSpyvZFPgaG35r3e72ENlPF45e4JvaX7yksxO1rWl3Uv21mGiIYVQPYhJkfUjbwXM7pHblcgQ_ogYN75RuX-ER0WcwPAvj40kqsMdLL_ludCL6TcNRLixzBosrtAUdxKXt-ZGn_NP0ooy-oXwahIQmpzjYL05WYKDwhy85sHnrbN1JuvTsfSU",
        price: 350,
        rating: 4.8,
        time: "20 min",
        chef: "Chef Sarah",
        description: "Top healthy choice. Packed with quinoa, roasted chickpeas, fresh greens, and tahini dressing.",
        type: "veg",
        calories: "420 kcal",
        protein: "15g",
        ingredients: [
            { name: 'Quinoa', baseQty: 100, unit: 'g' }, { name: 'Chickpeas', baseQty: 150, unit: 'g' }, { name: 'Avocado', baseQty: 0.5, unit: 'pcs' }, { name: 'Spinach', baseQty: 50, unit: 'g' }, { name: 'Tahini', baseQty: 2, unit: 'Tbsp' }
        ],
        steps: [
            "Rinse and cook quinoa according to package instructions.", "Toss chickpeas with olive oil and spices, then roast until crispy.", "Slice the avocado and wash the fresh spinach.", "Arrange quinoa, chickpeas, spinach, and avocado in a bowl.", "Drizzle generously with tahini dressing before serving."
        ]
    },
};

const RECIPE_TRANSLATIONS = {
    'chicken-biryani': {
        Hindi: [
            "चिकन को दही, मसालों और नींबू के रस के साथ कम से कम 2 घंटे के लिए मैरीनेट करें।",
            "बासमती चावल को धोकर 30 मिनट के लिए भिगो दें। चावल को साबुत मसालों के साथ 70% पकने तक उबालें।",
            "बारीक कटे प्याज को सुनहरा भूरा (बिरिस्ता) होने तक तलें और एक तरफ रख दें।",
            "एक भारी तले के बर्तन में, मैरीनेट किए हुए चिकन, उबले हुए चावल, तले प्याज और केसर के दूध की परतें बनाएं।",
            "बर्तन को आटे से बंद करें (दम) और धीमी आंच पर 45 मिनट तक पकाएं।",
            "गर्म परोसने से पहले ताजे धनिये और पुदीने की पत्तियों से सजाएं।"
        ],
        Tamil: [
            "கோழியை தயிர், மசாலா மற்றும் எலுமிச்சை சாறுடன் குறைந்தது 2 மணி நேரம் ஊற வைக்கவும்.",
            "பாஸ்மதி அரிசியை கழுவி 30 நிமிடங்கள் ஊற வைக்கவும். அரிசியை முழு மசாலாப் பொருட்களுடன் 70% வேகும் வரை கொதிக்க வைக்கவும்.",
            "மெல்லியதாக நறுக்கிய வெங்காயத்தை பொன்னிறமாக வறுத்து தனியாக வைக்கவும்.",
            "ஒரு கனமான பாத்திரத்தில், ஊறவைத்த கோழி, வேகவைத்த அரிசி, வறுத்த வெங்காயம் மற்றும் குங்குமப்பூ பால் ஆகியவற்றை லேயர்களாக அடுக்கவும்.",
            "பாத்திரத்தை மாவு கொண்டு மூடி (தம்) குறைந்த தீயில் 45 நிமிடங்கள் சமைக்கவும்.",
            "சூடாக பரிமாறும் முன் புதிய கொத்தமல்லி மற்றும் புதினா இലകളால் அலங்கரிக்கவும்."
        ],
        Telugu: [
            "చికెన్‌ను పెరుగు, మసాలాలు మరియు నిమ్మరసంతో కనీసం 2 గంటల పాటు నానబెట్టండి.",
            "బాస్మతి బియ్యాన్ని కడిగి 30 నిమిషాల పాటు నానబెట్టండి. బియ్యాన్ని హోల్ మసాలాలతో 70% ఉడికే వరకు ఉడికించాలి.",
            "సన్నగా తరిగిన ఉల్లిపాయలను బంగారు గోధుమ రంగులోకి వచ్చే వరకు వేయించి పక్కన పెట్టండి.",
            "ఒక మందపాటి పాత్రలో, నానబెట్టిన చికెన్, ఉడికించిన అన్నం, వేయించిన ఉల్లిపాయలు మరియు కుంకుమపువ్వు పాలు లేయర్‌లుగా వేయండి.",
            "పాత్రను పిండితో సీల్ చేసి (దమ్) చిన్న మంటపై 45 నిమిషాల పాటు ఉడికించాలి.",
            "వేడిగా వడ్డించే ముందు తాజా కొత్తిమీర మరియు పుదీనా ఆకులతో అలంకరించండి."
        ],
        Malayalam: [
            "ചിക്കൻ തൈര്, മസാലകൾ, നാരങ്ങാനീര് എന്നിവ ചേർത്ത് കുറഞ്ഞത് 2 മണിക്കൂർ മാരിനേറ്റ് ചെയ്യുക.",
            "ബാസ്മതി അരി കഴുകി 30 മിനിറ്റ് കുതിർക്കുക. അരി മുഴുവൻ മസാലകൾ ചേർത്ത് 70% വേവുന്നതുവരെ തിളപ്പിക്കുക.",
            "നേർത്തതായി അരിഞ്ഞ സവാള പൊൻനിറമാകുന്നതുവരെ വറുത്ത് മാറ്റിവെക്കുക.",
            "അടിഭാഗം കട്ടിയുള്ള ഒരു പാത്രത്തിൽ, മാരിനേറ്റ് ചെയ്ത ചിക്കൻ, പകുതി വേവിച്ച ചോറ്, വറുത്ത സവാള, കുങ്കുമപ്പൂ പാൽ എന്നിവ ലെയറുകളായി വെക്കുക.",
            "പാത്രം മാവ് കൊണ്ട് അടച്ച് (ദം) കുറഞ്ഞ തീയിൽ 45 മിനിറ്റ് വേവിക്കുക.",
            "ചൂടോടെ വിളമ്പുന്നതിന് മുമ്പ് പുതിയ മല്ലിയിലയും പുതിനയിലയും ഉപയോഗിച്ച് അലങ്കരിക്കുക."
        ]
    },
    'masala-dosa': {
        Hindi: [
            "राई, कढ़ी पत्ता और प्याज को तड़का लगाकर, उसमें उबले आलू और हल्दी मिलाकर आलू का मसाला तैयार करें।",
            "एक नॉन-स्टिक या लोहे के तवे को गर्म करें और एक कलछी बैटर डालकर उसे गोलाकार घुमाते हुए फैलाएं।",
            "किनारों पर घी या तेल डालें और नीचे का हिस्सा कुरकुरा और सुनहरा भूरा होने तक पकाएं।",
            "तवे के बीच में आलू मसाले का एक बड़ा चम्मच रखें।",
            "डोसा मोड़ें और नारियल की चटनी और गरमागरम सांभर के साथ तुरंत परोसें।"
        ],
        Tamil: [
            "கடுகு, கறிவேப்பிலை, வெங்காயம் தாளித்து, வேகவைத்த உருளைக்கிழங்கு மற்றும் மஞ்சள் தூள் சேர்த்து உருளைக்கிழங்கு மசாலாவை தயார் செய்யவும்.",
            "ஒரு நான்-ஸ்டிக் அல்லது இரும்பு தவாவை சூடாக்கி, ஒரு கரண்டி மாவை ஊற்றி, வட்ட வடிவில் பரப்பவும்.",
            "சுற்றிலும் நெய் அல்லது எண்ணெய் ஊற்றி, அடிப்பகுதி மொறுமொறுப்பாகவும் பொன்னிறமாகவும் மாறும் வரை சமைக்கவும்.",
            "மத்தியில் உருளைக்கிழங்கு மசாலாவை ஒரு பெரிய கரண்டி வைக்கவும்.",
            "தோசையை மடித்து தேங்காய் சட்னி மற்றும் சூடான சாம்பாருடன் உடனே பரிமாறவும்."
        ],
        Telugu: [
            "ఆవాలు, కరివేపాకు, ఉల్లిపాయలు పోపు వేసి, ఉడికించిన బంగాళాదుంపలు మరియు పసుపు కలపడం ద్వారా బంగాళాదుంప మసాలాను తయారు చేయండి.",
            "నాన్-స్టిక్ లేదా ఇనుప పెనం వేడి చేసి, ఒక గరిటె పిండిని పోసి, వృత్తాకారంలో పరచండి.",
            "అంచుల చుట్టూ నెయ్యి లేదా నూనె వేసి, అడుగు భాగం క్రిస్పీగా మరియు బంగారు రంగులోకి వచ్చే వరకు ఉడికించాలి.",
            "మధ్యలో బంగాళాదుంప మసాలాను ఉంచండి.",
            "దోసను మడిచి కొబ్బరి చట్నీ మరియు వేడి సాంబార్‌తో వెంటనే వడ్డించండి."
        ],
        Malayalam: [
            "കടുക്, കറിവേപ്പില, സവാള എന്നിവ വഴറ്റി, പുഴുങ്ങിയ ഉരുളക്കിഴങ്ങും മഞ്ഞൾപ്പൊടിയും ചേർത്ത് ഉരുളക്കിഴങ്ങു മസാല തയ്യാറാക്കുക.",
            "ഒരു നോൺ-സ്റ്റിക് അല്ലെങ്കിൽ ഇരുമ്പ് തവ ചൂടാക്കി ഒരു തവി മാവ് ഒഴിച്ച് വൃത്താകൃതിയിൽ പരത്തുക.",
            "ചുറ്റും നെയ്യ് അല്ലെങ്കിൽ എണ്ണ ഒഴിച്ച് അടിഭാഗം മൊരിഞ്ഞ് പൊൻനിറമാകുന്നതുവരെ വേവിക്കുക.",
            "മധ്യത്തിൽ ഉരുളക്കിഴങ്ങ് മസാല വെക്കുക.",
            "ദോശ മടക്കി തേങ്ങാ ചട്ണിയും ചൂടുള്ള സാമ്പാറും ചേർത്ത് ഉടൻ വിളമ്പുക."
        ]
    },
    'paneer-tikka': {
        Hindi: [
            "मैरिनेड बनाने के लिए गाढ़े दही (हंग कर्ड) में टिक्का मसाला, अदरक-लहसुन का पेस्ट और सरसों का तेल मिलाएं।",
            "पनीर के टुकड़े, शिमला मिर्च और प्याज के टुकड़ों पर मैरिनेड को अच्छी तरह से लगाएं।",
            "इसे कम से कम 1 घंटे के लिए फ्रिज में रख दें।",
            "पनीर और सब्जियों को एक के बाद एक सीख (स्क्यूअर) में पिरोएं।",
            "ओवन या तंदूर में 200°C पर 15-20 मिनट के लिए ग्रिल करें, आधे समय पर मक्खन लगाएं।",
            "चाट मसाला छिड़कें और पुदीने की चटनी और नींबू के टुकड़ों के साथ गरमागरम परोसें।"
        ],
        Tamil: [
            "தயிர், டிக்கா மசாலா, இஞ்சி-பூண்டு விழுது மற்றும் கடுகு எண்ணெய் சேர்த்து மசாலாவை தயார் செய்யவும்.",
            "பன்னீர் துண்டுகள், குடைமிளகாய் மற்றும் வெங்காயத் துண்டுகளில் மசாலாவை சமமாக தடவவும்.",
            "இதை குளிர்சாதன பெட்டியில் குறைந்தது 1 மணி நேரம் வைக்கவும்.",
            "பன்னீர் மற்றும் காய்கறி துண்டுகளை மாறி மாறி கம்பியில் (ஸ்கூவர்) சொருகவும்.",
            "அடுப்பில் 200°C வெப்பநிலையில் 15-20 நிமிடங்கள் கிரில் செய்யவும், பாதியில் வெண்ணெய் தடவவும்.",
            "சாட் மசாலா தூவி, புதினா சட்னி மற்றும் எலுமிச்சம்பழ துண்டுகளுடன் சூடாக பரிமாறவும்."
        ],
        Telugu: [
            "మారినేడ్ చేయడానికి గడ్డ పెరుగులో టిక్కా మసాలా, అల్లం-వెల్లుల్లి పేస్ట్ మరియు ఆవాల నూనె కలపండి.",
            "పనీర్ ముక్కలు, క్యాప్సికమ్ మరియు ఉల్లిపాయ ముక్కలపై మారినేడ్‌ను సమానంగా రాయండి.",
            "దీనిని ఫ్రిజ్‌లో కనీసం 1 గంట పాటు ఉంచండి.",
            "పనీర్ మరియు కూరగాయల ముక్కలను ఒకదాని తర్వాత ఒకటి స్కేవర్స్‌పై గుచ్చండి.",
            "ఓవెన్ లేదా తందూర్‌లో 200°C వద్ద 15-20 నిమిషాల పాటు గ్రిల్ చేయండి, మధ్యలో వెన్న రాయండి.",
            "చాట్ మసాలా చల్లి, పుదీనా చట్నీ మరియు నిమ్మకాయ ముక్కలతో వేడిగా వడ్డించండి."
        ],
        Malayalam: [
            "മാരിനേഡ് ഉണ്ടാക്കാൻ കട്ട തൈരിൽ ടിക്ക മസാല, ഇഞ്ചി-വെളുത്തുള്ളി പേസ്റ്റ്, കടുക് എണ്ണ എന്നിവ മിക്സ് ചെയ്യുക.",
            "പനീർ കഷ്ണങ്ങൾ, കാപ്സിക്കം, സവാള കഷ്ണങ്ങൾ എന്നിവയിൽ മാരിനേറ്റ് ചെയ്ത മിശ്രിതം നന്നായി തേച്ചുപിടിപ്പിക്കുക.",
            "ഇത് ഫ്രിഡ്ജിൽ കുറഞ്ഞത് 1 മണിക്കൂർ വെക്കുക.",
            "പനീറും പച്ചക്കറികളും മാറിമാറി കമ്പിയിൽ (സ്ക്യൂവർ) കോർക്കുക.",
            "അടുപ്പിൽ 200°C-ൽ 15-20 മിനിറ്റ് ഗ്രിൽ ചെയ്യുക, പകുതിയാകുമ്പോൾ വെണ്ണ പുരട്ടുക.",
            "ചാറ്റ് മസാല വിതറി പുതിന ചട്ണിയും നാരങ്ങയും ചേർത്ത് ചൂടോടെ വിളമ്പുക."
        ]
    },
    'dhal-soup': {
        Hindi: [
            "दाल को अच्छी तरह धो लें और हल्दी, नमक और 3 कप पानी के साथ पूरी तरह नरम होने तक प्रेशर कुक करें।",
            "पकी हुई दाल को चिकना होने तक मथें। आवश्यकतानुसार गर्म पानी मिलाकर गाढ़ापन सही करें।",
            "एक छोटे पैन में घी गर्म करें और तड़के के लिए जीरा, बारीक कटा लहसुन और एक चुटकी हींग डालें।",
            "लहसुन सुनहरा होने पर तड़के को तुरंत दाल के ऊपर डालें।",
            "2 मिनट तक उबालें, हरी धनिया से सजाएं और सूप की तरह या चावल के साथ गरमागरम परोसें।"
        ],
        Tamil: [
            "பருப்பை நன்றாகக் கழுவி, மஞ்சள் தூள், உப்பு மற்றும் 3 கப் தண்ணீருடன் குக்கரில் வேக வைக்கவும்.",
            "வேகவைத்த பருப்பை மசித்து விடவும். தேவைப்பட்டால் சூடான தண்ணீர் சேர்த்துக்கொள்ளவும்.",
            "ஒரு சிறிய கடாயில் நெய்யை சூடாக்கி, சீரகம், பூண்டு மற்றும் பெருங்காயத்தூள் சேர்த்து தாளிக்கவும்.",
            "பூண்டு பொன்னிறமாக மாறியதும், தாளித்ததை பருப்பில் கொட்டவும்.",
            "2 நிமிடங்கள் கொதிக்க வைத்து, கொத்தமல்லி தழை தூவி சூடாக பரிமாறவும்."
        ],
        Telugu: [
            "పప్పును బాగా కడిగి పసుపు, ఉప్పు మరియు 3 కప్పుల నీటితో మెత్తగా ఉడికించాలి.",
            "ఉడికించిన పప్పును మెత్తగా చేయండి. అవసరమైతే వేడి నీటిని జోడించండి.",
            "ఒక చిన్న పాన్‌లో నెయ్యి వేడి చేసి, పోపు కోసం జీలకర్ర, తరిగిన వెల్లుల్లి మరియు ఇంగువ వేయండి.",
            "వెల్లుల్లి బంగారు రంగులోకి మారిన తర్వాత, పోపును పప్పులో వేయండి.",
            "2 నిമിషాలు ఉడికించి, కొత్తిమీరతో అలంకరించి వేడిగా వడ్డించండి."
        ],
        Malayalam: [
            "പരിപ്പ് നന്നായി കഴുകി മഞ്ഞൾപ്പൊടി, ഉപ്പ്, 3 കപ്പ് വെള്ളം എന്നിവ ചേർത്ത് വേവിക്കുക.",
            "വേവിച്ച പരിപ്പ് നന്നായി ഉടച്ചെടുക്കുക. ആവശ്യാനുസരണം ചൂടുവെള്ളം ചേർക്കുക.",
            "ഒരു ചെറിയ പാനിൽ നെയ്യ് ചൂടാക്കി കടുക്, ജീരകം, വെളുത്തുള്ളി, കായം എന്നിവ ചേർത്ത് താളിക്കുക.",
            "വെളുത്തുള്ളി പൊൻനിറമാകുമ്പോൾ താളിച്ചത് പരിപ്പിലേക്ക് ഒഴിക്കുക.",
            "2 മിനിറ്റ് തിളപ്പിച്ച് മല്ലിയില ചേർത്ത് ചൂടോടെ വിളമ്പുക."
        ]
    },
    'samosa': {
        Hindi: [
            "मैदा, अजवाइन, नमक और घी/तेल मिलाकर सख्त आटा गूंथ लें और 30 मिनट के लिए रख दें।",
            "उबले आलू, मटर, हरी मिर्च और मसालों को भूनकर भरावन तैयार करें।",
            "आटे की छोटी लोइयां बनाकर अंडाकार बेलें और आधा काट लें।",
            "प्रत्येक आधे हिस्से से एक कोन बनाएं, आलू का भरावन भरें और पानी से किनारों को सील करें।",
            "समोसे को धीमी-मध्यम आंच पर सुनहरा और कुरकुरा होने तक डीप फ्राई करें।",
            "इमली की मीठी चटनी और तीखी हरी चटनी के साथ गरमागरम परोसें।"
        ],
        Tamil: [
            "மைதா, ஓமம், உப்பு மற்றும் நெய்/எண்ணெய் சேர்த்து மாவை பிசைந்து 30 நிமிடங்கள் வைக்கவும்.",
            "வேகவைத்த உருளைக்கிழங்கு, பட்டாணி, பச்சை மிளகாய் மற்றும் மசாலா சேர்த்து பூரணத்தை தயார் செய்யவும்.",
            "மாவை சிறிய உருண்டைகளாக உருட்டி, வட்டமாக தேய்த்து பாதியாக நறுக்கவும்.",
            "ஒவ்வொரு பாதியையும் கூம்பு வடிவில் மடித்து, உருளைக்கிழங்கு மசாலாவை வைத்து ஓரங்களை தண்ணீருடன் ஒட்டவும்.",
            "சமோசாக்களை பொன்னிறமாகவும் மொறுமொறுப்பாகவும் மாறும் வரை குறைந்த தீயில் வறுத்தெடுக்கவும்.",
            "புளி சட்னி மற்றும் காரமான பச்சை சட்னியுடன் சூடாக பரிமாறவும்."
        ],
        Telugu: [
            "మైదా, వాము, ఉప్పు మరియు నెయ్యి/నూనెతో పిండిని గట్టిగా కలుపుకుని 30 నిమిషాలు పక్కన పెట్టండి.",
            "ఉడికించిన బంగాళాదుంపలు, బఠానీలు, పచ్చిమిర్చి మరియు మసాలాలను వేయించి స్టఫింగ్ తయారు చేసుకోండి.",
            "పిండిని చిన్న చిన్న ఉండలుగా చేసి, చపాతీలా రుద్ది సగానికి కట్ చేయండి.",
            "సగం భాగంతో కోన్ చేసి, బంగాళాదుంప స్టఫింగ్ నింపి అంచులను నీటితో సీల్ చేయండి.",
            "సమోసాలను చిన్న మంటపై బంగారు రంగులోకి వచ్చే వరకు డీప్ ఫ్రై చేయండి.",
            "చింతపండు చట్నీ మరియు పచ్చి చట్నీతో వేడిగా వడ్డించండి."
        ],
        Malayalam: [
            "മൈദ, അയമോദകം, ഉപ്പ്, നെയ്യ്/എണ്ണ എന്നിവ ചേർത്ത് കട്ടിയുള്ള മാവ് കുഴച്ച് 30 മിനിറ്റ് വെക്കുക.",
            "ഉരുളക്കിഴങ്ങ്, പച്ചപ്പട്ടാണി, പച്ചമുളക്, മസാലകൾ എന്നിവ വഴറ്റി ഫില്ലിംഗ് തയ്യാറാക്കുക.",
            "മാവ് ചെറിയ ഉരുളകളാക്കി പരത്തി പകുതിയായി മുറിക്കുക.",
            "ഓരോ പകുതിയും കോൺ ആകൃതിയിലാക്കി ഉരുളക്കിഴങ്ങ് മസാല നിറച്ച് അരികുകൾ ഒട്ടിക്കുക.",
            "ചൂടുള്ള എണ്ണയിൽ സമോസകൾ പൊൻനിറമാകുന്നതുവരെ വറുത്തെടുക്കുക.",
            "പുളി ചട്ണിക്കും പച്ച ചട്ണിക്കുംൊപ്പം ചൂടോടെ വിളമ്പുക."
        ]
    },
    'butter-chicken': {
        Hindi: [
            "चिकन को दही, अदरक-लहसुन पेस्ट और मिर्च पाउडर में मैरीनेट करें। ग्रिल या फ्राई करें।",
            "टमाटर, प्याज, काजू, लहसुन और साबुत मसालों को पानी में 20 मिनट तक उबालें।",
            "मिश्रण को पीसकर महीन प्यूरी बनाएं और छान लें।",
            "पैन में मक्खन पिघलाएं, प्यूरी डालें, कसूरी मेथी और थोड़ी चीनी मिलाएं।",
            "पका हुआ चिकन डालें और 10 मिनट तक उबालें। क्रीम डालें और नान के साथ परोसें।"
        ],
        Tamil: [
            "தயிரில் இஞ்சி-பூண்டு விழுது, மிளகாய்த்தூள் சேர்த்து சிக்கனை ஊறவைத்து கிரில் செய்யவும்.",
            "தக்காளி, வெங்காயம், முந்திரி, பூண்டு மற்றும் முழு மசாலாக்களை 20 நிமிடங்கள் வேக வைக்கவும்.",
            "கலவையை அரைத்து மென்மையான விழுதாக வடிகட்டவும்.",
            "கடாயில் வெண்ணெய் உருக்கி, விழுதை ஊற்றி, கசூரி மேதி மற்றும் சர்க்கரை சேர்க்கவும்.",
            "சமைத்த சிக்கன் துண்டுகளைச் சேர்த்து 10 நிமிடங்கள் கொதிக்க வைக்கவும். கிரீம் சேர்த்து பரிமாறவும்."
        ],
        Telugu: [
            "పెరుగు, అల్లం-వెల్లుల్లి పేస్ట్, కారం పొడితో చికెన్ నానబెట్టి గ్రిల్ లేదా ఫ్రై చేయండి.",
            "టమోటాలు, ఉల్లిపాయలు, జీడిపప్పు, వెల్లుల్లి, మసాలాలను నీటిలో 20 నిమిషాలు ఉడికించండి.",
            "మిశ్రమాన్ని మిక్సీ పట్టి వడకట్టండి.",
            "పాన్‌లో వెన్న కరిగించి, ప్యూరీ పోసి, కసూరి మేతి, కొద్దిగా చక్కెర వేయండి.",
            "ఉడికించిన చికెన్ ముక్కలను వేసి 10 నిమిషాలు ఉడికించండి. క్రీమ్ వేసి వడ్డించండి."
        ],
        Malayalam: [
            "തൈര്, ഇഞ്ചി-വെളുത്തുള്ളി പേസ്റ്റ്, മുളകുപൊടി എന്നിവ ചേർത്ത് ചിക്കൻ മാരിനേറ്റ് ചെയ്ത് ഫ്രൈ ചെയ്യുക.",
            "തക്കാളി, സവാള, അണ്ടിപ്പരിപ്പ്, വെളുത്തുള്ളി, മസാലകൾ എന്നിവ 20 മിനിറ്റ് വേവിക്കുക.",
            "മിശ്രിതം അരച്ച് അരിച്ചെടുക്കുക.",
            "പാനിൽ വെണ്ണ ഉരുക്കി പ്യൂരി ഒഴിച്ച് കസൂരി മേത്തിയും പഞ്ചസാരയും ചേർക്കുക.",
            "വേവിച്ച ചിക്കൻ കഷ്ണങ്ങൾ ചേർത്ത് 10 മിനിറ്റ് തിളപ്പിക്കുക. ക്രീം ചേർക്കുക."
        ]
    },
    'palak-paneer': {
        Hindi: [
            "पालक को उबलते पानी में 2 मिनट के लिए डालें, फिर तुरंत बर्फ के पानी में डालें।",
            "पालक और हरी मिर्च को पीसकर चिकना पेस्ट बना लें।",
            "बारीक कटे प्याज, लहसुन और अदरक को भूनें, फिर मसाले (धनिया, जीरा) डालें।",
            "पालक की प्यूरी डालें और 5-7 मिनट उबालें। ज्यादा न पकाएं।",
            "पनीर के टुकड़े और क्रीम मिलाएं। रोटी या चावल के साथ गरमागरम परोसें।"
        ],
        Tamil: [
            "பாலக்கீரை இலைகளை கொதிக்கும் நீரில் 2 நிமிடங்கள் வேகவைத்து, பின் ஐஸ் தண்ணீரில் போடவும்.",
            "கீரை மற்றும் பச்சை மிளகாயை அரைத்து மென்மையான விழுதாக்கவும்.",
            "வெங்காயம், பூண்டு, இஞ்சியை வதக்கி, மசாலா தூள் சேர்க்கவும்.",
            "கீரை விழுதை ஊற்றி 5-7 நிமிடங்கள் கொதிக்க வைக்கவும். அதிகம் வேக வைக்க வேண்டாம்.",
            "பன்னீர் துண்டுகள் மற்றும் கிரீம் சேர்க்கவும். சூடாக பரிமாறவும்."
        ],
        Telugu: [
            "పాలకూరను మరిగే నీటిలో 2 నిమిషాలు ఉంచి, వెంటనే చల్లటి నీటిలో వేయండి.",
            "పాలకూర, పచ్చిమిర్చి కలిపి మెత్తటి ప్యూరీ చేయండి.",
            "తరిగిన ఉల్లిపాయలు, వెల్లుల్లి, అల్లం వేయించి, ధనియాలు, జీలకర్ర పొడి వేయండి.",
            "పాలకూర ప్యూరీ పోసి 5-7 నిమిషాలు ఉడికించండి. ఎక్కువ ఉడికించవద్దు.",
            "పనీర్ ముక్కలు, క్రీమ్ వేయండి. వేడిగా వడ్డించండి."
        ],
        Malayalam: [
            "ചീര തിളച്ച വെള്ളത്തിൽ 2 മിനിറ്റ് വേവിക്കുക, തുടർന്ന് തണുത്ത വെള്ളത്തിൽ മുക്കി വെക്കുക.",
            "ചീര പച്ചമുളക് ചേർത്ത് അരച്ചെടുക്കുക.",
            "സവാള, വെളുത്തുള്ളി, ഇഞ്ചി എന്നിവ വഴറ്റി മസാലകൾ ചേർക്കുക.",
            "ചീര പ്യൂരി ഒഴിച്ച് 5-7 മിനിറ്റ് തിളപ്പിക്കുക.",
            "പനീർ കഷ്ണങ്ങളും ക്രീമും ചേർക്കുക."
        ]
    },
    'chole-bhature': {
        Hindi: [
            "चने को रात भर भिगोएं। नमक और टी-बैग के साथ प्रेशर कुक करें ताकि गहरा रंग आ जाए।",
            "मसाले के लिए प्याज, टमाटर और छोले मसाला को तेल अलग होने तक भूनें, फिर चने डालें।",
            "ग्रेवी गाढ़ी होने तक छोले को धीमी आंच पर पकाएं।",
            "भटूरे के लिए मैदा को दही, बेकिंग सोडा, नमक और तेल के साथ गूंथें। 2 घंटे रखें।",
            "लोई बनाकर गोल बेलें और तेज गर्म तेल में पूरी तरह फूलने तक तलें।",
            "तीखे छोले को गरमागरम भटूरे और प्याज के साथ परोसें।"
        ],
        Tamil: [
            "கொண்டைக்கடலையை இரவு முழுவதும் ஊறவைக்கவும். உப்பு மற்றும் டீ பேக் சேர்த்து குக்கரில் வேகவைக்கவும்.",
            "வெங்காயம், தக்காளி, சோலே மசாலாவை வதக்கி, வேகவைத்த கொண்டைக்கடலையை சேர்க்கவும்.",
            "மசாலா கெட்டியாகும் வரை சோலேவை கொதிக்க வைக்கவும்.",
            "மைதாவை தயிர், சமையல் சோடா, உப்பு சேர்த்து பிசைந்து 2 மணி நேரம் வைக்கவும்.",
            "மாவை தேய்த்து சூடான எண்ணெயில் பொன்னிறமாக பொரித்தெடுக்கவும்.",
            "காரசாரமான சோலேவை சூடான பட்டூரியுடன் பரிமாறவும்."
        ],
        Telugu: [
            "శెనగలను రాత్రంతా నానబెట్టండి. ఉప్పు, టీ బ్యాగ్‌తో మెత్తగా ఉడికించండి.",
            "ఉల్లిపాయలు, టమోటాలు, చోలే మసాలా వేయించి, ఉడికించిన శెనగలు వేయండి.",
            "చోలే గ్రేవీ చిక్కబడే వరకు ఉడికించండి.",
            "మైదాను పెరుగు, వంట సోడా, ఉప్పుతో కలుపుకుని 2 గంటలు పక్కన పెట్టండి.",
            "పిండిని పూరీల్లా రుద్ది వేడి నూనెలో డీప్ ఫ్రై చేయండి.",
            "చోలేను వేడి భటూరాలతో వడ్డించండి."
        ],
        Malayalam: [
            "കടല രാത്രി മുഴുവൻ കുതിർക്കുക. ഉപ്പും ചായപ്പൊടി കിഴിയും ചേർത്ത് വേവിച്ചെടുക്കുക.",
            "സവാള, തക്കാളി, ചോലെ മസാല എന്നിവ വഴറ്റി വേവിച്ച കടല ചേർക്കുക.",
            "ചോലെ കുറുകുന്നതുവരെ തിളപ്പിക്കുക.",
            "മൈദ തൈര്, ബേക്കിംഗ് സോഡ, ഉപ്പ് എന്നിവ ചേർത്ത് കുഴച്ച് 2 മണിക്കൂർ വെക്കുക.",
            "മാവ് പരത്തി ചൂടുള്ള എണ്ണയിൽ വറുത്തെടുക്കുക.",
            "ചൂടുള്ള ബട്ടൂരയോടൊപ്പം വിളമ്പുക."
        ]
    },
    'gulab-jamun': {
        Hindi: [
            "चीनी और पानी को इलायची और केसर के साथ उबालकर चाशनी तैयार करें (तार की जरूरत नहीं)।",
            "खोया और पनीर को कद्दूकस करें, थोड़ा मैदा मिलाएं और बिना क्रैक के चिकना आटा गूंथ लें।",
            "छोटी-छोटी गोलियां बनाएं (ध्यान रहे गोलियों में कोई दरार न हो)।",
            "धीमी आंच पर घी या तेल में गोलियों को सुनहरा भूरा होने तक तलें।",
            "तले हुए जामुन को गर्म चाशनी में डालें और कम से कम 2 घंटे के लिए भीगने दें।"
        ],
        Tamil: [
            "சர்க்கரை, தண்ணீர், ஏலக்காய் மற்றும் குங்குமப்பூ சேர்த்து சர்க்கரை பாகு தயார் செய்யவும்.",
            "கோவா மற்றும் பன்னீரை துருவி, மைதா சேர்த்து விரிசல் இல்லாமல் பிசையவும்.",
            "சிறிய உருண்டைகளாக உருட்டவும் (விரிசல் இருக்கக்கூடாது).",
            "நெய் அல்லது எண்ணெயில் பொன்னிறமாகும் வரை குறைந்த தீயில் வறுக்கவும்.",
            "வறுத்த ஜாமூன்களை சூடான பாகில் போட்டு 2 மணி நேரம் ஊற வைக்கவும்."
        ],
        Telugu: [
            "చక్కెర, నీరు, యాలకులు మరియు కుంకుమపువ్వు మరిగించి చక్కెర సిరప్ తయారు చేయండి.",
            "కోవా, పనీర్ తురిమి, మైదా వేసి పిండిని ముద్దలా కలుపుకోండి.",
            "చిన్న చిన్న ఉండలుగా చేసుకోండి (బిరుకులు ఉండకూడదు).",
            "నెయ్యి లేదా నూనెలో చిన్న మంటపై బంగారు రంగులోకి వచ్చే వరకు వేయించండి.",
            "వేయించిన జామూన్లను వేడి సిరప్‌లో వేసి 2 గంటలు నానబెట్టండి."
        ],
        Malayalam: [
            "പഞ്ചസാര, വെള്ളം, ഏലയ്ക്ക, കുങ്കുമപ്പൂവ് എന്നിവ ചേർത്ത് ഷുഗർ സിറപ്പ് തയ്യാറാക്കുക.",
            "കോവയും പനീറും ചിരകി മൈദ ചേർത്ത് കുഴച്ചെടുക്കുക.",
            "ചെറിയ ഉരുളകളാക്കി മാറ്റുക (വിള്ളലുകൾ ഉണ്ടാകരുത്).",
            "നെയ്യിലോ എണ്ണയിലോ ചെറിയ തീയിൽ പൊൻനിറമാകുന്നതുവരെ വറുത്തെടുക്കുക.",
            "വറുത്ത ജാമൂനുകൾ ചൂടുള്ള സിറപ്പിൽ ഇട്ട് 2 മണിക്കൂർ കുതിർക്കാൻ വെക്കുക."
        ]
    },
    'buddha-bowl': {
        Hindi: [
            "क्विनोआ को धोकर निर्देशानुसार पका लें।",
            "काबुली चने को जैतून के तेल और मसालों के साथ मिलाएं, फिर कुरकुरा होने तक भूनें।",
            "एवोकैडो को काटें और ताजी पालक को धो लें।",
            "एक कटोरे में क्विनोआ, चने, पालक और एवोकैडो को सजाएं।",
            "परोसने से पहले ऊपर से ताहिनी ड्रेसिंग डालें।"
        ],
        Tamil: [
            "குயினோவாவை நன்றாகக் கழுவி வேக வைக்கவும்.",
            "கொண்டைக்கடலையில் ஆலிവ് எண்ணெய் மற்றும் மசாலா சேர்த்து மொறுமொறுப்பாக வறுக்கவும்.",
            "அவகேடோவை நறுக்கி, பாலக்கீரையை கழுவவும்.",
            "ஒரு கிண்ணத்தில் குயினോவா, கொண்டைக்கடலை, கீரை மற்றும் அவகேடோவை அடுக்கவும்.",
            "பரிமாறுவதற்கு முன் தஹினி சாஸ் ஊற்றவும்."
        ],
        Telugu: [
            "క్వినోవాను కడిగి ఉడికించండి.",
            "శెనగలలో ఆలివ్ నూనె, మసాలాలు కలిపి క్రిస్పీగా వేయించండి.",
            "ఆవకాడో ముక్కలు చేసి, పాలకూర కడగండి.",
            "ఒక బౌల్‌లో క్వినోవా, శెనగలు, పాలకూర, ఆవకాడో అమర్చండి.",
            "వడ్డించే ముందు తహిని డ్రెస్సింగ్ వేయండి."
        ],
        Malayalam: [
            "ക്വിനോവ കഴുകി വേവിച്ചെടുക്കുക.",
            "കടല ഒലിവ് ഓയിലും മസാലകളും ചേർത്ത് വറുത്തെടുക്കുക.",
            "അവോക്കാഡോ കഷ്ണങ്ങളാക്കി ചീര കഴുകി വെക്കുക.",
            "ഒരു ബൗളിൽ ക്വിനോവ, കടല, ചീര, അവോക്കാഡോ എന്നിവ വെക്കുക.",
            "തഹിനി സോസ് ഒഴിച്ച് വിളമ്പുക."
        ]
    }
};

function generateAICookingTips(recipeId, callback) {
    const recipe = RECIPES[recipeId];
    if (!recipe) {
        callback("I couldn't find that recipe!");
        return;
    }

    const tips = [
        `Hungry AI: Let's get cooking! Here are some pro-tips for perfecting your ${recipe.name}:`,
        `Hungry AI: Prep is key. Make sure all your ingredients are measured out before you start. Especially the ${recipe.ingredients[0].name.toLowerCase()}.`,
        `Hungry AI: Heat management is crucial. For Indian cooking, letting your spices temper (bloom) in hot oil or ghee releases their essential oils. But don't let them burn!`,
        `Hungry AI: Don't rush step 1: "${recipe.steps[0]}" is crucial for building the foundational flavor. Take your time here.`,
        `Hungry AI: Secret ingredient: Always finish with a pinch of freshly ground cardamom or garam masala right at the end to lock in the aroma!`,
        `Hungry AI: Need help with a specific step? Just ask!`
    ];

    // Simulate typing delay
    let currentTip = 0;
    const interval = setInterval(() => {
        if (currentTip < tips.length) {
            callback(tips[currentTip]);
            currentTip++;
        } else {
            clearInterval(interval);
        }
    }, 2000); // Send a new message every 2 seconds
}

function chatWithAI(recipe, userMessage, callback) {
    let response = "";
    let lowerMsg = userMessage.toLowerCase();

    // Retrieve cooking language from DOM
    const lang = document.getElementById('cook-lang-select') ? document.getElementById('cook-lang-select').value : 'English';
    const recipeId = recipe.id || Object.keys(RECIPES).find(key => RECIPES[key].name === recipe.name) || 'chicken-biryani';

    const isHindi = lang === 'Hindi';
    const isTamil = lang === 'Tamil';
    const isTelugu = lang === 'Telugu';
    const isMalayalam = lang === 'Malayalam';

    if (lowerMsg.includes("ingredient") || lowerMsg.includes("measure") || lowerMsg.includes("how much") || lowerMsg.includes("quantity")) {
        if (isHindi) {
            response = `<b>${recipe.name}</b> के लिए सटीक सामग्री की मात्रा नीचे दी गई है:<br><ul class="list-disc pl-4 mt-2">`;
        } else if (isTamil) {
            response = `<b>${recipe.name}</b>-க்கான சரியான பொருட்களின் அளவுகள் கீழே கொடுக்கப்பட்டுள்ளன:<br><ul class="list-disc pl-4 mt-2">`;
        } else if (isTelugu) {
            response = `<b>${recipe.name}</b> కొరకు ఖచ్చితమైన కొలతలు క్రింద ఇవ్వబడ్డాయి:<br><ul class="list-disc pl-4 mt-2">`;
        } else if (isMalayalam) {
            response = `<b>${recipe.name}</b>-ന്റെ കൃത്യമായ ചേരുവകളുടെ അളവുകൾ താഴെ നൽകുന്നു:<br><ul class="list-disc pl-4 mt-2">`;
        } else {
            response = `Here are the exact measurements for <b>${recipe.name}</b>:<br><ul class="list-disc pl-4 mt-2">`;
        }

        recipe.ingredients.forEach(ing => {
            response += `<li><b>${ing.name}</b>: ${ing.baseQty} ${ing.unit}</li>`;
        });
        response += `</ul>`;
    } else if (lowerMsg.includes("step") || lowerMsg.includes("how to") || lowerMsg.includes("method") || lowerMsg.includes("instruct") || lowerMsg.includes("make") || lowerMsg.includes("guide")) {
        if (isHindi) {
            response = `<b>${recipe.name}</b> बनाने की चरण-दर-चरण विधि नीचे दी गई है:<br><ol class="list-decimal pl-4 mt-2">`;
        } else if (isTamil) {
            response = `<b>${recipe.name}</b> சமைப்பதற்கான படிப்படியான முறை கீழே கொடுக்கப்பட்டுள்ளது:<br><ol class="list-decimal pl-4 mt-2">`;
        } else if (isTelugu) {
            response = `<b>${recipe.name}</b> వండడానికి దశల వారీ పద్ధతి క్రింద ఇవ్వబడింది:<br><ol class="list-decimal pl-4 mt-2">`;
        } else if (isMalayalam) {
            response = `<b>${recipe.name}</b> പാചകം ചെയ്യുന്നതിനുള്ള ഘട്ടം ഘട്ടമായുള്ള രീതി താഴെ നൽകുന്നു:<br><ol class="list-decimal pl-4 mt-2">`;
        } else {
            response = `Here is the step-by-step method to cook <b>${recipe.name}</b>:<br><ol class="list-decimal pl-4 mt-2">`;
        }

        const stepsList = (RECIPE_TRANSLATIONS[recipeId] && RECIPE_TRANSLATIONS[recipeId][lang]) ? RECIPE_TRANSLATIONS[recipeId][lang] : recipe.steps;
        stepsList.forEach(step => {
            response += `<li class="mb-2">${step}</li>`;
        });
        response += `</ol>`;
    } else if (lowerMsg.includes("time") || lowerMsg.includes("long")) {
        if (isHindi) {
            response = `यदि आपने पहले से सारी सामग्री तैयार कर ली है, तो इसमें आमतौर पर लगभग 35-45 मिनट लगते हैं!`;
        } else if (isTamil) {
            response = `நீங்கள் அனைத்து பொருட்களையும் முன்கூட்டியே தயார் செய்திருந்தால், இதற்கு பொதுவாக 35-45 நிமிடங்கள் ஆகும்!`;
        } else if (isTelugu) {
            response = `మీరు అన్ని పదార్థాలను ముందే సిద్ధం చేసుకుంటే, దీనికి సాధారణంగా 35-45 నిమిషాలు పడుతుంది!`;
        } else if (isMalayalam) {
            response = `നിങ്ങൾ എല്ലാ ചേരുവകളും നേരത്തെ തന്നെ തയ്യാറാക്കിയിട്ടുണ്ടെങ്കിൽ, ഇതിന് സാധാരണയായി 35-45 മിനിറ്റ് എടുക്കും!`;
        } else {
            response = `This usually takes about 35-45 minutes if you have prepped all your ingredients beforehand!`;
        }
    } else {
        if (isHindi) {
            response = `यह एक बहुत अच्छा सवाल है! <b>${recipe.name}</b> के लिए मसालों का सही संतुलन बनाए रखना महत्वपूर्ण है। मैं स्वाद चखने और स्वादानुसार नमक-मसाले को समायोजित करने की सलाह दूंगा। क्या आपको सामग्री की मात्रा या खाना पकाने के चरण चाहिए? बस पूछें!`;
        } else if (isTamil) {
            response = `இது ஒரு சிறந்த கேள்வி! <b>${recipe.name}</b>-க்கு மசாலாக்களின் சரியான சமநிலையை பராமரிப்பது முக்கியம். நீங்கள் சமைக்கும் போது சுவை பார்த்து, உங்கள் விருப்பத்திற்கு ஏற்ப உப்பு மற்றும் காரத்தை சரிசெய்ய பரிந்துரைக்கிறேன். சரியான பொருட்களின் அளவு அல்லது முழு சமையல் படிகள் வேண்டுமா? கேளுங்கள்!`;
        } else if (isTelugu) {
            response = `ఇది చాలా మంచి ప్రశ్న! <b>${recipe.name}</b> కొరకు మసాలాల సరైన సమతుల్యతను కాపాడుకోవడం ముఖ్యం. రుచి చూస్తూ మీ ప్రాధాన్యతకు అనుగుణంగా ఉప్పు మరియు కారాన్ని సర్దుబాటు చేయాలని నేను సిఫార్సు చేస్తున్నాను. పదార్థాల కొలతలు లేదా పూర్తి వంట దశలు కావాలా? అడగండి!`;
        } else if (isMalayalam) {
            response = `ഇതൊരു നല്ല ചോദ്യമാണ്! <b>${recipe.name}</b>-ന് മസാലകളുടെ ശരിയായ അനുപാതം നിലനിർത്തുന്നത് പ്രധാനമാണ്. പാചകം ചെയ്യുന്നതിനിടയിൽ രുചിച്ചുനോക്കി നിങ്ങളുടെ ആവശ്യാനുസരണം ഉപ്പും എരിവും ക്രമീകരിക്കാൻ ഞാൻ ശുപാർശ ചെയ്യുന്നു. ചേരുവകളുടെ അളവോ പാചക ഘട്ടങ്ങളോ വേണമെങ്കിൽ ചോദിക്കുക!`;
        } else {
            response = `That's a great question! For <b>${recipe.name}</b>, maintaining the right balance of spices is key. I'd recommend tasting as you go and adjusting salt and spice to your preference. Need the exact ingredient measurements or full cooking steps? Just ask!`;
        }
    }

    // Simulate delay
    setTimeout(() => {
        callback(response);
    }, 1500);
}

// --- SHARED MODALS & SIDEBAR ---

function toggleSidebar(forceClose = false) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (sidebar && overlay) {
        if (!forceClose && sidebar.classList.contains('-translate-x-full')) {
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.remove('opacity-0'), 10);
            sidebar.classList.remove('-translate-x-full');
        } else {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('opacity-0');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        }
    }
}

function openOffersModal() {
    const modal = document.getElementById('offers-modal');
    const content = document.getElementById('offers-modal-content');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);
    }
}

function closeOffersModal(e, force = false) {
    if (force || (e && e.target && e.target.id === 'offers-modal')) {
        const modal = document.getElementById('offers-modal');
        const content = document.getElementById('offers-modal-content');
        if (content) {
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
        }
        setTimeout(() => {
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        }, 300);
    }
}

function openHistoryModal() {
    toggleSidebar(true);

    const modal = document.getElementById('history-modal');
    const content = document.getElementById('history-modal-content');
    const list = document.getElementById('history-list');

    if (modal && list) {
        const history = getOrderHistory();
        list.innerHTML = '';

        if (history.length === 0) {
            list.innerHTML = '<p class="text-gray-500 text-center py-4">No past orders found.</p>';
        } else {
            // copy to avoid mutating original
            [...history].reverse().forEach(order => {
                let itemsHtml = order.items.map(i => `<div class="text-sm text-gray-700">${i.quantity}x ${i.name}</div>`).join('');
                list.innerHTML += `
                    <div class="p-4 border rounded-xl shadow-sm">
                        <div class="flex justify-between items-start mb-2">
                            <span class="font-bold text-sm text-gray-500">${order.date}</span>
                            <span class="font-bold text-primary">${order.total}</span>
                        </div>
                        ${itemsHtml}
                    </div>
                `;
            });
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);
    }
}

function closeHistoryModal(e, force = false) {
    if (force || (e && e.target && e.target.id === 'history-modal')) {
        const modal = document.getElementById('history-modal');
        const content = document.getElementById('history-modal-content');
        if (content) {
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
        }
        setTimeout(() => {
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        }, 300);
    }
}

function saveOrder(cartList, totalAmount) {
    let history = JSON.parse(localStorage.getItem('hungry_orders')) || [];
    history.push({
        date: new Date().toLocaleString(),
        items: cartList,
        total: totalAmount
    });
    localStorage.setItem('hungry_orders', JSON.stringify(history));
}

function getOrderHistory() {
    return JSON.parse(localStorage.getItem('hungry_orders')) || [];
}

// ==========================================
//          HUNGRY.AI CHATBOT WIDGET
// ==========================================

(function () {
    // 1. DYNAMIC CSS STYLES INJECTION
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
        /* Floating Bot Container & Animations */
        @keyframes hungry-bot-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }
        .animate-bot-jump {
            animation: hungry-bot-bounce 3s infinite ease-in-out;
        }
        @keyframes label-pulse {
            0%, 100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
            50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
        }
        .hungry-label-glow {
            animation: label-pulse 2s infinite ease-in-out;
        }
        #hungry-ai-logo-label {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        #hungry-ai-logo-label:hover {
            background: #232222 !important;
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
            transform: scale(1.05);
        }
        .chatbot-card {
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.4);
        }
        /* Custom scrollbar for chat history */
        .chat-scroll::-webkit-scrollbar {
            width: 5px;
        }
        .chat-scroll::-webkit-scrollbar-track {
            background: transparent;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 99px;
        }
        /* Mic recording glow */
        @keyframes mic-glow {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
            50% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
        }
        .mic-recording {
            background: #ef4444 !important;
            color: white !important;
            animation: mic-glow 1.5s infinite ease-in-out;
        }
    `;
    document.head.appendChild(styleEl);

    // 2. CHAT LANGUAGE DATABASE
    const CHAT_LANGS = {
        English: {
            welcome: "Hi Rahul 👋\nwelcome to Hungry\nim your Hungry.ai assistant\ntell me how can I help you",
            howToUseTrigger: "how to use",
            howToUseReply: "I will guide! Hungry is a cooking guidance and food/grocery ordering app.\n\nNow tell me, are you hungry Rahul?",
            yes: "yes",
            no: "no",
            cookOrOrderQuestion: "Are you interested to cook or order?",
            cookBtn: "Cook 🍳",
            orderBtn: "Order 🛵",
            cookResult: "Here is what you need! Choose from our top recipes to start cooking with step-by-step guidance:",
            orderResult: "Here are your options! You can order delicious meals from cloud kitchens or fresh groceries from Hungry Mart:",
            orderFoodBtn: "Order Food 🛵",
            orderMartBtn: "Order Mart 🛒",
            placeholder: "Ask hungry.ai anything...",
            typing: "Hungry.ai is thinking...",
            yesBtnText: "Yes 👍",
            noBtnText: "No 👎"
        },
        Hindi: {
            welcome: "नमस्ते राहुल 👋\nहंग्री में आपका स्वागत है!\nमैं आपका Hungry.ai सहायक हूँ।\nमुझे बताएं, मैं आपकी कैसे मदद कर सकता हूँ?",
            howToUseTrigger: "कैसे उपयोग करें",
            howToUseReply: "मैं आपका मार्गदर्शन करूँगा! हंग्री एक कुकिंग गाइडेंस और फूड/ग्रोसरी ऑर्डरिंग ऐप है।\n\nअब बताएं राहुल, क्या आपको भूख लगी है?",
            yes: "हाँ",
            no: "नहीं",
            cookOrOrderQuestion: "क्या आप खाना पकाने में रुचि रखते हैं या ऑर्डर करने में?",
            cookBtn: "पकाएं 🍳",
            orderBtn: "ऑर्डर करें 🛵",
            cookResult: "यहाँ आपको जो चाहिए वह है! खाना बनाना शुरू करने के लिए हमारे शीर्ष व्यंजनों में से चुनें:",
            orderResult: "यहाँ आपके विकल्प हैं! आप क्लाउड किचन से स्वादिष्ट भोजन ऑर्डर कर सकते हैं या हंग्री मार्ट से ताज़ा ग्रोसरी:",
            orderFoodBtn: "भोजन ऑर्डर करें 🛵",
            orderMartBtn: "मार्ट ऑर्डर करें 🛒",
            placeholder: "हंग्री.एआई से कुछ भी पूछें...",
            typing: "हंग्री.एआई सोच रहा है...",
            yesBtnText: "हाँ 👍",
            noBtnText: "नहीं 👎"
        },
        Tamil: {
            welcome: "வணக்கம் ராகுல் \nஹங்ரிக்கு வரவேற்கிறோம்!\nநான் உங்கள் Hungry.ai உதவியாளர்.\nசொல்லுங்கள், நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
            howToUseTrigger: "எப்படி பயன்படுத்துவது",
            howToUseReply: "நான் உங்களுக்கு வழிகாட்டுகிறேன்! ஹங்ரி என்பது சமையல் வழிகாட்டுதல் மற்றும் உணவு, மளிகை ஆர்டர் செய்யும் செயலி ஆகும்.\n\nஇப்போது சொல்லுங்கள் ராகுல், உங்களுக்கு பசிக்கிறதா?",
            yes: "ஆம்",
            no: "இல்லை",
            cookOrOrderQuestion: "உங்களுக்கு சமைக்க விருப்பமா அல்லது ஆர்டர் செய்ய விருப்பமா?",
            cookBtn: "சமைக்க 🍳",
            orderBtn: "ஆர்டர் செய்ய 🛵",
            cookResult: "சமைக்க சிறந்த சமையல் குறிப்புகளிலிருந்து தேர்ந்தெடுக்கவும்:",
            orderResult: "சுவையான உணவு அல்லது புதிய மளிகைப் பொருட்களை ஆர்டர் செய்யலாம்:",
            orderFoodBtn: "உணவு ஆர்டர் 🛵",
            orderMartBtn: "மளிகை ஆர்டர் 🛒",
            placeholder: "ஏதேனும் கேளுங்கள்...",
            typing: "ஹங்ரி.ஏஐ யோசிக்கிறது...",
            yesBtnText: "ஆம் 👍",
            noBtnText: "இல்லை 👎"
        },
        Telugu: {
            welcome: "నమస్తే రాహుల్ 👋\nహంగ్రీకి స్వాగతం!\nనేను మీ Hungry.ai సహాయకుడిని.\nచెప్పండి, నేను మీకు ఎలా సహాయం చేయగలను?",
            howToUseTrigger: "ఎలా ఉపయోగించాలి",
            howToUseReply: "నేను మీకు మార్గనిర్దేశం చేస్తాను! హంగ్రీ అనేది వంట మార్గదర్శకత్వం మరియు ఆహారం, కిరాణా ఆర్డర్ చేసే యాప్.\n\nఇప్పుడు చెప్పండి రాహుల్, మీకు ఆకలిగా ఉందా?",
            yes: "అవును",
            no: "కాదు",
            cookOrOrderQuestion: "మీరు వండడానికి ఆసక్తి చూపుతున్నారా లేదా ఆర్డర్ చేయడానికా?",
            cookBtn: "వండడానికి 🍳",
            orderBtn: "ఆర్డర్ చేయడానికి 🛵",
            cookResult: "వంట ప్రారంభించడానికి మా అగ్ర వంటకాల నుండి ఎంచుకోండి:",
            orderResult: "క్లౌడ్ కిచెన్ నుండి ఆహారాన్ని లేదా హంగ్రీ మార్ట్ నుండి తాజా కిరాణాను ఆర్డర్ చేయవచ్చు:",
            orderFoodBtn: "ఆహారం ఆర్డర్ 🛵",
            orderMartBtn: "మార్ట్ ఆర్డర్ 🛒",
            placeholder: "ఏదైనా అడగండి...",
            typing: "హంగ్రీ.AI ఆలోచిస్తోంది...",
            yesBtnText: "అవును 👍",
            noBtnText: "కాదు 👎"
        },
        Malayalam: {
            welcome: "ഹലോ രാഹുൽ 👋\nഹംഗ്രിയിലേക്ക് സ്വാഗതം!\nഞാൻ നിങ്ങളുടെ Hungry.ai സഹായിയാണ്.\nപറയൂ, ഞാൻ എങ്ങനെയാണ് നിങ്ങളെ സഹായിക്കേണ്ടത്?",
            howToUseTrigger: "എങ്ങനെ ഉപയോഗിക്കാം",
            howToUseReply: "ഞാൻ നിങ്ങളെ നയിക്കാം! പാചക മാർഗ്ഗനിർദ്ദേശവും ഭക്ഷണവും പലചരക്ക് സാധനങ്ങളും ഓർഡർ ചെയ്യുന്നതിനുള്ള ഒരു ആപ്പാണ് ഹംഗ്രി.\n\nഇപ്പോൾ പറയൂ രാഹുൽ, നിങ്ങൾക്ക് വിശക്കുന്നുണ്ടോ?",
            yes: "അതെ",
            no: "അല്ല",
            cookOrOrderQuestion: "നിങ്ങൾക്ക് പാചകം ചെയ്യാനാണോ അതോ ഓർഡർ ചെയ്യാനാണോ താല്പര്യം?",
            cookBtn: "പാചകം ചെയ്യാം 🍳",
            orderBtn: "ഓർഡർ ചെയ്യാം 🛵",
            cookResult: "പാചകം ആരംഭിക്കാൻ ഞങ്ങളുടെ പ്രധാന പാചകക്കുറിപ്പുകളിൽ നിന്ന് തിരഞ്ഞെടുക്കുക:",
            orderResult: "ഭക്ഷണം ഓർഡർ ചെയ്യാം അല്ലെങ്കിൽ ഹംഗ്രി മാർട്ടിൽ നിന്ന് പലചരക്ക് സാധനങ്ങൾ വാങ്ങാം:",
            orderFoodBtn: "ഭക്ഷണം ഓർഡർ 🛵",
            orderMartBtn: "മാർട്ട് ഓർഡർ 🛒",
            placeholder: "എന്തെങ്കിലും ചോദിക്കൂ...",
            typing: "ഹംഗ്രി.എഐ ചിന്തിക്കുന്നു...",
            yesBtnText: "അതെ 👍",
            noBtnText: "അല്ല 👎"
        }
    };

    // Chatbot Global Variables
    let currentBotLang = localStorage.getItem('hungry_cook_lang') || 'English';
    let chatState = 'welcome'; // welcome, waiting_is_hungry, waiting_cook_or_order, general
    let isSpeakerOn = true;
    let currentActiveAudio = null;
    let chatRecognition = null;

    // Initialize Web Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        chatRecognition = new SpeechRec();
        chatRecognition.continuous = false;
        chatRecognition.interimResults = false;
    }

    // Dynamic translation helpers
    async function translateText(text, targetLangCode) {
        if (targetLangCode === 'en') return text;
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLangCode}&dt=t&q=${encodeURIComponent(text)}`;
            const res = await fetch(url);
            const json = await res.json();
            return json[0].map(item => item[0]).join('');
        } catch (e) {
            console.error("Translation failed: ", e);
            return text;
        }
    }

    async function translateUserText(text, sourceLangCode) {
        if (sourceLangCode === 'en') return text;
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLangCode}&tl=en&dt=t&q=${encodeURIComponent(text)}`;
            const res = await fetch(url);
            const json = await res.json();
            return json[0].map(item => item[0]).join('');
        } catch (e) {
            console.error("Reverse translation failed: ", e);
            return text;
        }
    }

    // Google Cloud Open TTS Streaming
    function playChatBotTTS(text, langCode, langName) {
        if (!isSpeakerOn) return;

        // Cancel existing Web Speech or Audio
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (currentActiveAudio) {
            currentActiveAudio.pause();
            currentActiveAudio = null;
        }

        const cleanText = text
            .replace(/<[^>]+>/g, ' ')
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/•/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .substring(0, 250)
            .trim();
        if (!cleanText) return;

        const player = document.getElementById('hungry-chatbot-tts-player');
        if (player) {
            const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=gtx&q=${encodeURIComponent(cleanText)}`;
            player.src = ttsUrl;
            player.volume = 1.0;
            currentActiveAudio = player;
            const playPromise = player.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("Playing chatbot TTS for " + langName);
                }).catch(err => {
                    console.log("Chatbot player error, falling back to Web Speech Synthesis: ", err);
                    fallbackWebSpeechChat(cleanText, langCode, langName);
                });
            }
        } else {
            fallbackWebSpeechChat(cleanText, langCode, langName);
        }
    }

    function fallbackWebSpeechChat(text, langCode, langName) {
        if (!window.speechSynthesis) return;

        const utterance = new SpeechSynthesisUtterance(text);
        let voiceCode = 'en-IN';
        if (langCode === 'hi') voiceCode = 'hi-IN';
        else if (langCode === 'ta') voiceCode = 'ta-IN';
        else if (langCode === 'te') voiceCode = 'te-IN';
        else if (langCode === 'ml') voiceCode = 'ml-IN';

        utterance.lang = voiceCode;
        utterance.volume = 1.0;
        utterance.rate = 0.85;

        const voices = window.speechSynthesis.getVoices();
        const matchedVoice = voices.find(v => {
            const nameLower = v.name.toLowerCase();
            const langLower = v.lang.toLowerCase();
            return langLower === voiceCode.toLowerCase() ||
                langLower.startsWith(langCode) ||
                nameLower.includes(langName.toLowerCase());
        });
        if (matchedVoice) {
            utterance.voice = matchedVoice;
        }
        window.speechSynthesis.speak(utterance);
    }

    // 3. INJECT CHATBOT DOM ELEMENTS
    function injectChatbotDOM() {
        if (document.getElementById('hungry-ai-widget')) return;

        const container = document.createElement('div');
        container.id = 'hungry-ai-widget';
        container.className = 'fixed bottom-6 right-6 z-[1000] flex flex-col items-end transition-opacity duration-500';

        // Floating Icon + Label peeking out
        container.innerHTML = `
            <!-- Floating welcome tooltip that slides in on load -->
            <div id="chatbot-helper-tooltip" class="absolute bottom-20 right-0 mb-2 bg-[#FAF8F5] border border-gray-200 text-dark px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold whitespace-nowrap z-50 transition-all duration-500 opacity-0 translate-y-2 pointer-events-auto cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95">
                <span class="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
                <span>Hi Rahul! Need help? 💬</span>
            </div>

            <!-- Floating logo and widget button -->
            <div class="relative flex items-center justify-end">
                <div id="hungry-ai-logo-label" class="absolute right-10 bg-[#1c1b1b] text-[#FFD700] py-2.5 pl-6 pr-12 rounded-l-full font-black text-sm z-0 select-none border-y border-l border-white/10 tracking-widest hungry-label-glow cursor-pointer">
                    HUNGRY.AI
                </div>
                <button id="hungry-chatbot-toggle-btn" class="relative w-16 h-16 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-300 focus:outline-none flex items-center justify-center bg-[#FFD700] hover:bg-[#ffe033] z-10 border-2 border-white/20 animate-bot-jump">
                    <img src="img/background-remover-cutout (7).png" alt="Hungry AI" class="w-12 h-12 object-contain" />
                    <!-- Online indicator pulse -->
                    <span class="absolute top-1 right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                </button>
            </div>

            <!-- Audio Player -->
            <audio id="hungry-chatbot-tts-player" class="hidden" preload="auto"></audio>

            <!-- Chatbot Window Card - Shrunk height to 450px to prevent header overriding -->
            <div id="hungry-chatbot-window" class="absolute bottom-20 right-0 w-96 max-w-[calc(100vw-2rem)] h-[450px] rounded-3xl flex flex-col z-[1000] overflow-hidden chatbot-card transition-all duration-300 transform scale-95 opacity-0 pointer-events-none">
                <!-- Header -->
                <div class="bg-gradient-to-r from-[#FFD700] to-[#FFC800] p-4 flex justify-between items-center text-dark shadow-sm">
                    <div class="flex items-center gap-3">
                        <div class="relative w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner">
                            <img src="img/background-remover-cutout (7).png" alt="Bot Logo" class="w-8 h-8 object-contain">
                        </div>
                        <div>
                            <h4 class="font-extrabold text-sm tracking-wide">hungry.ai</h4>
                            <div class="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                                <span class="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                                <span>Assistant Online</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-2">
                        <!-- Language Selector Dropdown -->
                        <select id="chatbot-lang-select" class="bg-white text-black text-xs font-bold px-2 py-1 rounded-lg border border-dark/10 outline-none focus:ring-1 focus:ring-secondary cursor-pointer">
                            <option class="text-black" value="English">EN</option>
                            <option class="text-black" value="Hindi">HI</option>
                            <option class="text-black" value="Tamil">TA</option>
                            <option class="text-black" value="Telugu">TE</option>
                            <option class="text-black" value="Malayalam">ML</option>
                        </select>

                        <!-- Speaker Toggle -->
                        <button id="chatbot-speaker-btn" class="hover:bg-dark/10 p-1.5 rounded-full transition-colors flex items-center">
                            <span class="material-symbols-outlined text-xl text-dark" id="chatbot-speaker-icon">volume_up</span>
                        </button>
                        
                        <!-- Close Button -->
                        <button id="chatbot-close-btn" class="hover:bg-dark/10 p-1.5 rounded-full transition-colors flex items-center">
                            <span class="material-symbols-outlined text-xl text-dark">close</span>
                        </button>
                    </div>
                </div>

                <!-- Chat Messages Body -->
                <div id="hungry-chatbot-body" class="flex-grow p-4 overflow-y-auto flex flex-col gap-3 bg-[#FAF8F5] chat-scroll">
                    <!-- Dynamic Bubbles Injected Here -->
                </div>

                <!-- Footer Input Area -->
                <div class="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                    <!-- Voice Microphone Button -->
                    <button id="chatbot-mic-btn" class="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all flex items-center justify-center focus:outline-none">
                        <span class="material-symbols-outlined" id="chatbot-mic-icon">mic</span>
                    </button>

                    <!-- Text input -->
                    <input type="text" id="hungry-chatbot-input" placeholder="Ask hungry.ai anything..." class="flex-grow bg-gray-50 border-none outline-none text-sm p-3 rounded-xl focus:bg-gray-100 transition-colors">
                    
                    <!-- Send Button -->
                    <button id="hungry-chatbot-send-btn" class="w-10 h-10 rounded-xl bg-secondary text-white hover:bg-red-600 shadow-md flex items-center justify-center transition-all">
                        <span class="material-symbols-outlined text-lg">send</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // Attach listeners
        const toggleBtn = document.getElementById('hungry-chatbot-toggle-btn');
        const logoLabel = document.getElementById('hungry-ai-logo-label');
        const closeBtn = document.getElementById('chatbot-close-btn');
        const win = document.getElementById('hungry-chatbot-window');
        const langSelect = document.getElementById('chatbot-lang-select');
        const speakerBtn = document.getElementById('chatbot-speaker-btn');
        const sendBtn = document.getElementById('hungry-chatbot-send-btn');
        const input = document.getElementById('hungry-chatbot-input');
        const micBtn = document.getElementById('chatbot-mic-btn');
        const tooltip = document.getElementById('chatbot-helper-tooltip');

        // Toggle chat window open/close
        const toggleWin = () => {
            const isClosed = win.classList.contains('pointer-events-none');
            if (isClosed) {
                win.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
                win.classList.add('scale-100', 'opacity-100', 'pointer-events-auto');
                // Hide welcome tooltip
                if (tooltip) {
                    tooltip.classList.add('opacity-0', 'pointer-events-none');
                }
                // Play welcome message if body is empty
                const chatBody = document.getElementById('hungry-chatbot-body');
                if (chatBody.children.length === 0) {
                    renderWelcomeMessage();
                }
            } else {
                win.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
                win.classList.remove('scale-100', 'opacity-100', 'pointer-events-auto');
                // Stop speaking when closed
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                if (currentActiveAudio) currentActiveAudio.pause();
            }
        };

        toggleBtn.addEventListener('click', toggleWin);
        logoLabel.addEventListener('click', toggleWin);
        closeBtn.addEventListener('click', toggleWin);
        if (tooltip) {
            tooltip.addEventListener('click', toggleWin);
        }

        // Show welcome tooltip for 2 seconds, then repeat every 20 seconds
        function triggerTooltipCycle() {
            if (!tooltip || !win.classList.contains('pointer-events-none')) return;
            tooltip.classList.remove('opacity-0', 'pointer-events-none');
            tooltip.classList.add('opacity-100', 'pointer-events-auto');

            setTimeout(() => {
                if (tooltip && win.classList.contains('pointer-events-none')) {
                    tooltip.classList.add('opacity-0', 'pointer-events-none');
                    tooltip.classList.remove('opacity-100', 'pointer-events-auto');
                }
            }, 2000); // visible for 2 seconds
        }

        // Check if page loader is active
        const isLoaderPlaying = () => {
            const l = document.getElementById('loader');
            return l && !l.classList.contains('hidden') && l.style.display !== 'none' && l.style.opacity !== '0';
        };

        if (isLoaderPlaying()) {
            container.classList.add('opacity-0', 'pointer-events-none');
            const checkLoaderInterval = setInterval(() => {
                if (!isLoaderPlaying()) {
                    clearInterval(checkLoaderInterval);
                    container.classList.remove('opacity-0', 'pointer-events-none');
                    setTimeout(() => {
                        triggerTooltipCycle();
                        setInterval(triggerTooltipCycle, 22000);
                    }, 2000);
                }
            }, 200);
        } else {
            setTimeout(() => {
                triggerTooltipCycle();
                setInterval(triggerTooltipCycle, 22000);
            }, 2000);
        }

        // Lang selection sync
        langSelect.value = currentBotLang;
        langSelect.addEventListener('change', (e) => {
            currentBotLang = e.target.value;
            localStorage.setItem('hungry_cook_lang', currentBotLang);

            // Sync with recipe page selector if available
            const recipeSelect = document.getElementById('cook-lang-select');
            if (recipeSelect) recipeSelect.value = currentBotLang;

            // Update footer placeholder
            const info = CHAT_LANGS[currentBotLang] || CHAT_LANGS.English;
            input.placeholder = info.placeholder;

            // Reset conversation and welcome in new language
            document.getElementById('hungry-chatbot-body').innerHTML = '';
            chatState = 'welcome';
            renderWelcomeMessage();
        });

        // Speaker toggle
        speakerBtn.addEventListener('click', () => {
            isSpeakerOn = !isSpeakerOn;
            document.getElementById('chatbot-speaker-icon').innerText = isSpeakerOn ? 'volume_up' : 'volume_off';
            if (!isSpeakerOn) {
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                if (currentActiveAudio) currentActiveAudio.pause();
            }
        });

        // Send triggers
        sendBtn.addEventListener('click', handleChatbotSend);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChatbotSend();
        });

        // Mic recording logic
        if (chatRecognition) {
            chatRecognition.onstart = () => {
                micBtn.classList.add('mic-recording');
                document.getElementById('chatbot-mic-icon').innerText = 'graphic_eq';
            };
            chatRecognition.onend = () => {
                micBtn.classList.remove('mic-recording');
                document.getElementById('chatbot-mic-icon').innerText = 'mic';
            };
            chatRecognition.onresult = (e) => {
                const transcript = e.results[0][0].transcript;
                input.value = transcript;
                handleChatbotSend();
            };
            chatRecognition.onerror = (err) => {
                console.error("Speech Recognition error: ", err);
                micBtn.classList.remove('mic-recording');
                document.getElementById('chatbot-mic-icon').innerText = 'mic';
            };

            micBtn.addEventListener('click', () => {
                const isRecording = micBtn.classList.contains('mic-recording');
                if (isRecording) {
                    chatRecognition.stop();
                } else {
                    let speechLang = 'en-IN';
                    if (currentBotLang === 'Hindi') speechLang = 'hi-IN';
                    else if (currentBotLang === 'Tamil') speechLang = 'ta-IN';
                    else if (currentBotLang === 'Telugu') speechLang = 'te-IN';
                    else if (currentBotLang === 'Malayalam') speechLang = 'ml-IN';
                    chatRecognition.lang = speechLang;
                    chatRecognition.start();
                }
            });
        } else {
            micBtn.style.display = 'none';
        }

        // Apply placeholder initially
        const info = CHAT_LANGS[currentBotLang] || CHAT_LANGS.English;
        input.placeholder = info.placeholder;

        // 6. Hide chatbot widget when scrolling near footer to prevent hiding footer content
        const handleWidgetScroll = () => {
            const footer = document.querySelector('footer');
            if (!footer) return;
            const footerRect = footer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (footerRect.top < windowHeight - 10) {
                container.style.opacity = '0';
                container.style.pointerEvents = 'none';
                container.style.transform = 'scale(0.8) translateY(20px)';
                container.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
            } else {
                container.style.opacity = '1';
                container.style.pointerEvents = 'auto';
                container.style.transform = 'scale(1) translateY(0)';
                container.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
            }
        };
        window.addEventListener('scroll', handleWidgetScroll);
        window.addEventListener('resize', handleWidgetScroll);
        setTimeout(handleWidgetScroll, 100);
    }

    // 4. CHAT DIALOGUE FLOW CONTROLLER
    function addChatBubble(text, isUser = false) {
        const body = document.getElementById('hungry-chatbot-body');
        const bubble = document.createElement('div');
        bubble.className = isUser
            ? "bg-secondary text-white px-4 py-3 rounded-2xl rounded-tr-none self-end max-w-[85%] shadow-sm font-semibold tracking-wide"
            : "bg-white border border-gray-100 text-dark px-4 py-3 rounded-2xl rounded-tl-none self-start max-w-[85%] shadow-sm font-semibold leading-relaxed";

        // Convert newlines to breaks
        bubble.innerHTML = text.replace(/\n/g, '<br>');
        body.appendChild(bubble);
        body.scrollTop = body.scrollHeight;
    }

    function addOptionsBubble(options) {
        const body = document.getElementById('hungry-chatbot-body');
        const wrapper = document.createElement('div');
        wrapper.className = "flex flex-col gap-2 self-start mt-1 w-full max-w-[85%]";

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = "bg-primary/20 text-[#1c1b1b] hover:bg-primary font-bold px-4 py-3 rounded-xl transition-all shadow-sm text-left flex items-center justify-between border border-primary/20";
            btn.innerHTML = `<span>${opt.text}</span> <span class="material-symbols-outlined text-sm">arrow_forward</span>`;
            btn.onclick = () => {
                // Remove the option buttons on selection to avoid duplicate clicks
                wrapper.remove();
                opt.callback();
            };
            wrapper.appendChild(btn);
        });

        body.appendChild(wrapper);
        body.scrollTop = body.scrollHeight;
    }

    function addRecipeCardsBubble(recipesList) {
        const body = document.getElementById('hungry-chatbot-body');
        const container = document.createElement('div');
        container.className = "flex flex-col gap-2.5 self-start w-full max-w-[90%] mt-1";

        recipesList.forEach(rec => {
            const card = document.createElement('a');
            card.href = `recipe.html?id=${rec.id}`;
            card.className = "flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-sm hover:scale-[1.03] transition-all";
            card.innerHTML = `
                <img src="${rec.image}" class="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0" />
                <div class="flex-grow min-w-0">
                    <p class="font-bold text-sm text-gray-800 truncate">${rec.name}</p>
                    <p class="text-xs text-primary font-bold">₹${rec.price.toFixed(2)}</p>
                </div>
                <span class="material-symbols-outlined text-gray-400 text-lg mr-1">chevron_right</span>
            `;
            container.appendChild(card);
        });

        body.appendChild(container);
        body.scrollTop = body.scrollHeight;
    }

    function showTypingIndicator() {
        const body = document.getElementById('hungry-chatbot-body');
        const indicator = document.createElement('div');
        indicator.id = 'hungry-chatbot-typing';
        indicator.className = "bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none self-start max-w-[85%] shadow-sm flex gap-1.5 items-center";

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = "w-2.5 h-2.5 bg-secondary rounded-full typing-dot";
            dot.style.animationDelay = `${i * 0.15}s`;
            indicator.appendChild(dot);
        }

        body.appendChild(indicator);
        body.scrollTop = body.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('hungry-chatbot-typing');
        if (indicator) indicator.remove();
    }

    function renderWelcomeMessage() {
        const info = CHAT_LANGS[currentBotLang] || CHAT_LANGS.English;
        addChatBubble(info.welcome, false);

        let langCode = 'en';
        if (currentBotLang === 'Hindi') langCode = 'hi';
        else if (currentBotLang === 'Tamil') langCode = 'ta';
        else if (currentBotLang === 'Telugu') langCode = 'te';
        else if (currentBotLang === 'Malayalam') langCode = 'ml';

        playChatBotTTS(info.welcome, langCode, currentBotLang);
    }

    async function handleChatbotSend() {
        const input = document.getElementById('hungry-chatbot-input');
        const userMsg = input.value.trim();
        if (!userMsg) return;

        input.value = '';
        addChatBubble(userMsg, true);
        showTypingIndicator();

        // 1. Get current language configurations
        let langCode = 'en';
        if (currentBotLang === 'Hindi') langCode = 'hi';
        else if (currentBotLang === 'Tamil') langCode = 'ta';
        else if (currentBotLang === 'Telugu') langCode = 'te';
        else if (currentBotLang === 'Malayalam') langCode = 'ml';

        // 2. Translate user query to English for state-matching & processing
        const englishMsg = (langCode === 'en') ? userMsg : await translateUserText(userMsg, langCode);
        const lowerMsg = englishMsg.toLowerCase();

        // 3. Process Response
        setTimeout(async () => {
            removeTypingIndicator();
            const info = CHAT_LANGS[currentBotLang] || CHAT_LANGS.English;

            // Scenario A: Rahul asks "how to use hungry"
            if (lowerMsg.includes("how to use") || lowerMsg.includes("use hungry") || lowerMsg.includes("how hungry works")) {
                addChatBubble(info.howToUseReply, false);
                playChatBotTTS(info.howToUseReply, langCode, currentBotLang);

                // Offer Yes/No branching buttons
                addOptionsBubble([
                    {
                        text: info.yesBtnText,
                        callback: () => {
                            addChatBubble(info.yesBtnText, true);
                            handleYesSelection(langCode);
                        }
                    },
                    {
                        text: info.noBtnText,
                        callback: () => {
                            addChatBubble(info.noBtnText, true);
                            chatState = 'general';
                            const noText = (currentBotLang === 'English') ? "No worries! Let me know if you need anything else."
                                : (currentBotLang === 'Hindi') ? "कोई बात नहीं! अगर आपको किसी और चीज की जरूरत हो तो मुझे बताएं।"
                                    : (currentBotLang === 'Tamil') ? "கவலைப்பட வேண்டாம்! வேறு ஏதேனும் தேவைப்பட்டால் எனக்குத் தெரியப்படுத்துங்கள்."
                                        : (currentBotLang === 'Telugu') ? "ఆందోళన పడకండి! మీకు ఇంకేదైనా కావాలంటే నాకు తెలియజేయండి."
                                            : "വിഷമിക്കേണ്ട! നിങ്ങൾക്ക് മറ്റെന്തെങ്കിലും ആവശ്യമുണ്ടെങ്കിൽ എന്നെ അറിയിക്കുക.";
                            addChatBubble(noText, false);
                            playChatBotTTS(noText, langCode, currentBotLang);
                        }
                    }
                ]);
                chatState = 'waiting_is_hungry';
            }
            // Scenario B: User replies directly to hungry question while waiting
            else if (chatState === 'waiting_is_hungry' && (lowerMsg.includes("yes") || lowerMsg.includes("yeah") || lowerMsg.includes("hungry"))) {
                handleYesSelection(langCode);
            }
            // Scenario C: Generic AI Platform Fallback
            else {
                // Intelligent Universal AI Engine for Hungry Assistant
                function generateSmartHungryAIResponse(msg) {
                    const q = msg.toLowerCase();

                    // 1. Identity & Creators
                    if (q.includes("who are you") || q.includes("what is hungry") || q.includes("about you")) {
                        return "I am **Hungry.ai**, your intelligent culinary sous-chef and food assistant! I can guide you with step-by-step recipes, calculate exact ingredients, recommend delicious meals, find nearby restaurants, and help you order fresh groceries via Hungry Mart in 10 minutes!";
                    }
                    if (q.includes("who made you") || q.includes("who created") || q.includes("who developed") || q.includes("developer")) {
                        return "I was created and developed by **Rahul Ravindran** for the Hungry culinary platform! Learn more at rahulravindran.co.in.";
                    }

                    // 2. Greetings & Status
                    if (q.includes("how are you") || q.includes("how r u") || q.includes("what's up") || q.includes("whats up")) {
                        return "I'm doing fantastic, Rahul! The kitchen is buzzing with sizzling aromatics. How can I help you cook or eat today?";
                    }
                    if (q.includes("hello") || q.includes("hi ") || q.startsWith("hi") || q === "hi") {
                        return "Hello Rahul! Welcome to Hungry.ai. What delicious dish are we exploring today?";
                    }
                    if (q.includes("thank") || q.includes("thanks") || q.includes("dhanyavad") || q.includes("nandri")) {
                        return "You're very welcome, Rahul! Let me know whenever you're hungry or ready to cook!";
                    }
                    if (q.includes("good morning") || q.includes("breakfast")) {
                        return "Good morning Rahul! ☀️ How about starting the day with crispy **Masala Dosa**, fluffy Idlis, or an energizing Quinoa Chickpea bowl?";
                    }
                    if (q.includes("good night") || q.includes("bye") || q.includes("see you")) {
                        return "Have a wonderful rest, Rahul! Whenever hunger strikes, Hungry.ai is always here for you. Sweet dreams! 🌙";
                    }

                    // 3. What to Eat / Meal Recommendations
                    if (q.includes("what should i eat") || q.includes("suggest") || q.includes("recommend") || q.includes("lunch") || q.includes("dinner")) {
                        return "Here are my top culinary recommendations for you today:<br>• **Chef's Signature Dum Biryani** (Aromatic & rich)<br>• **Paneer Butter Masala & Naan** (Creamy & flavorful)<br>• **Tandoori Chicken Skewers** (Smoky & high protein)<br>• **Dal Makhani** (Slow-cooked comfort)<br>Would you like the full recipe to cook it or want to order it nearby?";
                    }

                    // 4. Healthy / Diet / Gym / Calories / Weight loss
                    if (q.includes("healthy") || q.includes("diet") || q.includes("calorie") || q.includes("calories") || q.includes("protein") || q.includes("weight loss") || q.includes("gym")) {
                        return "For a healthy, nutrient-packed meal, I recommend:<br>1. **Honey Glazed Atlantic Salmon** (32g Protein, Omega-3s)<br>2. **Quinoa & Crispy Chickpea Bowl** (High fiber, plant protein)<br>3. **Palak Paneer** (Iron & fresh spinach antioxidants)<br>4. **Yellow Dhal Soup** (Light on the stomach, high protein)<br>Check out our recipe page for calorie and macro breakdowns!";
                    }

                    // 5. Cooking Techniques & Chef Secrets
                    if (q.includes("crispy dosa") || (q.includes("dosa") && q.includes("crisp"))) {
                        return "🧑‍🍳 **Chef Secret for Crispy Dosa**:<br>1. Add 1 tbsp chana dal & 1 tsp fenugreek (methi) while soaking rice.<br>2. Ensure tawa is medium-hot: sprinkle water, wipe clean, pour batter, and swirl quickly.<br>3. Drizzle pure ghee around edges on medium-high heat until golden brown!";
                    }
                    if (q.includes("biryani rice") || (q.includes("rice") && q.includes("fluffy"))) {
                        return "🧑‍🍳 **Chef Secret for Long, Fluffy Biryani Rice**:<br>1. Soak Aged Basmati Rice for 30 minutes.<br>2. Boil in rolling boiling water with whole spices, 1 tsp oil, and lemon juice.<br>3. Cook until only 70-80% done before layering for Dum!";
                    }
                    if (q.includes("soft paneer") || (q.includes("paneer") && q.includes("soft"))) {
                        return "🧑‍🍳 **Secret to Ultra-Soft Paneer**:<br>Soak paneer cubes in warm, lightly salted water for 10 minutes before adding to the gravy. Never over-fry paneer, as high heat turns it rubbery!";
                    }
                    if (q.includes("juicy chicken") || (q.includes("chicken") && q.includes("tender"))) {
                        return "🧑‍🍳 **Secret for Juicy & Tender Chicken**:<br>Marinate chicken with thick yogurt (curd), lemon juice, and ginger-garlic paste for at least 45 minutes. The natural acids break down tough fibers, locking in moisture during cooking!";
                    }

                    // 6. Substitutions
                    if (q.includes("substitute") || q.includes("replacement") || q.includes("instead of")) {
                        if (q.includes("egg")) return "🥚 **Egg Substitutes**: For baking/coating, use 1/4 cup whisked yogurt/curd, 1/4 cup unsweetened applesauce, or 1 tbsp ground flaxseed mixed with 3 tbsp warm water per egg.";
                        if (q.includes("curd") || q.includes("yogurt")) return "🥛 **Curd/Yogurt Substitute**: Use plain buttermilk, greek yogurt, or milk mixed with 1 tsp lemon juice or vinegar.";
                        if (q.includes("paneer")) return "🧀 **Paneer Substitute**: Firm tofu, halloumi cheese, or pressed ricotta work as great substitutes in curries!";
                        if (q.includes("cream")) return "🥣 **Heavy Cream Substitute**: Blend soaked cashews with a splash of milk/water for a rich, silky restaurant-style gravy.";
                        if (q.includes("butter")) return "🧈 **Butter Substitute**: Use Pure Ghee, Olive Oil, or Coconut Oil in 1:1 ratio.";
                        return "Let me know which ingredient you want to substitute (e.g., egg, curd, paneer, cream, butter) and I'll give you the perfect culinary alternative!";
                    }

                    // 7. Offers, Coupons & Discounts
                    if (q.includes("coupon") || q.includes("discount") || q.includes("promo") || q.includes("offer") || q.includes("code")) {
                        return "🎉 **Active Promo Codes for Rahul**:<br>• **`BIRYANI50`**: Flat 50% OFF on all Biryani orders!<br>• **`BRIYANIBHAI`**: 30% OFF instant discount on entire cart!<br>• **`RAHUL FRIEND`**: Special 20% friend discount!<br>• **`HUNGRY WALA`**: Free delivery on orders over ₹300.<br>Apply these coupon codes at checkout on the Cart page!";
                    }

                    // 8. Delivery, Mart, & Order Status
                    if (q.includes("delivery") || q.includes("time") || q.includes("fast") || q.includes("how long")) {
                        return "⚡ **Hungry Delivery Timelines**:<br>• **Hungry Mart (Groceries & Ingredients)**: Express delivery in **10 Minutes**!<br>• **Cloud Kitchen (Hot Food)**: Freshly prepared and delivered in **20 to 30 Minutes**.";
                    }
                    if (q.includes("track") || q.includes("where is my order") || q.includes("order status") || q.includes("history")) {
                        return "📦 You can view your live orders and previous purchases anytime by opening the **Menu (Sidebar) > Order History** or tracking via the Cart confirmation panel!";
                    }
                    if (q.includes("mart") || q.includes("grocery") || q.includes("vegetables") || q.includes("ingredients")) {
                        return "🛒 **Hungry Mart** delivers farm-fresh groceries, vegetables, dairy, meat, spices, and pre-measured recipe ingredient packs straight to your doorstep in 10 minutes! Head over to the **Hungry Mart** tab to order.";
                    }
                    if (q.includes("nearby") || q.includes("hotel") || q.includes("restaurant") || q.includes("map")) {
                        return "📍 Visit the **Order Nearby** page to automatically pinpoint your exact live location and explore the highest-rated authentic restaurants and signature dishes in your neighborhood!";
                    }
                    if (q.includes("payment") || q.includes("cod") || q.includes("upi") || q.includes("card") || q.includes("gpay")) {
                        return "💳 We support all secure payment methods: **Google Pay, PhonePe, UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery (COD)** with 0% extra convenience fee!";
                    }
                    if (q.includes("price") || q.includes("cost") || q.includes("cheap")) {
                        return "Our prices are very affordable! Chef's special Chicken Biryani is just ₹301, and Masala Dosa is just ₹412. You can also get coupon discounts in your cart page!";
                    }
                    if (q.includes("cancel") || q.includes("refund")) {
                        return "🔄 Orders can be easily cancelled before preparation starts directly from Order History, with instant refunds processed to your original payment method!";
                    }

                    // 9. Jokes & Fun
                    if (q.includes("joke") || q.includes("funny")) {
                        const jokes = [
                            "Why did the tomato blush? Because it saw the salad dressing! 🍅🥗",
                            "What did the biryani say to the raita? 'You complete me, cool buddy!' 🍛🥒",
                            "Why do French chefs use only one egg to make an omelette? Because one egg is an 'oeuf'! 🍳",
                            "What's a potato's favorite song? 'Spud, Spud, Spud' by the Beatles! 🥔"
                        ];
                        return jokes[Math.floor(Math.random() * jokes.length)];
                    }

                    // 10. Specific Dish Lookups in Database
                    for (const key of Object.keys(RECIPES)) {
                        const rec = RECIPES[key];
                        if (q.includes(key.replace(/-/g, ' ')) || q.includes(rec.name.toLowerCase())) {
                            const ingSummary = rec.ingredients.slice(0, 4).map(i => i.name).join(', ');
                            return `🍲 **${rec.name}** is one of our chef favorites (₹${rec.price})!<br>• **Prep Time**: ${rec.prepTime || '20 mins'} | **Cooking Time**: ${rec.cookTime || '30 mins'}<br>• **Key Ingredients**: ${ingSummary} and aromatic spices.<br>• **Calories**: ${rec.nutrition ? rec.nutrition.calories : '450 kcal'}<br><a href="recipe.html?id=${key}" class="text-secondary font-bold underline mt-1 inline-block">Click here to view full recipe & cook step-by-step →</a>`;
                        }
                    }

                    // 11. General Food Terms & Concepts
                    if (q.includes("dum") || q.includes("dum cooking")) {
                        return "🔥 **Dum Cooking**: A traditional slow-cooking technique where the pot is sealed with dough to trap steam, infusing the meat and rice with rich aroma and intense flavors over low heat!";
                    }
                    if (q.includes("ghee") || q.includes("clarified butter")) {
                        return "🧈 **Ghee (Clarified Butter)**: Made by simmering butter until all water evaporates and milk solids caramelize, leaving behind a rich, nutty golden liquid with a high smoke point (485°F) perfect for searing and tempering!";
                    }
                    if (q.includes("tandoor") || q.includes("tandoori")) {
                        return "🏺 **Tandoor**: A traditional cylindrical clay oven fired with charcoal or wood, reaching temperatures over 900°F (480°C) to give naan and tandoori meats their signature smoky char!";
                    }
                    if (q.includes("spicy") || q.includes("too spicy")) {
                        return "🌶️ If your curry or dish is too spicy, balance it by adding: **dairy (cream, yogurt, milk, ghee), a squeeze of lemon juice, or a pinch of sugar/jaggery** to mellow the capsaicin heat!";
                    }

                    // 12. Smart Universal Culinary Assistant Fallback
                    return `That's a great question, Rahul! As your Hungry.ai assistant, I can help you cook any dish with step-by-step instructions, recommend meals, or order groceries in 10 minutes.<br><br>💡 *Try asking:*<br>• "How to make Biryani?"<br>• "Secret for crispy dosa"<br>• "What are the latest coupon codes?"<br>• "Suggest high protein dinner"`;
                }

                const finalEngResponse = generateSmartHungryAIResponse(englishMsg);

                // Translate fallback response to target lang
                const finalTargetResponse = (langCode === 'en') ? finalEngResponse : await translateText(finalEngResponse, langCode);
                addChatBubble(finalTargetResponse, false);
                playChatBotTTS(finalTargetResponse, langCode, currentBotLang);
            }
        }, 1000);
    }

    async function handleYesSelection(langCode) {
        const info = CHAT_LANGS[currentBotLang] || CHAT_LANGS.English;
        addChatBubble(info.cookOrOrderQuestion, false);
        playChatBotTTS(info.cookOrOrderQuestion, langCode, currentBotLang);

        addOptionsBubble([
            {
                text: info.cookBtn,
                callback: () => {
                    addChatBubble(info.cookBtn, true);
                    handleBranchSelection('cook', langCode);
                }
            },
            {
                text: info.orderBtn,
                callback: () => {
                    addChatBubble(info.orderBtn, true);
                    handleBranchSelection('order', langCode);
                }
            }
        ]);
        chatState = 'waiting_cook_or_order';
    }

    async function handleBranchSelection(branch, langCode) {
        const info = CHAT_LANGS[currentBotLang] || CHAT_LANGS.English;

        if (branch === 'cook') {
            addChatBubble(info.cookResult, false);
            playChatBotTTS(info.cookResult, langCode, currentBotLang);

            // Fetch top 4 recipes from database
            const list = [
                { id: 'chicken-biryani', name: RECIPES['chicken-biryani'].name, price: RECIPES['chicken-biryani'].price, image: RECIPES['chicken-biryani'].image },
                { id: 'masala-dosa', name: RECIPES['masala-dosa'].name, price: RECIPES['masala-dosa'].price, image: RECIPES['masala-dosa'].image },
                { id: 'paneer-tikka', name: RECIPES['paneer-tikka'].name, price: RECIPES['paneer-tikka'].price, image: RECIPES['paneer-tikka'].image },
                { id: 'dhal-soup', name: RECIPES['dhal-soup'].name, price: RECIPES['dhal-soup'].price, image: RECIPES['dhal-soup'].image }
            ];
            addRecipeCardsBubble(list);
            chatState = 'general';
        } else {
            addChatBubble(info.orderResult, false);
            playChatBotTTS(info.orderResult, langCode, currentBotLang);

            addOptionsBubble([
                {
                    text: info.orderFoodBtn,
                    callback: () => {
                        window.location.href = 'nearby.html';
                    }
                },
                {
                    text: info.orderMartBtn,
                    callback: () => {
                        window.location.href = 'mart.html';
                    }
                }
            ]);
            chatState = 'general';
        }
    }

    // 5. INITIATE ON LOAD
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectChatbotDOM);
    } else {
        injectChatbotDOM();
    }
})();

