import crypto from "crypto-js"; // crypto-jsをnpmで入れてね

const cloudName = "dy1ip2xgb";
const apiKey = "179589847187447";
const apiSecret = "ldgPpbMUFtwM02IaLaARhNY2Hks"; // ⚠️ここにSECRET書くから注意
const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

export async function deleteImage(url: string) {
  const publicId = url; // 取得したURIからpublic_idを抽出
  console.log("これが削除に活用するpublicIdです", publicId);
  const timestamp = Math.floor(Date.now() / 1000);

  // 1. シグネチャ（署名）を作る
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.SHA1(signatureString).toString();

  // 2. FormDataを作る
  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("timestamp", timestamp.toString());
  formData.append("api_key", apiKey);
  formData.append("signature", signature);
  console.log("end", endpoint);
  console.log("data", formData);
  // 3. 削除リクエストを送信
  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  console.log(result);
}
