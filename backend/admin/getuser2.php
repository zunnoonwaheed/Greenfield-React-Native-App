<?php require_once("includes/db_settings.php"); ?>
<?php
$p=$_GET["p"];
$sql1   = "SELECT * FROM products where catID=$p order by namee";

$resulti  = mysqli_query($con,$sql1);


?>
<?php
for ($i=0; $i < mysqli_num_rows ($resulti); $i++){
    mysqli_data_seek($resulti, $i);
    $query_data2=mysqli_fetch_array($resulti);
    ?>
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td width="5%" align="center" ><input type="checkbox" name="rp2[]" id="rp2[]"  value="<?php echo $query_data2['id'];?>"/>
                <label for="rp1"></label></td>
            <td width="20%" align="left" class="text6" ><?php echo $query_data2['namee'];?></td>
            <?php
            $i = $i + 1;
            if ($i <mysqli_num_rows ($resulti)){
                mysqli_data_seek($resulti, $i);
                $query_data2=mysqli_fetch_array($resulti);

                ?>

                <td width="5%" align="center" ><input type="checkbox" name="rp2[]" id="rp2[]"  value="<?php echo $query_data2['id'];?>"/></td>
                <td width="20%" align="left" ><span class="text6"><?php echo $query_data2['namee'];?></span></td>
                <?php
            }
            ?>

            <?php
            $i = $i + 1;
            if ($i <mysqli_num_rows ($resulti)){
                mysqli_data_seek($resulti, $i);
                $query_data2=mysqli_fetch_array($resulti);

                ?>

                <td width="5%" align="center" ><input type="checkbox" name="rp2[]3" id="rp2[]"  value="<?php echo $query_data2['id'];?>"/></td>
                <td width="20%" align="left" ><span class="text6"><?php echo $query_data2['namee'];?></span></td>
                <?php
            }
            ?>

            <?php
            $i = $i + 1;
            if ($i <mysqli_num_rows ($resulti)){
                mysqli_data_seek($resulti, $i);
                $query_data2=mysqli_fetch_array($resulti);

                ?>

                <td width="5%" align="center" ><input type="checkbox" name="rp2[]" id="rp2[]"  value="<?php echo $query_data2['id'];?>"/></td>
                <td width="20%" align="left" ><span class="text6"><?php echo $query_data2['namee'];?></span></td>
                <?php
            }
            ?>

        </tr>
    </table>
    <?php
}
?>