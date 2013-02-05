<?php
  if(isset($_POST['fields'])){
    $fields = $_POST['fields'];
    $nodes = Array();
    
    chdir("/var/www/html");
    require_once './includes/bootstrap.inc';
    define('DRUPAL_ROOT','/var/www/html');
    drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);
    
    $fields = json_decode($fields);
    for($i = 0; $i < sizeof($fields); $i++){
      $nodes[$i] = json_encode(node_load($fields[$i]));
    }
    //$node = node_load($nid);
    print json_encode($nodes);
    
    //print(json_encode($node));
  }
?>