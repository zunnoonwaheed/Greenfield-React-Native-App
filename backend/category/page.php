<?php
include("../admin/includes/db_settings.php");
session_start();

$slug = $_GET['slug'] ?? '';
$slug = mysqli_real_escape_string($con, $slug);

// ✅ Category fetch
$cQ = "SELECT * FROM sizee WHERE slug='$slug' AND mainID='2' LIMIT 1";
$cRes = mysqli_query($con, $cQ);
if(mysqli_num_rows($cRes) == 0){
    http_response_code(404);
    include("../404.php");
    exit;
}
$catsy = mysqli_fetch_assoc($cRes);

// ✅ Optional brand filter
$brandId = isset($_GET['brand']) ? intval($_GET['brand']) : 0;
$brandFilter = $brandId > 0 ? " AND brID='$brandId'" : "";

// ✅ Products of this category (+ optional brand filter)
$pQ = "SELECT * FROM dow WHERE catID='{$catsy['id']}' AND statuss='1' $brandFilter";
$pRes = mysqli_query($con, $pQ);

// ✅ Fetch ALL categories (for sidebar)
$catQ = "SELECT * FROM sizee WHERE mainID='2' ORDER BY name ASC";
$catRes = mysqli_query($con, $catQ);
include("../html.php");
include("../head.php");
include("../header.php");
?>

<div class="container py-5">
  <div class="row">

    <!-- ✅ Mobile Brands (Products ke oper) -->
    <div class="col-12 d-block d-md-none mb-3">
      <?php
      $bQ = "SELECT * FROM brands WHERE mainID='{$catsy['id']}' ORDER BY name ASC";
      $bRes = mysqli_query($con, $bQ);
      $hasBrands = mysqli_num_rows($bRes) > 0;
      ?>

      <?php if($hasBrands): ?>
        <h5 class="mb-3">Brands in <?= htmlspecialchars($catsy['name']); ?></h5>
        <ul class="list-group mb-4">
          <li class="list-group-item">
            <a href="#" class="brandFilter fw-bold text-primary" data-cat="<?= $catsy['id']; ?>" data-id="0">
              View All
            </a>
          </li>
          <?php while($b = mysqli_fetch_assoc($bRes)): ?>
            <li class="list-group-item">
              <a href="#" class="brandFilter" data-cat="<?= $catsy['id']; ?>" data-id="<?= $b['id']; ?>">
                <?= htmlspecialchars($b['name']); ?>
              </a>
            </li>
          <?php endwhile; ?>
        </ul>
      <?php endif; ?>
    </div>

    <!-- Products -->
    <div class="col-12 col-md-9">
      <div class="row" id="productList" data-cat="<?= intval($catsy['id']); ?>">
        <?php while($p = mysqli_fetch_assoc($pRes)): ?>
     <div class="col-6 col-md-4 col-lg-4 mb-4">
         <div class="product-item">
          <div class="card h-100 shadow-sm">
            <a href="/<?= $p['slug']; ?>/">
              <img src="/images/category-placeholder.jpg" data-src="/admin/upload/dow/<?= $p['imagee'] ?: 'default.jpg'; ?>" 
                   class="lazyload card-img-top img-fluid" 
                   alt="<?= htmlspecialchars($p['namee']); ?>">
            </a>
            <div class="card-body d-flex flex-column">
              <h6 class="card-title">
                <a href="/<?= $p['slug']; ?>/" class="text-decoration-none">
                  <?= htmlspecialchars($p['namee']); ?>
                </a>
              </h6>
                <div class="d-flex justify-content-center align-items-center gap-2">
                    <?php if($p['price'] > $p['dprice']){ ?>
                        <del>Rs.<?php echo $p['price']; ?></del>
                    <?php } ?>
                    <span class="text-dark fw-semibold">Rs.<?php echo $p['dprice']; ?></span>
                </div>
            
              <form class="addToCartForm mt-auto">
                <input type="hidden" name="product_id" value="<?= $p['id']; ?>">
                <div class="input-group mb-2">
                  
               <div class="input-group input-group-sm elegant-qty rounded-pill w-100">
    <button type="button" class="btn btn-outline-secondary qty-btn rounded-start" data-action="decrease">−</button>
    <input type="number" name="qty" value="1" min="1" class="form-control text-center qty-input border-0">
    <button type="button" class="btn btn-outline-secondary qty-btn rounded-end" data-action="increase">+</button>
</div>

 
                </div>
                <button type="submit" class="btn btn-sm btn-primary w-100">Add to Cart</button>
              </form>
            </div>
          </div>
        </div>        </div>
        <?php endwhile; ?>
      </div>
    </div>
