<?php include('head1.php');
$controls=new htmlControl;

//$imgName = $_GET['imgName'];
//$imgName1 = $_GET['imgName1'];
if (isset($_POST['Submit2'])){
    print_r($_POST);

    $content = $_POST['content'];
    $query=mysqli_query("insert into menu (`link`) values ('".$content."'')");
}
?>
<link href="css/plugins/summernote/summernote.css" rel="stylesheet">
<link href="css/plugins/summernote/summernote-bs3.css" rel="stylesheet">
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('manage writers');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="tabs-container">
                            <ul class="nav nav-tabs">
                                <li class="active"><a data-toggle="tab" href="#tab-1"> Page Detail</a></li>
                                <li class=""><a data-toggle="tab" href="#tab-2"> Title & Meta Tags</a></li>
                            </ul>
                            <form action="" method="post" enctype="multipart/form-data" id="postForm" onsubmit="return postForm()">
                            <div class="tab-content">


                                <div class="ibox-content no-padding">
                                    <textarea style="display:none;" name="content"></textarea>
                                    <div class="summernote" id="summernote">
                                        <h3>Lorem Ipsum is simply</h3>
                                        dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industry's</strong> standard dummy text ever since the 1500s

                                        </ul>
                                    </div>

                                </div>


                            </div>      


                        </div>
                    </div>



                </div>
            </div><input name="Submit2" type="submit" class="btn btn-block btn-outline btn-success" value="Update" /></form>
        </div>
    </div>
    </div>
    <?php include('footer.php'); ?>

    </div>
    </div>
</body>


<?php include('script.php'); ?>    
<!-- SUMMERNOTE -->
<script src="js/plugins/summernote/summernote.min.js"></script>

<script>
    $(document).ready(function(){

        $('.summernote').summernote();

    });
    function postForm() {

        $('textarea[name="content"]').html($('#summernote').code());
    }
</script>

</body>
</html>
