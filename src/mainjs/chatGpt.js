const { Configuration, OpenAIApi } = require("openai");

(async () => {
  const configuration = new Configuration({
    // apiKey: "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",
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
  
  const chapGPT = async (prompt) => {
    const response = await openai.createChatCompletion({
      // model: "text-ada-001",
      model: "gpt-3.5-turbo",
      // model: "gpt-3.5-turbo-0301",
      messages: [{ role: "user", content: prompt }],
    });
    // const response = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   // model: "gpt-3.5-turbo",
    //   messages: [{ role: "user", content: prompt }],
    // });
    console.log(response["data"]["choices"][0]["message"]);
  };
  
  await chapGPT("一个细胞核一定只有一个细胞核和一个细胞仁");
  await chapGPT("一句话概括易经");
  await chapGPT("你的版本号是多少");

})()
