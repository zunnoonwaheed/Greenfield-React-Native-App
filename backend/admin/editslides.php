<?php include('head.php');
$controls=new htmlControl;
$id = $_GET['id'];
$slide=mysqli_query("select * from slider where id =".$id);
$slide_q=mysqli_fetch_array($slide);
if (isset($_POST['update_slide'])){
    $query = "UPDATE slider 
    SET text_initial='".$_POST['text_initial']."',link='".$_POST['link']."',text_final='".$_POST['text_final']."' where id=".$id;
    if (!mysqli_query($con,$query))
    {
        die('Error: ' . mysqli_error($con));
    }
    else{
        $succes=1;
        //header('location:slides.php');
    }
    if(($_FILES['img']['size'])>0){
        $targetfolder = "../img/";
        $targetfolder = $targetfolder . basename($_FILES['img']['name']) ;
        $fileData = pathinfo($_FILES["img"]['name']);
        if(move_uploaded_file($_FILES['img']['tmp_name'], $targetfolder)) { 
            $query = "UPDATE slider 
            SET image='img/".$fileData['basename']."' where id=".$id;
            if (mysqli_query($con,$query))
            {
                $succes=1;
            }


        }

    }
    if ($succes==1)
    {
        echo "<script type=\"text/javascript\">alert('Record has been updated');</script>";
        echo "<script type='text/javascript'>window.location.href='slides.php';</script>";

    }

}
?>
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('manage slides');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="tabs-container">
                            <ul class="nav nav-tabs">
                                <li class="active"><a data-toggle="tab" href="#tab-1"> Edit Image</a></li>
                            </ul>
                            <form action="" method="post" enctype="multipart/form-data">
                            <div class="tab-content">

                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
                                        <fieldset class="form-horizontal">

                                            <div class="form-group"><label class="col-sm-2 control-label">Title</label>
                                                <div class="col-sm-10">
                                                    <input name="text_initial" type="text" id="title" value="<?php echo $slide_q['text_initial'];?>" class="form-control" ></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Link</label>
                                                <div class="col-sm-10">
                                                    <input name="link" type="text" id="keyword" value="<?php echo $slide_q['link'];?>"
                                                        class="form-control" ></div>
                                            </div>





                                            <div class="form-group"><label class="col-sm-2 control-label">Image</label>
                                                <div class="col-sm-10">
                                                    <input name="img" type="file" class="btn btn-primary" id="img"value="<?php echo $slide_q['image']; ?>"/></div>
                                            </div>

                                            <div class="form-group"><label class="col-sm-2 control-label">Content</label>
                                                <div class="col-sm-10">
                                                    <div class="summernote">
                                                        <textarea name="text_final"  class="form-control" cols="65" rows="4">
                                                            <?php echo $slide_q['text_final'];?>
                                                        </textarea>

                                                    </div>
                                                </div>
                                            </div>



                                        </fieldset>

                                    </div>
                                </div>



                            </div>
                        </div><input name="update_slide" type="submit" class="btn btn-block btn-outline btn-success" value="Update" /></form>
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
