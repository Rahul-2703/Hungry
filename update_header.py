import glob, re

for f in glob.glob('d:/HUNGRY/*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # replace the span containing account_circle with an img tag
    pattern = r'<span[^>]*>account_circle</span>'
    new_tag = '<img src="img/user_avatar.png" alt="Profile" class="w-8 h-8 rounded-full object-cover border border-outline-variant shadow-sm" />'
    
    if re.search(pattern, content):
        new_content = re.sub(pattern, new_tag, content)
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f'Updated {f}')
