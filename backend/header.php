
   

    
<?php
$cart = $_SESSION['cart'] ?? [];
$total = 0;
?>

<div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offcanvasCart">
  <div class="offcanvas-header justify-content-between align-items-center w-100">
  <h5 class="offcanvas-title d-flex align-items-center gap-2 mb-0">
  <span>Your Cart</span>
  <span id="cart-count-offcanvas" class="badge bg-primary rounded-pill d-none">0</span>
</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>

  <div class="offcanvas-body d-flex flex-column">
    <!-- 🛒 Cart items scrollable -->
    <div class="cart-items flex-grow-1 overflow-auto" style="max-height: 60vh;">
      <div id="cartContent">
        <!-- Cart contents load here via AJAX -->
      </div>
    </div>

    <!-- 🛒 Fixed footer with Total + Buttons -->
    <div class="cart-footer mt-3 border-top pt-3">
      <div class="d-flex justify-content-between mb-2">
        <span class="fw-bold">Total</span>
        <strong id="cart-total">0.00</strong>
      </div>

      <div class="d-grid gap-2">
       
  <?php if (basename($_SERVER['PHP_SELF']) !== "checkout.php"): ?>
    <!-- Continue Shopping (only if NOT checkout.php) -->
    <a href="/shop.php" class="btn btn-outline-secondary" id="continueShoppingBtn">
      Continue Shopping
    </a>
    
  <?php else: ?>
    <!-- Update Cart (only if checkout.php) -->
      <a href="/checkout.php" class="btn btn-secondary">Update Cart</a>
  <?php endif; ?>
 

        <a href="/checkout.php" class="btn btn-primary">Proceed to Checkout</a>
      </div>
    </div>
  </div>
</div>



    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar">

      <div class="offcanvas-header justify-content-between">
        <a href="https://greenfieldsupermarket.com/">
                <img src="https://greenfieldsupermarket.com/images/gf-logo-official.png" alt="logo" width="50%" class="img-fluid"> 
              </a>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
<?php
// Parents (menuID = 0)
$parentsQ = "SELECT * FROM sizee 
             WHERE menuID = 0 AND keyword='yes' 
             ORDER BY 
                CASE WHEN sort_order = 0 THEN 1 ELSE 0 END, 
                sort_order ASC, 
                name ASC";
$parentsRes = mysqli_query($con, $parentsQ);

// URLs
$uploadUrl = "https://greenfieldsupermarket.com/admin/upload/stores/";
$defaultImage = "https://greenfieldsupermarket.com/images/category-placeholder.jpg";
?>

<div class="offcanvas-body">
    <div class="accordion" id="menuAccordion">
        <?php while($parent = mysqli_fetch_assoc($parentsRes)): 
            // Parent image
            $parentImage = !empty($parent['image']) 
                ? $uploadUrl . $parent['image'] 
                : $defaultImage;

            // Fetch children
           $childQ = "SELECT * FROM sizee 
           WHERE menuID = {$parent['id']} AND keyword='yes' 
           ORDER BY 
              CASE WHEN sort_order = 0 THEN 1 ELSE 0 END, 
              sort_order ASC, 
              name ASC";
            $childRes = mysqli_query($con, $childQ);
            $hasChild = mysqli_num_rows($childRes) > 0;
            $collapseId = "collapseParent" . $parent['id'];
        ?>
        
        <div class="accordion-item border-0 mb-2">
            <?php if($hasChild): ?>
                <!-- Parent with children -->
                <h2 class="accordion-header" id="heading<?= $parent['id']; ?>">
                    <button class="accordion-button collapsed d-flex align-items-center gap-2" 
                            type="button" data-bs-toggle="collapse" 
                            data-bs-target="#<?= $collapseId; ?>" 
                            aria-expanded="false" aria-controls="<?= $collapseId; ?>">
                        
                        <img src="https://greenfieldsupermarket.com/images/category-placeholder.jpg" data-src="<?= $parentImage ?>" 
                             class="lazyload rounded-circle border" width="32" height="32" 
                             alt="<?= htmlspecialchars($parent['name']); ?>">
                        <span class="fw-semibold"><?= htmlspecialchars($parent['name']); ?></span>
                    </button>
                </h2>

                <div id="<?= $collapseId; ?>" class="accordion-collapse collapse" 
                     aria-labelledby="heading<?= $parent['id']; ?>" data-bs-parent="#menuAccordion">
                    <div class="accordion-body py-2">
                        <ul class="list-unstyled ms-3">
                            <?php while($child = mysqli_fetch_assoc($childRes)): 
                                $childImage = !empty($child['image']) 
                                    ? $uploadUrl . $child['image'] 
                                    : $defaultImage;
                            ?>
                            <li class="mb-2">
                                <a href="https://greenfieldsupermarket.com/category/<?= htmlspecialchars($child['slug']); ?>/" 
                                   class="d-flex align-items-center gap-2 text-decoration-none text-dark small">
                                    <img src="https://greenfieldsupermarket.com/images/category-placeholder.jpg" data-src="<?= $childImage ?>" 
                                         class="lazyload rounded-circle border" width="24" height="24" 
                                         alt="<?= htmlspecialchars($child['name']); ?>">
                                    <?= htmlspecialchars($child['name']); ?>
                                </a>
                            </li>
                            <?php endwhile; ?>
                        </ul>
                    </div>
                </div>
            
            <?php else: ?>
                <!-- Parent without children (direct link) -->
                <a href="https://greenfieldsupermarket.com/category/<?= htmlspecialchars($parent['slug']); ?>/" 
                   class="nav-link d-flex align-items-center gap-2 p-2 text-dark">
                    <img src="<?= $parentImage ?>" 
                         class="rounded-circle border" width="32" height="32" 
                         alt="<?= htmlspecialchars($parent['name']); ?>">
                    <span class="fw-semibold"><?= htmlspecialchars($parent['name']); ?></span>
                </a>
            <?php endif; ?>
        </div>

        <?php endwhile; ?>
    </div>
