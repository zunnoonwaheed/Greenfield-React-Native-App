<?php include("admin/includes/db_settings.php"); ?>
<?php session_start(); ?>
<?php
$query_c = "select * from homep where id=1 ORDER by id ASC";
$result_c = mysqli_query($con,$query_c); 
$rec_found_c = mysqli_num_rows($result_c);
$row_c = mysqli_fetch_array($result_c);
include("html.php");
$domain = "https://{$_SERVER['HTTP_HOST']}/";
?>
<title><?php echo $row_c['section9']; ?></title>
<meta name="description" content="<?php echo $row_c['section10']; ?>" />
<link rel="canonical" href="<?php echo $domain;?>" />
<?php include ("head.php");?>
 

</head>
<body>
   <?php include("header.php");?>
 
        <?php
// Fetch image from stores table where locat=1
$query = mysqli_query($con, "SELECT imagee FROM stores WHERE locat=1 LIMIT 1");
$store = mysqli_fetch_assoc($query);

// Agar image mili hai to uska naam variable mein store kar lo
$bannerImage = !empty($store['imagee']) ? $store['imagee'] : 'banner-1-default.jpg';
?>

<section class="d-none d-lg-block lazy-bg" data-bg="admin/upload/stores/<?php echo $bannerImage; ?>" style="background-repeat: no-repeat; background-size: cover;">
    
  
  
      <div class="container-lg">
        <div class="row">
          <div class="col-lg-6 pt-5 mt-5">
           <?php echo $row_c['section11']; ?>
            <p class="fs-4"><?php echo $row_c['section12']; ?></p>
            <div class="d-flex gap-3">
             <?php echo $row_c['section13']; ?>
              <?php echo $row_c['section14']; ?>
            </div>
            <div class="row my-5">
              <div class="col">
                <div class="row text-dark">
               <?php echo $row_c['section15']; ?>
                </div>
              </div>
              <div class="col">
                <div class="row text-dark">
                 <?php echo $row_c['section16']; ?>
                </div>
              </div>
              <div class="col">
                <div class="row text-dark">
                 <?php echo $row_c['section17']; ?>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="row row-cols-1 row-cols-sm-3 row-cols-lg-3 g-0 justify-content-center">
          <div class="col">
            <div class="card border-0 bg-primary rounded-0 p-4 text-light">
              <div class="row">
                <div class="col-md-3 text-center">
                  <svg width="60" height="60"><use xlink:href="#fresh"></use></svg>
                </div>
                <div class="col-md-9">
                  <div class="card-body p-0">
                          <?php echo $row_c['section18']; ?>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card border-0 bg-secondary rounded-0 p-4 text-light">
              <div class="row">
                <div class="col-md-3 text-center">
                  <svg width="60" height="60"><use xlink:href="#organic"></use></svg>
                </div>
                <div class="col-md-9">
                  <div class="card-body p-0">
                         <?php echo $row_c['section19']; ?>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card border-0 bg-danger rounded-0 p-4 text-light">
              <div class="row">
                <div class="col-md-3 text-center">
                  <svg width="60" height="60"><use xlink:href="#delivery"></use></svg>
                </div>
                <div class="col-md-9">
                  <div class="card-body p-0">
                         <?php echo $row_c['section20']; ?>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      </div>
    </section>

    <section class="py-5 overflow-hidden">
      <div class="container-lg">
        <div class="row">
          <div class="col-md-12">

           <!-- Mobile view: sirf View All -->


<!-- Desktop view: heading + View All + arrows -->
<div class="section-header d-none d-md-flex flex-wrap justify-content-between mb-5">
  <h2 class="section-title">Category</h2>

  <div class="d-flex align-items-center">
    <a href="https://greenfieldsupermarket.com/category/" class="btn btn-primary me-2">View All</a>
    <div class="swiper-buttons">
      <button class="swiper-prev category-carousel-prev btn btn-yellow">❮</button>
      <button class="swiper-next category-carousel-next btn btn-yellow">❯</button>
    </div>
  </div>
