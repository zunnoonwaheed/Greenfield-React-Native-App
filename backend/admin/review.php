<?php
include("includes/db_settings.php");
include('head.php');
$controls=new htmlControl;
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('manage category');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-content">


                                <div class="table-responsive">
                                    <table class="table table-striped table-bordered table-hover dataTables-example" >
                                        <thead>
                                            <tr>
                                                <th>S no</th>
                                                <th>Category Name</th>
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
                                            $sql = "select * from category where catID=0 LIMIT $rec, $limit_pages";
                                            $resultp  = mysqli_query($con,$sql);
                                            $sql2 = "select * from category where catID=0";

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
                                                    <td><?php echo $row['namee'];?></td>
                                                    <td class="center">
                                                        <button type="button" class="btn btn-w-m btn-primary"
                                                            onclick="location.href='products.php?catID=<?php echo $row['id'];?>&mainID=<?php echo $s;?>';">VIEW  Items</a></button>
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
                                                                @$page_pagination .= '<li class="footable-page-arrow"><a data-page="prev" href="review.php?page='.($page-1).'"><</a></li>'; 
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

                                                                    $page_pagination.= '<li class="footable-page"><a data-page="1" href="review.php?page='.$i.'">'.$i.'</a></li>'; 
                                                            }

                                                            if ($page < $total_page) { 

                                                                @$page_pagination .= '<li class="footable-page-arrow"><a data-page="next" href="review.php?page='.($page+1).'">></a></li> '; 


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
