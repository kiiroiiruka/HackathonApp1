
const imageAplit=(url:string)=>{
    //const url = "https://res.cloudinary.com/dy1ip2xgb/image/upload/v1745647812/media/pictures/8D7F5F5A-F36D-4AE3-9155-F1BD9FF71822.png.png";

    // 1. バージョン以降だけ切り出す
    const urlParts = url.split('/'); 
    const versionIndex = urlParts.findIndex(part => part.startsWith('upload'));
    const publicIdWithExt = urlParts.slice(versionIndex + 2).join('/');

    // 2. 拡張子除去
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');

    return publicId;
    // 出力結果 → "media/pictures/8D7F5F5A-F36D-4AE3-9155-F1BD9FF71822.png"
}
import crypto from 'crypto-js'; // crypto-jsをnpmで入れてね

const cloudName = "dy1ip2xgb";
const apiKey = "179589847187447";
const apiSecret = "ldgPpbMUFtwM02IaLaARhNY2Hks"; // ⚠️ここにSECRET書くから注意
const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

export async function deleteImage(url: string) {
    const publicId = url; // 取得したURIからpublic_idを抽出 
    console.log("これが削除に活用するpublicIdです",publicId);
    const timestamp = Math.floor(Date.now() / 1000);

    // 1. シグネチャ（署名）を作る
    const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.SHA1(signatureString).toString();

    // 2. FormDataを作る
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', apiKey);
    formData.append('signature', signature);
    console.log("end",endpoint);
    console.log("data",formData);
    // 3. 削除リクエストを送信
    const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    console.log(result);
}