</div>

            
          </div>
        </div>
      <div class="row g-2">
  <div class="col-md-12">
    <div class="category-carousel swiper">
      <div class="swiper-wrapper">
        <?php
        $catQ = "SELECT * FROM sizee WHERE catID != 0 and keyword1='yes' ORDER BY name ASC";
        $catRes = mysqli_query($con, $catQ);
        while($cat = mysqli_fetch_assoc($catRes)):
          // agar image na ho to placeholder
          $catImage = !empty($cat['image']) ? "admin/upload/stores/".$cat['image'] : "images/category-placeholder.jpg";
        ?>
          <a href="/category/<?= $cat['slug']; ?>/" class="nav-link swiper-slide text-center">
            <img  src="images/category-placeholder.jpg" data-src="<?= $catImage; ?>" class="lazyload category-icon rounded-circle bordery" alt="<?= htmlspecialchars($cat['name']); ?>">
            <h4 class="fs-6 mt-3 fw-normal category-title"><?= htmlspecialchars($cat['name']); ?></h4>
          </a>
        <?php endwhile; ?>
      </div>
    </div>
  </div>
</div>
 
<div class="d-flex d-md-none mb-3">
  <a href="https://greenfieldsupermarket.com/category/" class="btn btn-primary w-100">View All</a>
</div>
</div>
      </div>
    </section>

    <section class="pb-5">
      <div class="container-lg">

        <div class="row">
          <div class="col-md-12">

            <div class="section-header d-none d-md-flex flex-wrap justify-content-between my-4">
              
              <h2 class="section-title"><?php echo $row_c['section5']; ?></h2>

              <div class="d-flex align-items-center">
                <a href="#" class="btn btn-primary rounded-1">View All</a>
              </div>
            </div>
            
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-12">

            <div class="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5">
                  
            <?php
 

// homep table se section1 ids lao jahan id = 1
$homepRes = mysqli_query($con, "SELECT section1 FROM homep WHERE id = 1 LIMIT 1");
$homepRow = mysqli_fetch_assoc($homepRes);

$section1_ids = $homepRow['section1']; // comma separated IDs expected e.g. "2,5,7"

if(!empty($section1_ids)){
    // agar ids hain to unhi products lao
    $sql = "SELECT * FROM dow WHERE id IN ($section1_ids)";
} else {
    // agar ids empty hain to latest products lao
    $sql = "SELECT * FROM dow ORDER BY id DESC LIMIT 8";
}

$res = mysqli_query($con, $sql);

while($row = mysqli_fetch_assoc($res)){
    ?>
   <div class="col-6 col-md-4 col-lg-3 mb-4">
        <div class="product-item">
            <figure>
                <a href="https://greenfieldsupermarket.com/<?php echo $row['slug']; ?>/" title="<?php echo htmlspecialchars($row['namee']); ?>">
                    <img src="images/category-placeholder.jpg" data-src="/admin/upload/dow/<?php echo $row['imagee']; ?>" alt="<?php echo htmlspecialchars($row['namee']); ?>" class="lazyload tab-image">
                </a>
            </figure>
            <div class="d-flex flex-column text-center">
                <h3 class="fs-6 fw-normal">  <?php echo $row['namee']; ?> </h3>
                
                <div class="d-flex justify-content-center align-items-center gap-2">
                    <?php if($row['price'] > $row['dprice']){ ?>
                        <del>Rs.<?php echo $row['price']; ?></del>
                    <?php } ?>
                    <span class="text-dark fw-semibold">Rs.<?php echo $row['dprice']; ?></span>
                </div>
               <div class="button-area p-3 pt-0">
    <form class="addToCartForm mt-auto">
        <input type="hidden" name="product_id" value="<?= $row['id']; ?>">
        <div class="row g-1 mt-2">
            <!-- Quantity box -->
          <div class="col-12 col-md-5">
<div class="input-group input-group-sm elegant-qty rounded-1">
    <button type="button" class="btn btn-outline-secondary qty-btn rounded-start" data-action="decrease">−</button>
    <input type="number" name="qty" value="1" min="1" class="form-control text-center qty-input border-0">
    <button type="button" class="btn btn-outline-secondary qty-btn rounded-end" data-action="increase">+</button>
</div>

</div>


            <!-- Add to Cart button -->
            <div class="col-12 col-md-7">
                <button type="submit" class="btn btn-primary rounded-1 p-2 fs-7 w-100">
                    <svg width="18" height="18"><use xlink:href="#cart"></use></svg> Add to Cart
                </button>
            </div>
        </div>
    </form>
</div>

            </div>
        </div>
    </div>
    <?php
}
?>

 
            
              
            </div>
            <!-- / product-grid -->


          </div>
        </div>
      </div>
    </section>

    <section class="py-3">
      <div class="container-lg">
        <div class="row">
          <div class="col-md-12">

            <div class="banner-blocks">
             <?php
