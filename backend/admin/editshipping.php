<?php include('head.php');
$controls=new htmlControl;
$query = "select * from shipping";
$result = mysqli_query($con,$query); 
$row = mysqli_fetch_array($result);
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('social media links');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <div class="ibox-content">
                                    <div class="">

                                    </div></div>
<form action="shippingUpdated.php" method="post" name="form1" id="form1">
                                <div class="table-responsive">
                                    <table class="table table-striped table-bordered table-hover dataTables-example" >
                                        <thead>
                                            <tr>
                                                <th>Logo</th>
                                                <th>Text Pages Title</th>
                                                <th>Option</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php 
                                            $query = "select * from shipping";
                                            $result = mysqli_query($con,$query); 
                                            $rec_found = mysqli_num_rows($result);
                                            $row = mysqli_fetch_array($result);
                                            ?>
                                            
                                            <tr class="gradeX">
                                                <td><i class="center fa fa-facebook-square"></i></td>
                                                <td> Facebook</td>
                                                <td class="center">
                                                    <input type="text" name="fb" value="<?php echo $row['fb']; ?>" class="form-control"></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td><i class="fa fa-twitter-square"></i></td>
                                                <td>Twitter</td>
                                                <td class="center"><input type="text" name="twitter" value="<?php echo $row['twitter']; ?>" class="form-control"></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td><i class="fa fa-linkedin-square"></i></td>
                                                <td>Linkedin</td>
                                                <td class="center"><input type="text" name="linkedin" value="<?php echo $row['linkedin']; ?>" class="form-control"></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td><i class="fa fa-pinterest-square"></i></td>
                                                <td>Pinterest</td>
                                                <td class="center"><input type="text" name="pinterest" value="<?php echo $row['pinterest']; ?>" class="form-control"></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td><i class="fa fa-skype"></i></td>
                                                <td>Skype</td>
                                                <td class="center"><input type="text" name="skype" value="<?php echo $row['skype']; ?>" class="form-control"></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td><i class="fa fa-comment"></i></td>
                                                <td>Chat</td>
                                                <td class="center"><input type="text" name="chat" value="<?php echo $row['chat']; ?>" class="form-control"></td>
                                            </tr>
                                            <tr class="gradeX">
                                                <td><i class="fa fa-mobile-phone (alias)"></i></td>
                                                <td>Call Us</td>
                                                <td class="center"><input type="text" name="callus" value="<?php echo $row['callus']; ?>" class="form-control"></td>
                                            </tr>
                                            



                                        </tbody>
                                    </table>`
                                    <input name="Submit2" type="submit" class="btn btn-block btn-outline btn-success" value="Update Social Media" /></div>
                                    </form>
                                

                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <?php include('footer.php'); ?>

        </div>
    </div>

    <?php include('script.php'); ?>
</body>
</html>
