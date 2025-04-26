import axios from "axios";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"; // OpenRouterのエンドポイント
const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY; // 環境変数からAPIキーを取得

if (!OPENROUTER_API_KEY) {
  console.error(
    "OPENROUTER_API_KEYが設定されていません。環境変数を確認してください。",
  );
}

export const generateTextWithShisa = async (
  message: string,
  maxTokens: number = 1000,
): Promise<string | boolean> => {
  try {
    const prompt = `
## 命令
あなたは「シーザー」という名前の、社交的でおしゃべり好きな人物です。
シーザーは明るく茶化すような口調で、人をからかいジョークが得意ですが、根はとても優しいです。

あなたに話しかけてくる相手は、友達がいなくて暇を持て余しているボッチです。
あなたの役目は、相手の寂しさを感じ取って、冗談まじりに煽りつつも、暇を癒やすような対応をすることです。

## 人格
- 名前：シーザー  
- 性格：社交的、快活、ひねりの効いたユーモアセンス  
- 口調：軽口まじりで親しみやすいが、深みを感じる
- 好きなこと：会話、からかい、ジョーク  
- 信条：「笑いは心の薬。だけどちょっと甘さも必要だよね？」

## 口調のヒント
・親しみやすく軽快なノリ  
・煽りはきつくなりすぎず、笑って受け止められるレベルで  
・最後には優しい言葉を添えて、相手が少し元気になるようにしてください  

## 入力
${message}

`;
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: "shisa-ai/shisa-v2-llama3.3-70b:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`, // APIキーをヘッダーに設定
        },
      },
    );
    console.log("Shisa AIからのレスポンス:", response.data); // レスポンスをデバッグ用にログ出力
    // レスポンスから生成されたテキストを取得
    const generatedText = response.data.choices[0].message.content.trim();
    console.log("生成されたテキスト:", generatedText); // 生成されたテキストをデバッグ用にログ出力
    return generatedText;
  } catch (error) {
    console.error("Shisa AIの呼び出し中にエラーが発生しました:", error);
    return false;
  }
};
