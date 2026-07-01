const fs = require('fs');

const filepath = 'src/App.tsx';
let content = fs.readFileSync(filepath, 'utf-8');

// 1. Add ShopModule import
content = content.replace(
    'import { SettingsModule } from "./components/SettingsModule";',
    'import { SettingsModule } from "./components/SettingsModule";\nimport { ShopModule } from "./components/ShopModule";'
);

// 2. Update Header conditions
content = content.replace(
    "{routePath === '#products' || routePath === '#product' ? (",
    "{routePath !== '#products' && (\n        routePath === '#product' ? ("
);

content = content.replace(
    "{isMobileMenuOpen ? <X className=\"w-6 h-6\" /> : <Menu className=\"w-6 h-6\" />}\n            </button>\n          </div>\n        </header>\n      )}",
    "{isMobileMenuOpen ? <X className=\"w-6 h-6\" /> : <Menu className=\"w-6 h-6\" />}\n            </button>\n          </div>\n        </header>\n      ))}"
);

// 3. Replace the entire #products block
const pattern = /\{\/\* VIEW 4: liveProducts \*\/[\s\S]*?\{\/\* VIEW 5: PRODUCT DETAIL \*\/\}/g;
const replacement = `{/* VIEW 4: liveProducts */}
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

        {/* VIEW 5: PRODUCT DETAIL */}`;

content = content.replace(pattern, replacement);

fs.writeFileSync(filepath, content, 'utf-8');
console.log("Replacement complete.");
