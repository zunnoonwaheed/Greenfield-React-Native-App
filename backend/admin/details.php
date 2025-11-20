<?php include('head.php');
error_reporting(0);
$controls=new htmlControl;
$id=$_REQUEST['id'];
$query_meta = "select * from cart where id=$id";
//echo $query;
$result_meta = mysqli_query($con,$query_meta); 
$row_meta = mysqli_fetch_array($result_meta);
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
                            <div class="ibox-content">
                                <div class="">

                                </div>

                                <div class="table-responsive">
                                    <table class="table table-striped table-bordered table-hover dataTables-example" >
                                        <tbody>
                                            <tr>
                                                <th>Paper Topic *</th>
                                                <td>
                                                    <?php
                                                    $query = "select * from products where id=".$row_meta['topic']."";
                                                    $result = mysqli_query($con,$query); 
                                                    $row = mysqli_fetch_array($result);
                                                    echo $row['namee'];?>
                                                </td>
                                            </tr>
                                            <tr>
                                                <?php
                                                $f=1;
                                                $query = "select * from cartImage where shopID=".$row_meta['shopID']."";
                                                $result = mysqli_query($con,$query); 
                                                while($row = mysqli_fetch_array($result)){
                                                    ?>
                                                    <th>Download File <?php echo $f;?></th>
                                                    <td><a href="upload/order/<?php echo $row_meta['shopID'];?>/<?php echo $row['imagee'];?>" target="_blank"><input type="button" value="Download File" class="form-control"/></a></td>
                                                </tr>
                                                <?php } ?>
                                            <tr>
                                                <th>Type of Writing Service</th>
                                                <td><?php
                                                    $query = "select * from products where id=".$row_meta['writing_service']."";
                                                    $result = mysqli_query($con,$query); 
                                                    $row = mysqli_fetch_array($result);
                                                    echo $row['namee'];?>
                                                </td>
                                            </tr>

                                            <tr>
                                                <th>Type of Help Require*</th>
                                                <td><?php
                                                    $query = "select * from products where id=".$row_meta['help_require']."";
                                                    //echo $query;
                                                    $result = mysqli_query($con,$query); 
                                                    $row = mysqli_fetch_array($result);
                                                    ?>
                                                <?php echo $row['namee'];?></td>
                                            </tr>
                                            <tr>
                                                <th>Topic Category</th>
                                                <td><?php
                                                    $query = "select * from products where id=".$row_meta['topic']."";
                                                    //echo $query;
                                                    $result = mysqli_query($con,$query); 
                                                    $row = mysqli_fetch_array($result);

                                                    ?>
                                                <?php echo $row['namee'];?></td>
                                            </tr>
                                            <tr>
                                                <th># of sources Refrences</th>
                                                <td><?php echo $row_meta['sources_ref']?></td>
                                            </tr>
                                            <tr>
                                                <th># of Presentation Slides</th>
                                                <td><?php
                                                    $query = "select * from products where id=".$row_meta['pre_slide']."";
                                                    //echo $query;
                                                    $result = mysqli_query($con,$query); 
                                                    $row = mysqli_fetch_array($result);
                                                    ?>
                                                <?php echo $row['namee'];?></td>
                                            </tr>
                                            <tr>
                                                <th>Software Service</th> 
                                                <td><?php
                                                    $query = "select * from products where id=".$row_meta['soft_service']."";
                                                    //echo $query;
                                                    $result = mysqli_query($con,$query); 
                                                    $row = mysqli_fetch_array($result);
                                                    ?>
                                                <?php echo $row['namee'];?></td>
                                                
                                            </tr>
                                            <tr>
                                                <th>Writing Style of citation</th>
                                                <td><?php
                                                    $query = "select * from products where id=".$row_meta['writing_style']."";
                                                    //echo $query;
                                                    $result = mysqli_query($con,$query); 
                                                    $row = mysqli_fetch_array($result);
                                                    ?>
                                                <?php echo $row['namee'];?></td>
                                            </tr>
                                            <tr>
                                                <th>Preferred Language Level</th>
                                                <td><?php
                                                    $query = "select * from products where id=".$row_meta['language_style']."";
                                                    //echo $query;
                                                    $result = mysqli_query($con,$query); 
                                                    $row = mysqli_fetch_array($result);
                                                    ?>
                                                <?php echo $row['namee'];?></td>
                                            </tr>
                                            <tr>
                                                <th>Required No. of page / words</th>
                                                <td><?php echo $row_meta['page_words'] .'&nbsp;'. $row_meta['farmaish'];?></td>
                                            </tr>
                                            <tr>
                                                <th>Line Spacing</th>
                                                <td><?php
                                                    $query = "select * from products where id=".$row_meta['line_space']."";
                                                    //echo $query;
                                                    $result = mysqli_query($con,$query); 
                                                    $row = mysqli_fetch_array($result);

                                                    ?>
                                                <?php echo $row['namee'];?></td>
                                            </tr>
                                            <tr>
                                                <th>Education Level</th>
                                                <td><?php
                                                    $query = "select * from products where id=".$row_meta['edu_level']."";
                                                    //echo $query;
                                                    $result = mysqli_query($con,$query); 
                                                    $row = mysqli_fetch_array($result);
                                                    ?>
                                                <?php echo $row['namee'];?></td>
                                            </tr>
                                            <tr>
                                                <th>Paper Standard</th>
                                                <td><?php
                                                    $query = "select * from products where id=".$row_meta['paper_stnd']."";
                                                    //echo $query;
                                                    $result = mysqli_query($con,$query); 
                                                    $row = mysqli_fetch_array($result);
                                                    ?>
                                                <?php echo $row['namee'];?></td>
                                            </tr>
                                            <tr>
                                                <th>Deadline</th>
                                                <td><?php
                                                    $query = "select * from products where id=".$row_meta['deadline']."";
                                                    //echo $query;
                                                    $result = mysqli_query($con,$query); 
                                                    $row = mysqli_fetch_array($result);
                                                    ?>
                                                <?php echo $row['namee'];?></td>
                                            </tr>
                                            <tr>
                                                <th>Your Topic</th>
                                                <td><?php echo $row_meta['your_topic']?></td>
                                            </tr>
                                            <tr>
                                                <th>Detail Instructions</th>
                                                <td><?php echo $row_meta['detail_instructions']?></td>
                                            </tr>
                                            <tr>
                                                <th>Payment Method <span class="text-danger"><?php echo $row_meta['payment'];?></span></th>
                                                <th>Referred By: <span class="text-danger"><?php echo $row_meta['referred'];?></span></th>

                                            </tr>
                                            <tr>
                                                <th>Payment Status <span class="text-danger"><?php echo $row_meta['paidStatuss'];?></span></th>
                                                <th> Writer Status <span class="text-danger"><?php echo $row_meta['writerStatus'];?> </span></th>
                                            </tr>
                                            <tr>
                                                <th>Order Status <span class="text-danger"><?php echo $row_meta['statuss'];?> </span></th>
                                                <th>Order Date <span class="text-danger"><?php echo $row_meta['order_date'];?></span></th>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <!-- panel start --><a href="editprice.php?id=<?php echo $row_meta['id'];?>">EDIT</a> &nbsp; <a href="editfinalamount.php?id=<?php echo $row_meta['id'];?>">EDIT Final Amount</a>
                                    <div class="panel panel-success">
                                        <div class="panel-heading text-center">
                                            <h3>TOTAL: <?php echo $row_meta['currency'];?> <?php echo number_format($row_meta['price'],0)?></h3>
                                            <h3>
                                                Discount:<?php
                                                $query = "select * from coupon WHERE code='".$row_meta['dCode'] ."'";
                                                $result = mysqli_query($con,$query); 
                                                $row = mysqli_fetch_array($result);
                                                if ($row['typee']=="1"){
                                                    $dabbr="%";
                                                }else{
                                                    $dabbr=$row_meta['currency'];;
                                                }
                                            echo $row_meta['discount'] .' '.$dabbr.' (Code Used: '. $row_meta['dCode'] .')';?></h3>
                                            <h3>Grand Total: <?php echo $row_meta['currency'];?> <?php echo number_format($row_meta['gamount'],0);?></h3>
                                         <?php
                                         $query3 = "select * from affiliate where orderID=".$_GET['id']."";
	$result3 = mysqli_query($con,$query3); 
	$rec_found3 = mysqli_num_rows($result3);
	if ($rec_found3>0){
		$row3 = mysqli_fetch_array($result3);
										 ?>   
                                            
                                            <h3>Redeemed Afiiliate Point: <?php echo $row_meta['currency'];?> <?php echo number_format($row3['points'],0);?></h3>

<h3>Final Amount: <?php echo $row_meta['currency'];?> <?php echo number_format($row3['balanceAmount'],0);?></h3>
<?php } ?>
                                        </div></div>
                                    <!-- panel end -->
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <?php include('footer.php'); ?>

        </div>
    </div>
</body>
<?php include('script.php'); ?>
</body>
</html>
