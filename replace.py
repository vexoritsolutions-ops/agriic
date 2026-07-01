import re

filepath = 'src/App.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add ShopModule import
content = content.replace(
    'import { SettingsModule } from "./components/SettingsModule";',
    'import { SettingsModule } from "./components/SettingsModule";\nimport { ShopModule } from "./components/ShopModule";'
)

# 2. Update Header conditions
content = content.replace(
    "{routePath === '#products' || routePath === '#product' ? (",
    "{routePath !== '#products' && (\n        routePath === '#product' ? ("
)

content = content.replace(
    "{isMobileMenuOpen ? <X className=\"w-6 h-6\" /> : <Menu className=\"w-6 h-6\" />}\n            </button>\n          </div>\n        </header>\n      )}",
    "{isMobileMenuOpen ? <X className=\"w-6 h-6\" /> : <Menu className=\"w-6 h-6\" />}\n            </button>\n          </div>\n        </header>\n      ))}"
)

# 3. Replace the entire #products block
pattern = re.compile(r"\{\/\* VIEW 4: liveProducts \*\/.*?\{\/\* VIEW 5: PRODUCT DETAIL \*\/\}", re.DOTALL)
replacement = """{/* VIEW 4: liveProducts */}
        {routePath === '#products' && (
          <ShopModule 
            liveProducts={liveProducts}
            productFilter={productFilter}
            setProductFilter={setProductFilter}
            allProductsSearch={allProductsSearch}
            setAllProductsSearch={setAllProductsSearch}
            cart={cart}
            addToCart={addToCart}
            updateCartQty={updateCartQty}
            currentUser={currentUser}
            handleLogout={handleLogout}
          />
        )}

        {/* VIEW 5: PRODUCT DETAIL */}"""

content = re.sub(pattern, replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement complete.")
