<?php  include('head1.php'); ?>
<body class="gray-bg">

    <div class="middle-box text-center loginscreen animated fadeInDown">
        <div>
            <div>

            

            </div>            
            <h3>Welcome to Admin Panel</h3>
            
            <form class="m-t" role="form" method="post" action="checkadmin.php">
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="Username" required=""
                        name="lid" id="lid">
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" placeholder="Password" required="" name="pwd" id="pwd">
                </div>
                <button type="submit" class="btn btn-primary block full-width m-b">Login</button>

                <!-- <a href=""><small>Forgot password?</small></a> -->
            </form>
            <strong>Copyright</strong> &copy; <?php echo date('Y');?> - <?php echo date('Y')+1;?>. &copy;  All Rights Reserved.
        </div>
    </div>

    <!-- Mainly scripts -->
    <script src="js/jquery-2.1.1.js"></script>
    <script src="js/bootstrap.min.js"></script>

</body>
</html>
