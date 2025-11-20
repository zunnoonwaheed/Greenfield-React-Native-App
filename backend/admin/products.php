<?php include('head.php');
$controls=new htmlControl;

$catID=$_REQUEST['catID'];
$mainID=$_REQUEST['mainID'];
$query_c = "select * from category where id=$catID";
$result_c = mysqli_query($con,$query_c); 
$rec_found_c = mysqli_fetch_array($result_c);
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection($rec_found_c['namee']);
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <?php if ($_GET['catID']!=48){ ?>
                                    <a class="btn btn-primary" href="insertproducts.php?mainID=<?php echo $_GET['mainID'];?>&catID=<?php echo $_GET['catID'];?>">INSERT <?php if ($_GET['mainID']==40){ echo "Help Require for Writing Services"; }elseif($_GET['mainID']==46){ echo "Paper standard for Education Level"; }elseif($_GET['mainID']==250){ echo "Deadline for Paper Standard"; }else{ echo $rec_found_c['namee']; }?></a>
                                <?php } ?>
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
                                        <thead>
                                            <tr>
                                                <th>S no</th>
                                                <th>ID</th>
                                                <th><?php if ($_GET['catID']!=48){ ?>Title<?php } else { echo "Number Of Pages"; } ?></th>
                                                <?php if($_GET['catID']!='40'  && $_GET['catID']!='46' &&  $_GET['catID']!='250'){ echo "<th>Price</th>"; }?>
                                                <th>Option</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                            $s=1;
                                            $rowsPerPage = 1;
                                            $limit_pages=15;
                                            $page = (isset($_GET['page']) && preg_match("/\d/", $_GET['page']) ) ? $_GET['page'] : 0;
                                            if(isset($_GET['page']))
                                            {
                                                $page = mysqli_escape_string($con,$_GET['page']);
                                            }

                                            if( $page == "") {
                                                $page = 1;
                                            }
                                            if($page == 0 || $page == 1) {
                                                $rec = 0;

                                            }
                                            else{
                                                $rec = ($page - 1) * $limit_pages ;

                                            }
                                            $sql = "select * from products where catID =$catID order by id ASC LIMIT $rec, $limit_pages";
                                            $resultp  = mysqli_query($con,$sql);
                                            $sql2 = "select * from products where catID =$catID order by id ASC";

                                            $result  = mysqli_query($con,$sql2);
                                            $res2 = mysqli_num_rows($result);

                                            $numofpages = ceil($res2/$rowsPerPage);
                                            $total_page=(ceil($res2/$limit_pages));

                                            $total_page=(ceil($res2/$limit_pages));
                                            ?>
                                            <?php
                                            for ($j=0; $j < mysqli_num_rows ($resultp); $j++){
                                                mysqli_data_seek($resultp, $j);
                                                $row=mysqli_fetch_array($resultp);
                                            ?>

                                                <tr>
                                                    <td><?php echo $s; ?></td>
                                                    <td><?php echo $row['id']; ?></td>
                                                        <td><?php echo $row['namee']; ?></td>
                                                        <?php if($_GET['catID']!='40'  && $_GET['catID']!='46' &&  $_GET['catID']!='250'){ ?>  
                                                            <td><?php echo $row['price'];?></td>
                                                        <?php } ?>
                                                        <td class="center">
                                                            <div class="btn-group">
                                                                <div style="border-radius:50%; width=30%; height=30px; display:inline;">
                                                                    <?
                                                                    if(($_GET['mainID']=='46') || ($_GET['mainID']=='7') || ($_GET['mainID']=='1')){ ?>

                                                                    <a class="btn btn-primary btn-circle" href="products.php?catID=<?php echo $row['id'];?>&mainID=<?php echo $row['catID'];?>"><i class="fa fa-eye"></i></a><?php }?>
                                                                </div>

                                                                <div style="border-radius:50%; width=30%; height=30px; display:inline;">
                                                                    <a class="btn btn-primary btn-circle" href="editproducts.php?id=<?php echo $row['id'];?>&catID=<?php echo $row['catID'];?>&mainID=<?php echo $_GET['mainID'];?>"><i class="fa fa-edit"></i></a>
                                                                </div>

                                                                <div style="border-radius:50%; width=30%; height=30px; display:inline;">
                                                                    <?php if ($_GET['catID']!=48){ ?>
                                                                        <a class="btn btn-danger btn-circle" href="delProducts.php?id=<?php echo $row['id'];?>&catID=<?php echo $row['catID'];?>&mainID=<?php echo $_GET['mainID'];?>" onclick="return confirm('ALERT! \nAre you sure you want to delete this Text Page')"><i class="fa fa-times"></i></a>
                                                                    <? }?>
                                                                </div>
                                                            </div>
                                                        </td>
                                                   
                                                </tr>
                                            <?php $s++; } ?>

                                        </tbody>
                                        <?php
                                            if ($total_page > 1) {



                                                $range =$numofpages; 
                                                $range_min = ($range % 2 == 0) ? ($range / 2) - 1 : ($range - 1) / 2; 
                                                $range_max = ($range % 2 == 0) ? $range_min + 1 : $range_min; 
                                                $page_min = $page- $range_min; 
                                                $page_max = $page+ $range_max; 

                                                $page_min = ($page_min < 1) ? 1 : $page_min; 
                                                $page_max = ($page_max < ($page_min + $range - 1)) ? $page_min + $range - 1 : $page_max; 
                                                if ($page_max > $total_page) { 
                                                    $page_min = ($page_min > 1) ? $total_page - $range + 1 : 1; 
                                                    $page_max = $total_page; 
                                                } 

                                                $page_min = ($page_min < 1) ? 1 : $page_min; 




                                                ?>
                                                <tfoot>
                                                    <tr>
                                                        <td colspan="5">
                                                            <ul class="pagination pull-right">
                                                                <?php
                                                                if ($page != 1) {
                                                                    @$page_pagination .= '<li class="footable-page-arrow"><a data-page="prev" href="products.php?catID='.($catID).'&mainID='.($mainID).'&page='.($page-1).'"><</a></li>'; 
                                                                }
                                                                if ($total_page>16){
                                                                    $ppp=$total_page-21;
                                                                    if (($_GET['page']>=16)&&($_GET['page']<=$ppp)){
                                                                        $page_min=$page-10;
                                                                        $page_max=$page+10;
                                                                    }
                                                                    if ($_GET['page']>$ppp){

                                                                        $page_max=$total_page; 
                                                                        $page_min=$page_max-25;
                                                                    }

                                                                    if ($_GET['page']<16){
                                                                        $page_max=23;
                                                                    }
                                                                    if ($page_min<1){
                                                                        $page_min=1;
                                                                    }
                                                                }
                                                                for ($i = $page_min;$i <= $page_max;$i++) {
                                                                    if ($i == $page) 
                                                                        @$page_pagination .= '<li class="footable-page active"><a data-page="0" href="#">'.$i.'</a></li>'; 
                                                                    else 

                                                                        $page_pagination.= '<li class="footable-page"><a data-page="1" href="products.php?catID='.($catID).'&mainID='.($mainID).'&page='.$i.'">'.$i.'</a></li>'; 
                                                                }

                                                                if ($page < $total_page) { 

                                                                    @$page_pagination .= '<li class="footable-page-arrow"><a data-page="next" href="products.php?catID='.($catID).'&mainID='.($mainID).'&page='.($page+1).'">></a></li> '; 


                                                                } 



                                                                echo $page_pagination;



                                                                ?>

                                                            </ul>
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                                <?php }  ?>
                                    </table>
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
