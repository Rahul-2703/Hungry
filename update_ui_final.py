import re

# Update cart.html logic for coupons
with open('d:/HUNGRY/cart.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace coupon input HTML
old_coupon_html = """                            <div class="flex gap-2">
                                <input type="text" id="coupon-code" class="flex-1 p-3 border border-outline-variant rounded-xl font-body-md uppercase focus:outline-none focus:border-primary" placeholder="Enter code">
                                <button onclick="applyCoupon()" class="bg-[#1c1b1b] text-white px-6 rounded-xl font-bold hover:bg-black transition-colors">Apply</button>
                            </div>"""

new_coupon_html = """                            <div class="flex gap-2">
                                <input type="text" id="coupon-code" class="flex-1 p-3 border border-outline-variant rounded-xl font-body-md uppercase focus:outline-none focus:border-primary" placeholder="Enter code">
                                <button id="apply-coupon-btn" onclick="applyCoupon()" class="bg-[#1c1b1b] text-white px-6 rounded-xl font-bold hover:bg-black transition-colors">Apply</button>
                                <button id="remove-coupon-btn" onclick="removeCoupon()" class="hidden bg-red-100 text-red-600 px-4 rounded-xl font-bold hover:bg-red-200 transition-colors" title="Remove Coupon">
                                    <span class="material-symbols-outlined text-lg translate-y-0.5">close</span>
                                </button>
                            </div>"""
                            
content = content.replace(old_coupon_html, new_coupon_html)

# Replace applyCoupon JS and add removeCoupon
old_apply_coupon_js = """            if (discount > 0) {
                msg.innerText = `Success! ${discount}% OFF applied.`;
                msg.className = "text-sm mt-2 font-medium text-green-600";
                isCouponApplied = true;
                updateTotals(discount);
            } else {"""
            
new_apply_coupon_js = """            if (discount > 0) {
                msg.innerText = `Success! ${discount}% OFF applied.`;
                msg.className = "text-sm mt-2 font-medium text-green-600";
                isCouponApplied = true;
                document.getElementById('apply-coupon-btn').classList.add('hidden');
                document.getElementById('remove-coupon-btn').classList.remove('hidden');
                updateTotals(discount);
            } else {"""
            
content = content.replace(old_apply_coupon_js, new_apply_coupon_js)

remove_coupon_js = """        function removeCoupon() {
            isCouponApplied = false;
            document.getElementById('coupon-code').value = '';
            document.getElementById('coupon-message').classList.add('hidden');
            document.getElementById('apply-coupon-btn').classList.remove('hidden');
            document.getElementById('remove-coupon-btn').classList.add('hidden');
            updateTotals(0);
        }

        function applyCoupon() {"""
        
content = content.replace('        function applyCoupon() {', remove_coupon_js)

# Add Back buttons to cart.html, recipe.html, nearby.html
back_btn_html = """
    <div class="px-8 mt-24 mb-4 max-w-[1400px] mx-auto w-full">
        <a href="index.html" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 hover:text-black transition-all shadow-sm w-fit font-bold text-sm">
            <span class="material-symbols-outlined text-lg">arrow_back</span>
            Back
        </a>
    </div>
"""

# Cart.html
content = content.replace('<main class="mt-24 px-8 max-w-4xl mx-auto flex-grow w-full">', back_btn_html + '    <main class="px-8 max-w-4xl mx-auto flex-grow w-full">')
with open('d:/HUNGRY/cart.html', 'w', encoding='utf-8') as f:
    f.write(content)

# Recipe.html
with open('d:/HUNGRY/recipe.html', 'r', encoding='utf-8') as f:
    r_content = f.read()
r_content = r_content.replace('<main class="mt-24 px-8 max-w-4xl mx-auto min-h-[60vh] flex flex-col md:flex-row gap-12 relative">', back_btn_html + '    <main class="px-8 max-w-4xl mx-auto min-h-[60vh] flex flex-col md:flex-row gap-12 relative">')
with open('d:/HUNGRY/recipe.html', 'w', encoding='utf-8') as f:
    f.write(r_content)

# Nearby.html
with open('d:/HUNGRY/nearby.html', 'r', encoding='utf-8') as f:
    n_content = f.read()
n_content = n_content.replace('<main class="mt-24 px-4 md:px-8 max-w-[1400px] mx-auto min-h-[80vh] flex flex-col lg:flex-row gap-6 relative">', back_btn_html + '    <main class="px-4 md:px-8 max-w-[1400px] mx-auto min-h-[80vh] flex flex-col lg:flex-row gap-6 relative">')
with open('d:/HUNGRY/nearby.html', 'w', encoding='utf-8') as f:
    f.write(n_content)

print("Updated files successfully!")