// Fetch image from stores table where locat=1
$query2 = mysqli_query($con, "SELECT imagee FROM stores WHERE locat=2 LIMIT 1");
$store2 = mysqli_fetch_assoc($query2);

// Agar image mili hai to uska naam variable mein store kar lo
$bannerImage2 = !empty($store2['imagee']) ? $store2['imagee'] : 'banner-ad-1-default.jpg';
?>

             <div class="banner-ad d-flex align-items-center large bg-info block-1 lazy-bg" 
     data-bg="admin/upload/stores/<?php echo $bannerImage2; ?>" style="no-repeat;background-size: cover">
  <div class="banner-content p-5 ">
    <div class="content-wrapper text-light">
      <?php echo $row_c['section21']; ?>
    </div>
  </div>
</div>

 
               <?php
// Fetch image from stores table where locat=1
$query3 = mysqli_query($con, "SELECT imagee FROM stores WHERE locat=3 LIMIT 1");
$store3 = mysqli_fetch_assoc($query3);

// Agar image mili hai to uska naam variable mein store kar lo
$bannerImage3 = !empty($store3['imagee']) ? $store3['imagee'] : 'banner-ad-2-default.jpg';
?>

              <div class="banner-ad bg-success-subtle block-2 d-flex lazy-bg" data-bg="admin/upload/stores/<?php echo $bannerImage3; ?>" style="no-repeat;background-size: cover">
                <div class="banner-content align-items-center p-5">
                  <div class="content-wrapper text-light">
                 <?php echo $row_c['section22']; ?>
                  </div>
                </div>
              </div>
 <?php
// Fetch image from stores table where locat=1
$query4 = mysqli_query($con, "SELECT imagee FROM stores WHERE locat=4 LIMIT 1");
$store4 = mysqli_fetch_assoc($query4);

// Agar image mili hai to uska naam variable mein store kar lo
$bannerImage4 = !empty($store4['imagee']) ? $store4['imagee'] : 'banner-ad-3-default.jpg';
?>
              <div class="banner-ad bg-danger block-3 d-flex lazy-bg" data-bg=" admin/upload/stores/<?php echo $bannerImage4; ?>" style="no-repeat;background-size: cover">
                <div class="banner-content align-items-center p-5">
                  <div class="content-wrapper text-light">
                 <?php echo $row_c['section23']; ?>
                  </div>
                </div>
              </div>

            </div>
            <!-- / Banner Blocks -->
              
          </div>
        </div>
      </div>
    </section>

    <section id="featured-products" class="products-carousel">
      <div class="container-lg overflow-hidden py-5">
        <div class="row">
          <div class="col-md-12">

            <div class="section-header d-flex flex-wrap justify-content-between my-4">
              
              <h2 class="section-title"><?php echo $row_c['section6']; ?></h2>

              <div class="d-flex align-items-center">
                <a href="#" class="btn btn-primary me-2 d-none d-md-flex">View All</a>
                <div class="swiper-buttons">
                  <button class="swiper-prev products-carousel-prev btn btn-primary">❮</button>
                  <button class="swiper-next products-carousel-next btn btn-primary">❯</button>
                </div>  
              </div>
            </div>
            
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">

            <div class="swiper">
              <div class="swiper-wrapper">
                                
           
            <?php
 

