<?php include('head.php');
error_reporting(0);
$controls=new htmlControl;
$id=$_REQUEST['orderID'];
		$query = "select * from affiliate where orderID=".$_GET['id']."";
		//echo $query;
		
				$result = mysqli_query($con,$query); 
								$row = mysqli_fetch_array($result);
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('order detail');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <div class="ibox-tools">
                                    <a class="collapse-link">
                                        <i class="fa fa-chevron-up"></i>
                                    </a>
                                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                                        <i class="fa fa-wrench"></i>
                                    </a>
                                </div>
                            </div>
                      <div class="table-responsive">
                                    <table class="table table-striped table-bordered table-hover dataTables-example" >
                                        <tbody>
                                            <form action="finalamount.php" method="post" name="form1" id="form1">
                                                <tr>
                                                <th>Final Amount</th>
                                                <td>
                                                  <input name="balanceAmount" type="text" class="text7" id="balanceAmount" size="40" value="<?php echo $row['balanceAmount']; ?>" />
                                                </td>
                                                </tr>
                                                <td colspan="5"><input type="hidden" name="id" id="id" value="<?php echo $id; ?>" /></td>
                                                 
<tr>
                                                <td colspan="5"><input name="Submit" type="submit" class="text7" id="Submit" value="Update" />
					            <input name="Reset" type="reset" class="text7" id="Reset" value="Reset" /></td>
			 </tr>
			
</body>
</html>