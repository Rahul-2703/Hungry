// Cart logic
let cart = JSON.parse(localStorage.getItem('hungry_cart')) || [];

function addToCart(item) {
    cart.push(item);
    localStorage.setItem('hungry_cart', JSON.stringify(cart));
    updateCartBadge();
    showToast(`${item.name} added to cart!`);
}

function getCart() {
    return cart;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('hungry_cart', JSON.stringify(cart));
    updateCartBadge();
    if (typeof renderCart === 'function') {
        renderCart();
    }
}

function updateCartQuantity(index, amount) {
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
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.innerText = cart.length;
        if(cart.length > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
}

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
    },};

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
        if(currentTip < tips.length) {
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
    if(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);
    }
}

function closeOffersModal(e, force = false) {
    if(force || (e && e.target && e.target.id === 'offers-modal')) {
        const modal = document.getElementById('offers-modal');
        const content = document.getElementById('offers-modal-content');
        if(content) {
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
        }
        setTimeout(() => {
            if(modal) {
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
    
    if(modal && list) {
        const history = getOrderHistory();
        list.innerHTML = '';
        
        if(history.length === 0) {
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
    if(force || (e && e.target && e.target.id === 'history-modal')) {
        const modal = document.getElementById('history-modal');
        const content = document.getElementById('history-modal-content');
        if(content) {
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
        }
        setTimeout(() => {
            if(modal) {
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
