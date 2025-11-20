<?php
session_start();
include("admin/includes/db_settings.php"); 
include("html.php");

// Agar user already login hai
if (isset($_SESSION['user_id'])) {
    header("Location: /dashboard.php");
    exit;
}

$error = "";
$success = "";

// ======== REGISTER HANDLING ==========
if (isset($_POST['register'])) {
    $name     = trim($_POST['name']);
    $email    = trim($_POST['email']);
    $password = trim($_POST['password']);
    $phone    = trim($_POST['phone']);

    // Address fields
    $city          = trim($_POST['city']);
    $phase         = trim($_POST['phase']);
    $sector        = trim($_POST['sector']);
    $street        = trim($_POST['street']);
    $type          = trim($_POST['type']);
    $house_number  = trim($_POST['house_number']);
    $apartment     = trim($_POST['apartment_info']);

    if ($name && $email && $password && $phone && $city && $phase && $sector && $street) {
        // Pehle check karo user exist to nahi karta
        $check = $con->prepare("SELECT id FROM users WHERE email = ?");
        $check->bind_param("s", $email);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            $error = "Email already registered.";
        } else {
            $hashedPass = password_hash($password, PASSWORD_BCRYPT);
            $created_at = date("Y-m-d H:i:s");

            // Address string bana lo
            $fullAddress = "$city, $phase, $sector, Street: $street";
            if ($type === "House" && $house_number) {
                $fullAddress .= ", House: $house_number";
            }
            if ($type === "Apartment" && $apartment) {
                $fullAddress .= ", Apartment: $apartment";
            }

            $stmt = $con->prepare("INSERT INTO users (name, email, password, phone, address, created_at) VALUES (?,?,?,?,?,?)");
            $stmt->bind_param("ssssss", $name, $email, $hashedPass, $phone, $fullAddress, $created_at);

            if ($stmt->execute()) {
                $success = "Registration successful. Please login.";
            } else {
                $error = "Something went wrong.";
            }
        }
    } else {
        $error = "All fields are required.";
    }
}

// ======== LOGIN HANDLING ==========
if (isset($_POST['login'])) {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    if ($email !== "" && $password !== "") {
        $stmt = $con->prepare("SELECT id, name, email, phone, address, password FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            if (password_verify($password, $row['password'])) {
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['user_name'] = $row['name'];
                $_SESSION['user_email'] = $row['email'];
                $_SESSION['user_phone'] = $row['phone'] ?? '';
                $_SESSION['user_address'] = $row['address'];

                header("Location: /dashboard.php");
                exit;
            } else {
                $error = "Invalid password.";
            }
        } else {
            $error = "User not found.";
        }
    } else {
        $error = "Please enter both email and password.";
    }
}
?>
<?php include("head.php"); ?>
</head>
<body>
<?php include("header.php"); ?>

<div class="container d-flex align-items-center justify-content-center" style="min-height:100vh;">
  <div class="card shadow p-4" style="max-width:450px; width:100%;">
    <h3 class="text-center mb-4">Login / Register</h3>

    <?php if ($error): ?>
      <div class="alert alert-danger"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>
    <?php if ($success): ?>
      <div class="alert alert-success"><?= htmlspecialchars($success) ?></div>
    <?php endif; ?>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-3" id="authTabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" data-bs-toggle="tab" href="#loginTab">Login</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-bs-toggle="tab" href="#registerTab">Register</a>
      </li>
    </ul>

    <div class="tab-content">
      <!-- Login Form -->
      <div class="tab-pane fade show active" id="loginTab">
        <form method="post">
          <div class="mb-3">
            <label>Email</label>
            <input type="email" name="email" class="form-control" required>
          </div>
          <div class="mb-3">
            <label>Password</label>
            <input type="password" name="password" class="form-control" required>
          </div>
          <button type="submit" name="login" class="btn btn-primary w-100">Login</button>
        </form>
      </div>

      <!-- Register Form -->
      <div class="tab-pane fade" id="registerTab">
        <form method="post">
          <div class="mb-3">
            <label>Name</label>
            <input type="text" name="name" class="form-control" required>
          </div>
          <div class="mb-3">
            <label>Email</label>
            <input type="email" name="email" class="form-control" required>
          </div>
          <div class="mb-3">
            <label>Password</label>
            <input type="password" name="password" class="form-control" required>
          </div>
          <div class="mb-3">
            <label>Phone</label>
            <input type="text" name="phone" class="form-control" required>
          </div>

          <!-- Address -->
          <div id="regAddressFields">
            <div class="mb-3">
            <label>Address</label>
              <select disabled class="form-select" id="regCitySelect" name="city" required>
                <option value="Islamabad" selected>Islamabad</option>
                  <input type="hidden" name="city" value="Islamabad">
              </select>
            </div>
            <div class="mb-3">
          
   <select class="form-select" id="regAreaSelect" name="phase_id" required>
  <option value="">Select Area</option>
  <?php
  $phases = $con->query("SELECT id, name FROM locations WHERE parent_id IS NULL ORDER BY name ASC");
  while($p = $phases->fetch_assoc()){
      echo '<option value="'.$p['id'].'" data-name="'.htmlspecialchars($p['name']).'">'.$p['name'].'</option>';
  }
  ?>
