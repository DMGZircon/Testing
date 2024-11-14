<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Database connection details
$servername = "localhost";
$username = "Codesmiths1!";
$password = "your_mysql_password";
$dbname = "u302989566_sentiment";

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the JSON data from the POST request
$input = json_decode(file_get_contents("php://input"), true);

// Extract data
$postId = $input['postId'];
$date = $input['date'];
$overallScore = $input['overallScore'];
$overallSentiment = $input['overallSentiment'];
$topPositiveWords = implode(',', $input['topPositiveWords']);
$topNegativeWords = implode(',', $input['topNegativeWords']);
$scoreMagnitude = $input['scoreMagnitude'];

// SQL query to insert data
$sql = "INSERT INTO sentiment_results (postId, date, overallScore, overallSentiment, topPositiveWords, topNegativeWords, scoreMagnitude)
        VALUES ('$postId', '$date', $overallScore, '$overallSentiment', '$topPositiveWords', '$topNegativeWords', $scoreMagnitude)";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Data saved successfully"]);
} else {
    echo json_encode(["error" => "Error: " . $conn->error]);
}

// Close the connection
$conn->close();
?>
