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

// Simulated GPT AI Assistant Function
function generateAICookingTips(recipeId, callback) {
    const recipe = RECIPES[recipeId];
    if (!recipe) {
        callback("I couldn't find that recipe!");
        return;
    }

    const tips = [
        `Chef AI: Let's get cooking! Here are some pro-tips for perfecting your ${recipe.name}:`,
        `Chef AI: Prep is key. Make sure all your ingredients are measured out before you start. Especially the ${recipe.ingredients[0].name.toLowerCase()}.`,
        `Chef AI: Heat management is crucial. For Indian cooking, letting your spices temper (bloom) in hot oil or ghee releases their essential oils. But don't let them burn!`,
        `Chef AI: Don't rush step 1: "${recipe.steps[0]}" is crucial for building the foundational flavor. Take your time here.`,
        `Chef AI: Secret ingredient: Always finish with a pinch of freshly ground cardamom or garam masala right at the end to lock in the aroma!`,
        `Chef AI: Need help with a specific step? Just ask!`
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
    
    if (lowerMsg.includes("ingredient") || lowerMsg.includes("measure") || lowerMsg.includes("how much") || lowerMsg.includes("quantity")) {
        response = `Here are the exact measurements for ${recipe.name}:<br><ul class="list-disc pl-4 mt-2">`;
        recipe.ingredients.forEach(ing => {
            response += `<li><b>${ing.name}</b>: ${ing.baseQty} ${ing.unit}</li>`;
        });
        response += `</ul>`;
    } else if (lowerMsg.includes("step") || lowerMsg.includes("how to") || lowerMsg.includes("method") || lowerMsg.includes("instruct") || lowerMsg.includes("make") || lowerMsg.includes("guide")) {
        response = `Here is the step-by-step method to cook ${recipe.name}:<br><ol class="list-decimal pl-4 mt-2">`;
        recipe.steps.forEach(step => {
            response += `<li class="mb-2">${step}</li>`;
        });
        response += `</ol>`;
    } else if (lowerMsg.includes("time") || lowerMsg.includes("long")) {
        response = `This usually takes about 35-45 minutes if you have prepped all your ingredients beforehand!`;
    } else {
        response = `That's a great question! For ${recipe.name}, maintaining the right balance of spices is key. I'd recommend tasting as you go and adjusting salt and spice to your preference. Need the exact ingredient measurements or full cooking steps? Just ask!`;
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
