
<!-- Mainly scripts -->
    <script src="js/jquery-2.1.1.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/plugins/metisMenu/jquery.metisMenu.js"></script>
    <script src="js/plugins/slimscroll/jquery.slimscroll.min.js"></script>
<script src="js/plugins/dataTables/datatables.min.js"></script>
    <!-- Flot -->
    <!-- <script src="js/plugins/flot/jquery.flot.js"></script>
    <script src="js/plugins/flot/jquery.flot.tooltip.min.js"></script>
    <script src="js/plugins/flot/jquery.flot.spline.js"></script>
    <script src="js/plugins/flot/jquery.flot.resize.js"></script>
    <script src="js/plugins/flot/jquery.flot.pie.js"></script>
    <script src="js/plugins/flot/jquery.flot.symbol.js"></script>
    <script src="js/plugins/flot/jquery.flot.time.js"></script> -->
  
    <!-- Custom and plugin javascript -->
    <script src="js/inspinia.js"></script>
    <script src="js/plugins/pace/pace.min.js"></script>

    <!-- Sparkline -->
    <script src="js/plugins/sparkline/jquery.sparkline.min.js"></script>
    </script>
   
<script>
document.addEventListener("DOMContentLoaded", function() {

    const countEl = document.getElementById('new-orders-count');
    const audio = document.getElementById('new-order-sound');
    let soundInterval = null; // for repeating tone

    function playToneRepeatedly() {
        if (soundInterval) return; // already running
        soundInterval = setInterval(() => {
            if (parseInt(countEl.textContent) > 0) {
                audio.play();
            } else {
                clearInterval(soundInterval);
                soundInterval = null;
            }
        }, 2000); // every 2 seconds
    }

    function checkNewOrders() {
        fetch('check_new_orders.php')
        .then(response => response.json())
        .then(data => {
            if (!data.count) data.count = 0;

            countEl.textContent = data.count;
            if (parseInt(data.count) > 0) {
                countEl.classList.remove('d-none');
                playToneRepeatedly();
            } else {
                countEl.classList.add('d-none');
            }
        })
        .catch(err => console.error("Error fetching new orders:", err));
    }

    // Initial check
    checkNewOrders();

    // Check every 30 seconds
    setInterval(checkNewOrders, 30000);
});
</script>

   