// homep table se section1 ids lao jahan id = 1
$homepRes2 = mysqli_query($con, "SELECT section2 FROM homep WHERE id = 1 LIMIT 1");
$homepRow2 = mysqli_fetch_assoc($homepRes2);

$section2_ids = $homepRow2['section2']; // comma separated IDs expected e.g. "2,5,7"

if(!empty($section2_ids)){
    // agar ids hain to unhi products lao
    $sql2 = "SELECT * FROM dow WHERE id IN ($section2_ids)";
} else {
    // agar ids empty hain to latest products lao
    $sql2 = "SELECT * FROM dow ORDER BY id ASC LIMIT 8";
}

$res2 = mysqli_query($con, $sql2);

while($row2 = mysqli_fetch_assoc($res2)){
    ?>    

                
                <div class="product-item swiper-slide">
                  <figure>
                    <a href="https://greenfieldsupermarket.com/<?php echo $row2['slug']; ?>/" title="Product Title">
                      <img src="images/category-placeholder.jpg" data-src="/admin/upload/dow/<?php echo $row2['imagee']; ?>" alt="<?php echo htmlspecialchars($row2['namee']); ?>" class="lazyload tab-image product-img">
                    </a>
                  </figure>
                  <div class="d-flex flex-column text-center">
                    <h3 class="fs-6 fw-normal"><?php echo $row2['namee']; ?></h3>
                  
                    <div class="d-flex justify-content-center align-items-center gap-2">
                    <?php if($row2['price'] > $row2['dprice']){ ?>
                        <del>Rs.<?php echo $row2['price']; ?></del>
                    <?php } ?>

                      <span class="text-dark fw-semibold">Rs. <?php echo $row2['dprice']; ?></span>
                      
                    </div>
                   <div class="button-area p-3 pt-0">
    <form class="addToCartForm mt-auto">
        <input type="hidden" name="product_id" value="<?= $row2['id']; ?>">
        <div class="row g-1 mt-2">
            <!-- Quantity box -->
           <div class="col-5">
<div class="input-group input-group-sm elegant-qty rounded-1" style="max-width: 140px;">
    <button type="button" class="btn btn-outline-secondary qty-btn rounded-start" data-action="decrease">−</button>
    <input type="number" name="qty" value="1" min="1" class="form-control text-center qty-input border-0">
    <button type="button" class="btn btn-outline-secondary qty-btn rounded-end" data-action="increase">+</button>
</div>

</div>

            <!-- Add to Cart button -->
             <div class="col-7">
                <button type="submit" class="btn btn-primary rounded-1 p-2 fs-7 w-100">
                    <svg width="18" height="18"><use xlink:href="#cart"></use></svg> Add to Cart
                </button>
            </div>
        </div>
    </form>
</div>

                  </div>
                </div>
<?php
}
?>


                  
              </div>
            </div>
            <!-- / products-carousel -->

          </div>
        </div>
      </div>
    </section>

    <section class="d-none d-lg-block">
      <div class="container-lg">
 <?php
// Fetch image from stores table where locat=1
$query5 = mysqli_query($con, "SELECT imagee FROM stores WHERE locat=5 LIMIT 1");
$store5 = mysqli_fetch_assoc($query5);

// Agar image mili hai to uska naam variable mein store kar lo
$bannerImage5 = !empty($store5['imagee']) ? $store5['imagee'] : 'banner-newsletter-default.jpg';
?>

        <div class="bg-secondary text-light py-5 my-5" style="background: url('admin/upload/stores/<?php echo $bannerImage5; ?>') no-repeat; background-size: cover;">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-md-5 p-3">
                            <?php echo $row_c['section24']; ?>
             
              </div>
              <div class="col-md-5 p-3">
                <form>
                  <div class="mb-3">
                    <label for="name" class="form-label d-none">Name</label>
                    <input type="text"
                      class="form-control form-control-md rounded-0" name="name" id="name" placeholder="Name">
                  </div>
                  <div class="mb-3">
                    <label for="email" class="form-label d-none">Email</label>
                    <input type="email" class="form-control form-control-md rounded-0" name="email" id="email" placeholder="Email Address">
                  </div>
                  <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-dark btn-md rounded-0">Submit</button>
                  </div>
                </form>
                
              </div>
              
            </div>
            
          </div>
        </div>
        
      </div>
    </section>

    <section id="popular-products" class="products-carousel">
      <div class="container-lg overflow-hidden py-5">
        <div class="row">
          <div class="col-md-12">

            <div class="section-header d-flex justify-content-between my-4">
              
              <h2 class="section-title"><?php echo $row_c['section7']; ?></h2>

              <div class="d-flex align-items-center">
                <a href="#" class="btn btn-primary me-2 d-none d-md-flex">View All</a>
                <div class="swiper-buttons">
                  <button class="swiper-prev products-carousel-prev btn btn-primary">❮</button>
                  <button class="swiper-next products-carousel-next btn btn-primary">❯</button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">

            <div class="swiper">
              <div class="swiper-wrapper">
                   <?php
 