<!-- ✅ Mobile Other Categories (sirf mobile par) -->
<div class="col-12 d-block d-md-none mt-4">
  <h5 class="mb-3">Other Categories</h5>
 <div class="accordion" id="categoryAccordionMobile">
    <?php
    // Sirf parents (menuID = 0)
    $parentQ = "SELECT * FROM sizee 
             WHERE menuID = 0 AND keyword='yes' 
             ORDER BY 
                CASE WHEN sort_order = 0 THEN 1 ELSE 0 END, 
                sort_order ASC, 
                name ASC";
    $parentRes = mysqli_query($con, $parentQ);

    $uploadUrl = "https://greenfieldsupermarket.com/admin/upload/stores/";
    $defaultImage = "https://greenfieldsupermarket.com/images/category-placeholder.jpg";

    while($parent = mysqli_fetch_assoc($parentRes)):
        if(isset($catsy['id']) && $parent['id'] == $catsy['id']) continue;

        $parentImage = !empty($parent['image']) ? $uploadUrl . $parent['image'] : $defaultImage;

        // Children of this parent
        $childQ = "SELECT * FROM sizee 
           WHERE menuID = {$parent['id']} AND keyword='yes' 
           ORDER BY 
              CASE WHEN sort_order = 0 THEN 1 ELSE 0 END, 
              sort_order ASC, 
              name ASC";
        $childRes = mysqli_query($con, $childQ);
        $hasChild = mysqli_num_rows($childRes) > 0;
        $collapseId = "collapseMobile" . $parent['id'];
    ?>
        <div class="accordion-item border-0 mb-2">
            <?php if($hasChild): ?>
                <!-- Parent with children -->
                <h2 class="accordion-header" id="headingMobile<?= $parent['id']; ?>">
                    <button class="accordion-button collapsed d-flex align-items-center gap-2"
                            type="button" data-bs-toggle="collapse"
                            data-bs-target="#<?= $collapseId; ?>"
                            aria-expanded="false" aria-controls="<?= $collapseId; ?>">

                        <img src="/images/category-placeholder.jpg" data-src="<?= $parentImage ?>"
                             class="lazyload rounded-circle border" width="28" height="28"
                             alt="<?= htmlspecialchars($parent['name']); ?>">
                        <span><?= htmlspecialchars($parent['name']); ?></span>
                    </button>
                </h2>

                <div id="<?= $collapseId; ?>" class="accordion-collapse collapse"
                     aria-labelledby="headingMobile<?= $parent['id']; ?>" data-bs-parent="#categoryAccordionMobile">
                    <div class="accordion-body py-2">
                        <ul class="list-unstyled ms-3">
                            <?php while($child = mysqli_fetch_assoc($childRes)):
                                $childImage = !empty($child['image']) ? $uploadUrl . $child['image'] : $defaultImage;
                            ?>
                                <li class="mb-2">
                                    <a href="/category/<?= htmlspecialchars($child['slug']); ?>/"
                                       class="d-flex align-items-center gap-2 text-decoration-none text-dark small">
                                        <img src="/images/category-placeholder.jpg" data-src="<?= $childImage ?>"
                                             class="lazyload rounded-circle border" width="22" height="22"
                                             alt="<?= htmlspecialchars($child['name']); ?>">
                                        <?= htmlspecialchars($child['name']); ?>
                                    </a>
                                </li>
                            <?php endwhile; ?>
                        </ul>
                    </div>
                </div>

            <?php else: ?>
                <!-- Parent with no children -->
                <a href="/category/<?= htmlspecialchars($parent['slug']); ?>/"
                   class="nav-link d-flex align-items-center gap-2 p-2 text-dark">
                    <img src="/images/category-placeholder.jpg" data-src="<?= $parentImage ?>"
                         class="lazyload rounded-circle border" width="28" height="28"
                         alt="<?= htmlspecialchars($parent['name']); ?>">
                    <span><?= htmlspecialchars($parent['name']); ?></span>
                </a>
            <?php endif; ?>
        </div>
    <?php endwhile; ?>
</div>