</div>






    </div>

    <header>
      <div class="container-fluid">
        <div class="row py-1 border-bottom">
          
          <div class="col-sm-4 col-lg-2 text-center text-sm-start d-flex gap-3 justify-content-center justify-content-md-start">
            <div class="d-flex align-items-center my-3 my-sm-0">
              <a href="https://greenfieldsupermarket.com/">
                <img src="https://greenfieldsupermarket.com/images/category-placeholder.jpg" data-src="https://greenfieldsupermarket.com/images/gf-logo-official.png" alt="logo" class="lazyload img-fluid d-none d-lg-block">
              </a>
                 
            </div>
         
          </div>
  <!-------- Mobile menu ---->        
      <div class="col-sm-6 offset-sm-2 offset-md-0 offset-lg-4 col-lg-4 order-2 order-md-1">
  <div class="search-bar row bg-light p-2 rounded-4 mt-20d mb-20m mobile-sticky-search">
    <div class="col-11 col-md-11">
      <form id="search-form" class="text-center" action="/shop.php" method="get">
      <?php $q = $q ?? ($_GET['q'] ?? ''); ?>
<input 
  type="text" 
  name="q" 
  class="form-control border-0 bg-transparent" 
  value="<?= htmlspecialchars($q) ?>" 
  placeholder="Search for more than 20,000 products">
      </form>
    </div>
    <div class="col-1 d-flex align-items-center justify-content-center">
      <button type="submit" form="search-form" class="btn p-0 border-0 bg-transparent">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z"/>
        </svg>
      </button>
    </div>
  </div>
</div>
 
    <div class="d-flex align-items-center justify-content-between mobile-theme order-1 order-md-2 d-md-none">
  
  <!-- LEFT: Menu -->
  <div>
    <a class="navbar-toggler p-2 mx-1" href="javascript:;" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
       aria-controls="offcanvasNavbar">
      <svg width="24" height="24"><use xlink:href="#menu"></use></svg>
    </a>
  </div>

  <!-- CENTER: Logo -->
  <div class="mx-auto">
    <a class="logom" href="/">
      <img src="https://greenfieldsupermarket.com/images/mobile-logo-official.png" alt="Logo" class="img-fluid" style="max-height:40px;">
    </a>
  </div>

  <!-- RIGHT: Login + Cart -->
  <a href="https://greenfieldsupermarket.com/user-login" class="p-2 mx-1">
                  <svg width="24" height="24"><use xlink:href="#user"></use></svg>
                </a>
  <a href="javascript:;" class="p-2 mx-1" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">
    <svg width="24" height="24"><use xlink:href="#shopping-bag"></use></svg>
    <span id="cart-count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger iconcart d-none">0</span>
  </a>
 

</div>

           <!-------- Desktop menu ---->        
          <div class="col-sm-8 col-lg-2 d-none d-md-flex gap-5 align-items-center justify-content-center justify-content-sm-end order-1 order-md-2">
            <ul class="d-flex justify-content-end list-unstyled m-0">
                  
 
                   <li>
                 <a class="navbar-toggler p-2 mx-1"  href="javascript:;" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar">
              <svg width="24" height="24"><use xlink:href="#menu"></use></svg>
            </a>
              </li>
              <li>
                <a href="https://greenfieldsupermarket.com/user-login" class="p-2 mx-1">
                  <svg width="24" height="24"><use xlink:href="#user"></use></svg>
                </a>
              </li>
           
<li class="position-relative">
  <a href="javascript:;" class="p-2 mx-1" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">
    <svg width="24" height="24"><use xlink:href="#shopping-bag"></use></svg>
    <span id="cart-count-desktop" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger iconcart d-none">0</span>
  </a>
</li>


            </ul>
          </div>

        </div>
      </div>
    </header>