// homep table se section1 ids lao jahan id = 1
$homepRes3 = mysqli_query($con, "SELECT section3 FROM homep WHERE id = 1 LIMIT 1");
$homepRow3 = mysqli_fetch_assoc($homepRes3);

$section3_ids = $homepRow3['section3']; // comma separated IDs expected e.g. "2,5,7"

if(!empty($section3_ids)){
    // agar ids hain to unhi products lao
    $sql3 = "SELECT * FROM dow WHERE id IN ($section3_ids)";
} else {
    // agar ids empty hain to latest products lao
    $sql3 = "SELECT * FROM dow ORDER BY id ASC LIMIT 8";
}

$res3 = mysqli_query($con, $sql3);

while($row3 = mysqli_fetch_assoc($res3)){
    ?>                   
 

                <div class="product-item swiper-slide">
                  <figure>
                    <a href="https://greenfieldsupermarket.com/<?php echo $row3['slug']; ?>/" title="Product Title">
                      <img src="images/category-placeholder.jpg" data-src="/admin/upload/dow/<?php echo $row3['imagee']; ?>" alt="<?php echo htmlspecialchars($row3['namee']); ?>" class="lazyload tab-image product-img">
                    </a>
                  </figure>
                  <div class="d-flex flex-column text-center">
                    <h3 class="fs-6 fw-normal"><?php echo $row3['namee']; ?></h3>
                   
                       <div class="d-flex justify-content-center align-items-center gap-2">
                    <?php if($row3['price'] > $row3['dprice']){ ?>
                        <del>$<?php echo $row3['price']; ?></del>
                    <?php } ?>

                      <span class="text-dark fw-semibold">Rs. <?php echo $row3['dprice']; ?></span>
                      
                    </div>

                    <div class="button-area p-3 pt-0">
    <form class="addToCartForm mt-auto">
        <input type="hidden" name="product_id" value="<?= $row3['id']; ?>">
        <div class="row g-1 mt-2">
            <!-- Quantity box -->
          <div class="col-5">
<div class="input-group input-group-sm elegant-qty rounded-1" style="max-width: 140px;">
    <button type="button" class="btn btn-outline-secondary qty-btn rounded-start" data-action="decrease">−</button>
    <input type="number" name="qty" value="1" min="1" class="form-control text-center qty-input border-0">
    <button type="button" class="btn btn-outline-secondary qty-btn rounded-end" data-action="increase">+</button>
</div>

</div>

            <!-- Add to Cart button -->
           <div class="col-7">
                <button type="submit" class="btn btn-primary rounded-1 p-2 fs-7 w-100">
                    <svg width="18" height="18"><use xlink:href="#cart"></use></svg> Add to Cart
                </button>
            </div>
        </div>
    </form>
</div>

                  </div>
                </div>
<?php
}
?>
                  
              </div>
            </div>
            <!-- / products-carousel -->

          </div>
        </div>
      </div>
    </section>

    <section id="latest-products" class="products-carousel">
      <div class="container-lg overflow-hidden pb-5">
        <div class="row">
          <div class="col-md-12">

            <div class="section-header d-flex justify-content-between my-4">
              
              <h2 class="section-title"><?php echo $row_c['section8']; ?></h2>

              <div class="d-flex align-items-center">
                <a href="#" class="btn btn-primary me-2 d-none d-md-flex">View All</a>
                <div class="swiper-buttons">
                  <button class="swiper-prev products-carousel-prev btn btn-primary">❮</button>
                  <button class="swiper-next products-carousel-next btn btn-primary">❯</button>
                </div>  
              </div>
            </div>
            
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">

            <div class="swiper">
              <div class="swiper-wrapper">
                
                            <?php
 