</select>
<input type="hidden" name="phase" id="phaseName">
            </div>
            <div class="mb-3">
         
              <select class="form-select" id="regSectorSelect" name="sector" required>
                <option value="">Select Sector</option>
              </select>
            </div>
            <div class="mb-3">
              <input type="text" class="form-control" name="street" placeholder="Street Number" required>
            </div>
            <div class="mb-3">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="type" value="House" id="regHouseRadio" checked>
                <label class="form-check-label" for="regHouseRadio">House</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="type" value="Apartment" id="regApartmentRadio">
                <label class="form-check-label" for="regApartmentRadio">Apartment</label>
              </div>
            </div>
            <div class="mb-3" id="regHouseDiv">
              <input type="text" class="form-control" name="house_number" placeholder="House Number">
            </div>
            <div class="mb-3 d-none" id="regApartmentDiv">
              <input type="text" class="form-control" name="apartment_info" placeholder="Apartment Name & Number">
            </div>
          </div>
          <!-- End Address -->

          <button type="submit" name="register" class="btn btn-success w-100">Register</button>
        </form>
      </div>
    </div>
  </div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function(){
  const phaseSelect = document.getElementById("regAreaSelect");
  const sectorSelect = document.getElementById("regSectorSelect");
  const phaseNameHidden = document.getElementById("phaseName");

  // Phase name hidden input fill karna
  if(phaseSelect){
    phaseSelect.addEventListener("change", function(){
      const selected = this.options[this.selectedIndex];
      phaseNameHidden.value = selected.dataset.name || "";

      const phaseId = this.value;
      sectorSelect.innerHTML = '<option value="">Loading...</option>';

      if(phaseId){
        fetch("../get_sectors.php?phase_id=" + phaseId) // path check karo
          .then(res => res.json())
          .then(data => {
            sectorSelect.innerHTML = '<option value="">Select Sector</option>';
            data.forEach(sec => {
              const opt = document.createElement("option");
              opt.value = sec.name; // name save karna hai
              opt.textContent = sec.name;
              sectorSelect.appendChild(opt);
            });
          })
          .catch(err => {
            console.error("Fetch error:", err);
            sectorSelect.innerHTML = '<option value="">Error loading sectors</option>';
          });
      } else {
        sectorSelect.innerHTML = '<option value="">Select Sector</option>';
      }
    });
  }

  // House/Apartment toggle
  const houseRadio = document.getElementById("regHouseRadio");
  const aptRadio = document.getElementById("regApartmentRadio");
  const houseDiv = document.getElementById("regHouseDiv");
  const aptDiv = document.getElementById("regApartmentDiv");

  function toggleAddressFields(){
    if(houseRadio && houseRadio.checked){
      houseDiv.classList.remove("d-none");
      aptDiv.classList.add("d-none");
    } else {
      houseDiv.classList.add("d-none");
      aptDiv.classList.remove("d-none");
    }
  }

  if(houseRadio && aptRadio){
    houseRadio.addEventListener("change", toggleAddressFields);
    aptRadio.addEventListener("change", toggleAddressFields);
  }
});
</script>

<?php include("js.php"); ?>
<?php include("product-js.php"); ?>
<?php include("footer.php"); ?>
</body>
</html>