</div>

    <!-- ✅ Sidebar (Desktop) -->
    <div class="col-12 col-md-3 d-none d-md-block">
      <?php
      // pointer reset
      mysqli_data_seek($bRes, 0);
      ?>

      <?php if($hasBrands): ?>
        <h5 class="mb-3">Brands in <?= htmlspecialchars($catsy['name']); ?></h5>
        <ul class="list-group mb-4">
          <li class="list-group-item">
            <a href="#" class="brandFilter fw-bold text-primary" data-cat="<?= $catsy['id']; ?>" data-id="0">
              View All
            </a>
          </li>
          <?php while($b = mysqli_fetch_assoc($bRes)): ?>
            <li class="list-group-item">
              <a href="#" class="brandFilter" data-cat="<?= $catsy['id']; ?>" data-id="<?= $b['id']; ?>">
                <?= htmlspecialchars($b['name']); ?>
              </a>
            </li>
          <?php endwhile; ?>
        </ul>
      <?php endif; ?>

      <!-- ✅ Other Categories -->
      <h5 class="mb-3">Other Categories</h5>
 <div class="accordion" id="categoryAccordion">
    <?php
    // Sirf parents (menuID = 0)
    $parentQ = "SELECT * FROM sizee 
             WHERE menuID = 0 AND keyword='yes' 
             ORDER BY 
                CASE WHEN sort_order = 0 THEN 1 ELSE 0 END, 
                sort_order ASC, 
                name ASC";
    $parentRes = mysqli_query($con, $parentQ);

    $uploadUrl = "https://greenfieldsupermarket.com/admin/upload/stores/";
    $defaultImage = "https://greenfieldsupermarket.com/images/category-placeholder.jpg";

    while($parent = mysqli_fetch_assoc($parentRes)):
        if(isset($catsy['id']) && $parent['id'] == $catsy['id']) continue;

        $parentImage = !empty($parent['image']) ? $uploadUrl . $parent['image'] : $defaultImage;

        // Children of this parent
        $childQ = "SELECT * FROM sizee 
           WHERE menuID = {$parent['id']} AND keyword='yes' 
           ORDER BY 
              CASE WHEN sort_order = 0 THEN 1 ELSE 0 END, 
              sort_order ASC, 
              name ASC";
        $childRes = mysqli_query($con, $childQ);
        $hasChild = mysqli_num_rows($childRes) > 0;
        $collapseId = "collapse" . $parent['id'];
    ?>
        <div class="accordion-item border-0 mb-2">
            <?php if($hasChild): ?>
                <!-- Parent with children -->
                <h2 class="accordion-header" id="heading<?= $parent['id']; ?>">
                    <button class="accordion-button collapsed d-flex align-items-center gap-2"
                            type="button" data-bs-toggle="collapse"
                            data-bs-target="#<?= $collapseId; ?>"
                            aria-expanded="false" aria-controls="<?= $collapseId; ?>">

                        <img src="/images/category-placeholder.jpg" data-src="<?= $parentImage ?>"
                             class="lazyload rounded-circle border" width="28" height="28"
                             alt="<?= htmlspecialchars($parent['name']); ?>">
                        <span><?= htmlspecialchars($parent['name']); ?></span>
                    </button>
                </h2>

                <div id="<?= $collapseId; ?>" class="accordion-collapse collapse"
                     aria-labelledby="heading<?= $parent['id']; ?>" data-bs-parent="#categoryAccordion">
                    <div class="accordion-body py-2">
                        <ul class="list-unstyled ms-3">
                            <?php while($child = mysqli_fetch_assoc($childRes)):
                                $childImage = !empty($child['image']) ? $uploadUrl . $child['image'] : $defaultImage;
                            ?>
                                <li class="mb-2">
                                    <a href="/category/<?= htmlspecialchars($child['slug']); ?>/"
                                       class="d-flex align-items-center gap-2 text-decoration-none text-dark small">
                                        <img src="/images/category-placeholder.jpg" data-src="<?= $childImage ?>"
                                             class="lazyload rounded-circle border" width="22" height="22"
                                             alt="<?= htmlspecialchars($child['name']); ?>">
                                        <?= htmlspecialchars($child['name']); ?>
                                    </a>
                                </li>
                            <?php endwhile; ?>
                        </ul>
                    </div>
                </div>
            <?php else: ?>
                <!-- Parent without children -->
                <a href="/category/<?= htmlspecialchars($parent['slug']); ?>/"
                   class="nav-link d-flex align-items-center gap-2 p-2 text-dark">
                    <img src="/images/category-placeholder.jpg" data-src="<?= $parentImage ?>"
                         class="lazyload rounded-circle border" width="28" height="28"
                         alt="<?= htmlspecialchars($parent['name']); ?>">
                    <span><?= htmlspecialchars($parent['name']); ?></span>
                </a>
            <?php endif; ?>
        </div>
    <?php endwhile; ?>
</div>


    </div>

  </div>
</div>


<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
// Brand filter
$(document).on("click", ".brandFilter", function(e){
  e.preventDefault();

  let brandId = $(this).data("id");
  let catId   = $(this).data("cat");

  $.post("/ajax/get-products.php", {catId: catId, brandId: brandId}, function(data){
    $("#productList").html(data);
  });
});

// Direct category (without brands)
$(document).on("click", ".categoryDirect", function(e){
  e.preventDefault();

  let catId = $(this).data("cat");

  $.post("/ajax/get-products.php", {catId: catId}, function(data){
    $("#productList").html(data);
  });
});


</script>
 
<?php include("../product-js.php");?>
<?php include("../footer.php");?>          
<?php include("../js.php");?>