// homep table se section1 ids lao jahan id = 1
$homepRes4 = mysqli_query($con, "SELECT section4 FROM homep WHERE id = 1 LIMIT 1");
$homepRow4 = mysqli_fetch_assoc($homepRes4);

$section4_ids = $homepRow4['section4']; // comma separated IDs expected e.g. "2,5,7"

if(!empty($section4_ids)){
    // agar ids hain to unhi products lao
    $sql4 = "SELECT * FROM dow WHERE id IN ($section4_ids)";
} else {
    // agar ids empty hain to latest products lao
    $sql4 = "SELECT * FROM dow ORDER BY id ASC LIMIT 8";
}

$res4 = mysqli_query($con, $sql4);

while($row4 = mysqli_fetch_assoc($res4)){
    ?>                   
 

                <div class="product-item swiper-slide">
                  <figure>
                    <a href="https://greenfieldsupermarket.com/<?php echo $row4['slug']; ?>/" title="Product Title">
                      <img src="images/category-placeholder.jpg" data-src="/admin/upload/dow/<?php echo $row4['imagee']; ?>" alt="<?php echo htmlspecialchars($row4['namee']); ?>" class="lazyload tab-image product-img">
                    </a>
                  </figure>
                  <div class="d-flex flex-column text-center">
                    <h3 class="fs-6 fw-normal"><?php echo $row4['namee']; ?></h3>
                   
                       <div class="d-flex justify-content-center align-items-center gap-2">
                    <?php if($row4['price'] > $row4['dprice']){ ?>
                        <del>Rs.<?php echo $row4['price']; ?></del>
                    <?php } ?>

                      <span class="text-dark fw-semibold">Rs. <?php echo $row4['dprice']; ?></span>
                      
                    </div>

                    <div class="button-area p-3 pt-0">
    <form class="addToCartForm mt-auto">
        <input type="hidden" name="product_id" value="<?= $row4['id']; ?>">
        <div class="row g-1 mt-2">
            <!-- Quantity box -->
             <div class="col-5">
<div class="input-group input-group-sm elegant-qty rounded-1" style="max-width: 140px;">
    <button type="button" class="btn btn-outline-secondary qty-btn rounded-start" data-action="decrease">−</button>
    <input type="number" name="qty" value="1" min="1" class="form-control text-center qty-input border-0">
    <button type="button" class="btn btn-outline-secondary qty-btn rounded-end" data-action="increase">+</button>
</div>

</div>

            <!-- Add to Cart button -->
                  <div class="col-7">
                <button type="submit" class="btn btn-primary rounded-1 p-2 fs-7 w-100">
                    <svg width="18" height="18"><use xlink:href="#cart"></use></svg> Add to Cart
                </button>
            </div>
        </div>
    </form>
</div>

                  </div>
                </div>
<?php
}
?>
               

             

         

             
 

             

            

              
                  
              </div>
            </div>
            <!-- / products-carousel -->

          </div>
        </div>
      </div>
    </section>
 <script>
document.addEventListener("DOMContentLoaded", function () {
  const lazyBgs = document.querySelectorAll(".lazy-bg");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let el = entry.target;
        let bg = el.getAttribute("data-bg");
        if (bg) {
          el.style.backgroundImage = `url('${bg}')`;
          el.classList.add("fade-in-bg"); // animation
          obs.unobserve(el);
        }
      }
    });
  });

  lazyBgs.forEach(el => observer.observe(el));
});
</script>
 
 
    
 

<?php include("product-js.php");?>
	 
  <?php include("footer.php");?>
  <?php include("js.php");?>
</body>

</html>
