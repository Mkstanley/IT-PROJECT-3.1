<?php
include 'db.php';

$role = $_POST['role'];
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$sql = "INSERT INTO users(role, fullname, email, phone, password)
VALUES('$role','$name','$email','$phone','$password')";

if(mysqli_query($conn,$sql)){
    header("Location: ../login.html");
}
else{
    echo "Registration failed: " . mysqli_error($conn);
}
    

?>