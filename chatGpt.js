const { Configuration, OpenAIApi } = require("openai");

(async () => {
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
  
  const chapGPT = async (prompt) => {
    const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    });
    console.log(response["data"]["choices"][0]["message"]["content"]);
  };
  
  chapGPT("一个细胞核一定只有一个细胞核和一个细胞仁");

})()
