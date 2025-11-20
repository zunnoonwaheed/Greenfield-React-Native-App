<?php include('head.php');
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
           
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">

                            <div class="ibox-content">
                                <div class="">

                                </div>

                                <div class="table-responsive">
                                    <table class="table table-striped table-bordered table-hover dataTables-example" >
                                        <thead>
                                            <tr>
                                                <th>Enquiry ID</th>
                                                 <th>Full Name</th>
                                                <th>Email</th>
                                                <th>Contact For</th>
                                                <th>Contact No.</th>
                                                <th>Message</th>
                                               
                                                <th>Options</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
											$query = "UPDATE contact SET statuss='yes'";	
							//echo $query . "<br/>";														
							if (!mysqli_query($con,$query))
							{
									die('Error: ' . mysqli_error());
							}
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
                                            $sql = "select * from contact order by id DESC LIMIT $rec, $limit_pages";
                                            $resultp  = mysqli_query($con,$sql);
                                            $sql2 = "select * from contact order by id DESC";

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
                                                        <td>
                                                            ABC - <?php echo $row['id']; ?>
                                                        </td>
                                                          <td>
                                                            <?php echo $row['full_name']; ?>
                                                        </td>
                                                        <td>
                                                            <?php echo $row['email2'];?>
                                                        </td>
                                                        <td>
                                                            <?php echo $row['contact_for'];?>
                                                        </td>
                                                        <td>
                                                            <?php echo $row['contact_phone'];?>
                                                        </td>
                                                         <td>
                                                            <?php echo $row['cmnt'];?>
                                                        </td>
                                                        



                                                        <td class="center">
                                                            <div class="btn-group">
                                                                <div style="border-radius:50%; width=30%; height=30px; display:inline;">
                                                               
                                                                    
                                                                </div>


                                                                <div style="border-radius:50%; width=30%; height=30px; display:inline;">
                                                                    <a class="btn btn-danger btn-circle" href="delenq.php?id=<?php echo $row['id'];?>" onclick="return confirm('ALERT! \nAre you sure you want to delete this Enquiry')"><i class="fa fa-times"></i></a>
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
                                                                    @$page_pagination .= '<li class="footable-page-arrow"><a data-page="prev" href="sampleOrder.php?page='.($page-1).'"><</a></li>'; 
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

                                                                        $page_pagination.= '<li class="footable-page"><a data-page="1" href="enquiries.php?page='.$i.'">'.$i.'</a></li>'; 
                                                                }

                                                                if ($page < $total_page) { 

                                                                    @$page_pagination .= '<li class="footable-page-arrow"><a data-page="next" href="enquiries.php?page='.($page+1).'">></a></li> '; 


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
