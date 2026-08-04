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
    }
};

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
