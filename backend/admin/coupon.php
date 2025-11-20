<?php include('head.php');
$controls=new htmlControl;
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('manage coupon');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <a href="insertcoupon.php" class="btn btn-primary ">Insert New Coupon Code</a>
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

                                                <th>Coupon Code</th>
                                                <th>Currency</th>
                                                <th>Discount</th>
                                                <th>Duration</th>
                                                <th>Status</th>
                                                <th>Option</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                            $s=1;
                                            $rowsPerPage = 1;
                                            $limit_pages=20;
                                            $page = (isset($_GET['page']) && preg_match("/\d/", $_GET['page']) ) ? $_GET['page'] : 0;
                                            if(isset($_GET['page']))
                                            {
                                                $page = mysqli_escape_string($_GET['page']);
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
                                            $sql = "select * from coupon LIMIT $rec, $limit_pages";
                                            $resultp  = mysqli_query($con,$sql);
                                            $sql2 = "select * from coupon";

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
                                                    <td><?php echo $row['code'];?></td>
                                                    <td><?php echo $row['currency'];?></td>
                                                    <td><?php echo $row['price'];?> <?php if ($row['typee']==1){?>%<?php }else{ echo "/="; } ?></td>
                                                    <td><?php if ($row['duration']=="one"){ echo "One Time"; }elseif($row['duration']=="life"){ echo "Lifetime"; }?></td>
                                                    <td>
                                                        <form method="post"  action="status5.php">
                                                            <input type="hidden" value="<?php echo $row['id'];?>" name="id" id="id" />
                                                            <select name="statuss">
                                                                <option value="assign" <?php if ($row['statuss']=="assign"){?> selected="selected" <?php } ?>>Assign</option>
                                                                <option value="Unassigned" <?php if ($row['statuss']=="Unassigned"){?> selected="selected" <?php } ?>>Unassigned</option>
                                                            </select>
                                                            <input name="Change Status" type="submit" class="text6" id="Change Status" value="Change Status" />
                                                        </form>
                                                    </td>
                                                    <td class="center">
                                                        <div class="btn-group">
                                                            <div style="border-radius:50%; width=30%; height=30px; display:inline;">
                                                                <a class="btn btn-primary btn-circle" href="editcoupon.php?id=<?php echo $row['id'];?>"><i class="fa fa-edit"></i></a>
                                                            </div>

                                                            <div style="border-radius:50%; width=30%; height=30px; display:inline;">
                                                                <a class="btn btn-danger btn-circle" href="delcoupon.php?id=<?php echo $row['id'];?>" onclick="return confirm('ALERT! \nAre you sure you want to delete this Coupon')"><i class="fa fa-times"></i></a>
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
                                                                @$page_pagination .= '<li class="footable-page-arrow"><a data-page="prev" href="coupon.php?page='.($page-1).'"><</a></li>'; 
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

                                                                    $page_pagination.= '<li class="footable-page"><a data-page="1" href="coupon.php?page='.$i.'">'.$i.'</a></li>'; 
                                                            }

                                                            if ($page < $total_page) { 

                                                                @$page_pagination .= '<li class="footable-page-arrow"><a data-page="next" href="coupon.php?page='.($page+1).'">></a></li> '; 


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
<!-- Page-Level Scripts -->
<script>
    $(document).ready(function(){
        $('.dataTables-example').DataTable({
            dom: '<"html5buttons"B>lTfgitp',

            customize: function (win){
                $(win.document.body).addClass('white-bg');
                $(win.document.body).css('font-size', '10px');

                $(win.document.body).find('table')
                .addClass('compact')
                .css('font-size', 'inherit');
            }
            }
            ]

        });

        /* Init DataTables */
        var oTable = $('#editable').DataTable();

        /* Apply the jEditable handlers to the table */
        oTable.$('td').editable( 'http://webapplayers.com/example_ajax.php', {
            "callback": function( sValue, y ) {
                var aPos = oTable.fnGetPosition( this );
                oTable.fnUpdate( sValue, aPos[0], aPos[1] );
            },
            "submitdata": function ( value, settings ) {
                return {
                    "row_id": this.parentNode.getAttribute('id'),
                    "column": oTable.fnGetPosition( this )[2]
                };
            },

            "width": "90%",
            "height": "100%"
        } );


    });

    function fnClickAddRow() {
        $('#editable').dataTable().fnAddData( [
            "Custom row",
            "New row",
            "New row",
            "New row",
            "New row" ] );

    }
</script>

</body>


<!-- Mirrored from webapplayers.com/inspinia_admin-v2.5/table_data_tables.html by HTTrack Website Copier/3.x [XR&CO'2014], Thu, 26 May 2016 13:15:49 GMT -->
</html>
