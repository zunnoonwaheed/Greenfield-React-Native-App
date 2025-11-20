<?php
if(!isset($_SESSION["userName"])){
    echo '<script language="javascript">window.location=\'login.php\';</script>';
    exit();} ?>
<nav class="navbar-default navbar-static-side" role="navigation">
    <div class="sidebar-collapse">
        <ul class="nav metismenu" id="side-menu">
            <li class="nav-header">
                <div class="dropdown profile-element"> <span>
                        <img alt="image" class="img-circle" src="img/profile_small.png" width="100" height="100"/>
                    </span>
                    <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                        <span class="clear"> <span class="block m-t-xs"> <strong class="font-bold"><?php echo $_SESSION['userName'] ?><!--Administration--></strong>
                        </span> <span class="text-muted text-xs block"></span><?php echo $_SESSION["role"]; ?><b class="caret"></b></span> </span> </a>
                    <ul class="dropdown-menu animated fadeInRight m-t-xs">
                        <li><a href="change_pwd.php">Change Password</a></li>
                        <li class="divider"></li>
                        <li><a href="logout.php">Logout</a></li>
                    </ul>
                </div>
                <div class="logo-element">
                    PW
                </div>
            </li>
            <!-- class="active" -->
            <li>
               <!-- Dashboard Link with Notification -->
<a href="orders.php" id="orders-link">
    <i class="fa fa-th-large"></i>
    <span class="nav-label">Dashboards</span>
    <span class="badge bg-danger" id="new-orders-count">0</span>
</a>

<!-- Notification Sound -->
<audio id="new-order-sound" src="notification.wav" preload="auto"></audio>

                  <a href="posts.php"><i class="fa fa-th-large"></i> <span class="nav-label">Products</span> <span class="fa arrow"></span></a>
            
            <?php
			//echo $_SESSION['role'];
            if($_SESSION["role"]=='subadmin'){
                $menu=mysqli_query("SELECT * FROM `menu` WHERE menuid IN(select mid from access where sid='".$_SESSION['id']."')");
            }
            else{
                $menu=mysqli_query($con,"SELECT * FROM menu limit 0,13");
            }
            while($menu_item=mysqli_fetch_array($menu)){
                ?> <?php 
                //if($menu_item['id']<=15)
                 // exit;?>

                <li>

                    <a href="<?php echo $menu_item['link']; ?>"><i class="<?php echo $menu_item['icon']; ?>"></i> <span class="nav-label"><?php echo $menu_item['namee']; ?></span></a>
                </li>

                <?php } ?>
                
   
            <li>
                <a href="change_pwd.php"><i class="fa fa-key"></i> <span class="nav-label">Change Password</span></a>
            </li>
            <li>
                <a href="logout.php"><i class="fa fa-sign-out"></i> <span class="nav-label">Logout</span></a>
            </li>

        </ul>

    </div>
</nav>