package com.hedoesit.bakery.config

import com.hedoesit.bakery.model.Category
import com.hedoesit.bakery.model.Product
import com.hedoesit.bakery.repository.CategoryRepository
import com.hedoesit.bakery.repository.ProductRepository
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component

@Component
@Profile("!prod")
class SampleDataInitializer(
    private val categoryRepository: CategoryRepository,
    private val productRepository: ProductRepository
) : ApplicationRunner {

    override fun run(args: ApplicationArguments?) {
        if (productRepository.count() > 0) return

        val cakes = categoryRepository.save(Category(name = "Cakes", description = "Layer cakes, bundt cakes, and more", displayOrder = 1))
        val cookies = categoryRepository.save(Category(name = "Cookies", description = "Fresh baked cookies and bars", displayOrder = 2))
        val breads = categoryRepository.save(Category(name = "Breads", description = "Artisan loaves and rolls", displayOrder = 3))
        val pastries = categoryRepository.save(Category(name = "Pastries", description = "Croissants, danishes, and sweet pastries", displayOrder = 4))
        val pies = categoryRepository.save(Category(name = "Pies & Tarts", description = "Seasonal pies and fruit tarts", displayOrder = 5))

        val products = listOf(
            Product(name = "Classic Red Velvet Cake", description = "Three layers of moist red velvet cake with cream cheese frosting. A timeless favorite for any celebration.", priceCents = 4500, category = cakes, featured = true, active = true, displayOrder = 1),
            Product(name = "Lemon Blueberry Layer Cake", description = "Light lemon sponge layered with fresh blueberry compote and lemon buttercream.", priceCents = 4800, category = cakes, featured = true, active = true, displayOrder = 2),
            Product(name = "German Chocolate Cake", description = "Rich chocolate cake topped with coconut-pecan frosting. Made from scratch with premium cocoa.", priceCents = 5000, category = cakes, featured = false, active = true, displayOrder = 3),
            Product(name = "Carrot Cake", description = "Spiced carrot cake loaded with walnuts, raisins, and pineapple, finished with tangy cream cheese frosting.", priceCents = 4200, category = cakes, featured = false, active = true, displayOrder = 4),

            Product(name = "Brown Butter Chocolate Chip Cookies", description = "Crispy edges, chewy centers. Made with browned butter and two types of chocolate. Sold by the dozen.", priceCents = 1800, category = cookies, featured = true, active = true, displayOrder = 1),
            Product(name = "Snickerdoodle Cookies", description = "Soft and pillowy cinnamon-sugar cookies. A nostalgic classic. Sold by the dozen.", priceCents = 1500, category = cookies, featured = false, active = true, displayOrder = 2),
            Product(name = "Oatmeal Raisin Cookies", description = "Hearty oats, plump raisins, and a hint of cinnamon. Sold by the dozen.", priceCents = 1500, category = cookies, featured = false, active = true, displayOrder = 3),
            Product(name = "Lemon Shortbread Bars", description = "Buttery shortbread crust topped with a bright, tangy lemon curd. Cut into 12 bars.", priceCents = 2000, category = cookies, featured = false, active = true, displayOrder = 4),

            Product(name = "Sourdough Boule", description = "Naturally leavened with a crisp crust and open crumb. 48-hour cold ferment for maximum flavor.", priceCents = 900, category = breads, featured = true, active = true, displayOrder = 1),
            Product(name = "Honey Wheat Sandwich Loaf", description = "Soft whole wheat bread sweetened with local honey. Perfect for sandwiches and toast.", priceCents = 750, category = breads, featured = false, active = true, displayOrder = 2),
            Product(name = "Everything Bagels (6-pack)", description = "New York-style bagels loaded with sesame, poppy, garlic, onion, and sea salt.", priceCents = 1200, category = breads, featured = false, active = true, displayOrder = 3),
            Product(name = "Cinnamon Raisin Swirl Bread", description = "Tender enriched dough swirled with cinnamon sugar and studded with raisins.", priceCents = 850, category = breads, featured = false, active = true, displayOrder = 4),

            Product(name = "Butter Croissants (4-pack)", description = "Flaky, golden, laminated pastry made with European-style butter. 72-hour process.", priceCents = 1600, category = pastries, featured = true, active = true, displayOrder = 1),
            Product(name = "Almond Croissants (2-pack)", description = "Day-old croissants filled with almond cream and topped with sliced almonds and powdered sugar.", priceCents = 1200, category = pastries, featured = false, active = true, displayOrder = 2),
            Product(name = "Apple Danish", description = "Flaky puff pastry filled with spiced apple compote and drizzled with vanilla glaze.", priceCents = 500, category = pastries, featured = false, active = true, displayOrder = 3),
            Product(name = "Chocolate Babka", description = "Braided brioche swirled with rich dark chocolate. Topped with streusel.", priceCents = 2200, category = pastries, featured = false, active = true, displayOrder = 4),

            Product(name = "Sweet Potato Pie", description = "Creamy spiced sweet potato custard in a buttery flaky crust. A Southern classic.", priceCents = 2800, category = pies, featured = true, active = true, displayOrder = 1),
            Product(name = "Pecan Pie", description = "Gooey caramelized filling loaded with toasted pecans in a homemade butter crust.", priceCents = 3000, category = pies, featured = false, active = true, displayOrder = 2),
            Product(name = "Mixed Berry Galette", description = "Rustic free-form tart with seasonal berries. Lightly sweetened, beautifully imperfect.", priceCents = 2400, category = pies, featured = false, active = true, displayOrder = 3),
        )

        productRepository.saveAll(products)
        println("Seeded ${products.size} sample products across 5 categories")
    }
}
