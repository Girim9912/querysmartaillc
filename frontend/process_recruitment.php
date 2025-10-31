<?php

// Check if the form was submitted using the POST method
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Retrieve and sanitize all the text input data
    $fullName = htmlspecialchars(trim($_POST['fullName']));
    $email = htmlspecialchars(trim($_POST['email']));
    $phone = htmlspecialchars(trim($_POST['phone']));
    $position = htmlspecialchars(trim($_POST['position']));
    $linkedin = htmlspecialchars(trim($_POST['linkedin']));
    $portfolio = htmlspecialchars(trim($_POST['portfolio']));
    $coverLetter = htmlspecialchars(trim($_POST['coverLetter']));
    $availability = htmlspecialchars(trim($_POST['availability']));
    $hearAboutUs = htmlspecialchars(trim($_POST['hearAboutUs']));

    // ... (rest of the script)
        // Handle the file upload
    $uploadDir = 'uploads/'; // A directory to store uploaded resumes
    // Create the upload directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $fileName = basename($_FILES['resume']['name']);
    $fileTmpPath = $_FILES['resume']['tmp_name'];
    $fileSize = $_FILES['resume']['size'];
    $fileError = $_FILES['resume']['error'];
    $fileType = $_FILES['resume']['type'];

    // Define allowed file types and max size
    $allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    $maxFileSize = 5 * 1024 * 1024; // 5MB

    if ($fileError === UPLOAD_ERR_OK) {
        if ($fileSize > $maxFileSize) {
            die("Error: Your file is too large.");
        }

        if (!in_array($fileType, $allowedFileTypes)) {
            die("Error: Only PDF, DOC, and DOCX files are allowed.");
        }

        // Generate a unique file name to avoid collisions
        $newFileName = uniqid('', true) . '.' . strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $destination = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $destination)) {
            // File was successfully moved
            // You can now proceed to process the rest of the form data
            // For example, you can store the file path ($destination) in a database
        } else {
            die("Error moving the uploaded file.");
        }
    } else {
        die("File upload error: " . $fileError);
    }
} else {
    // If the form was not submitted via POST, redirect the user
    header("Location: index.html");
    exit;
}

?>
