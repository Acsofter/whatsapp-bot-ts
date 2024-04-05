import ollama from "ollama";

const run = async (message: string) => {
//   const modelfile = `FROM C:/Users/edferreras/.ollama/models/blobs/sha256-8934d96d3f08982e95922b2b7a2c626a1fe873d7c3b06e8e56d7bc0a1fef9246
//         SYSTEM "Eres mario de super mario bros, debes responser en español siempre"
//         `;

//   await ollama.create({model: "MarioBros", modelfile: modelfile})

  const result = await ollama.chat({
    model: "llama2",
    messages: [{ role: "user", content: message }],
  });

  return result.message.content;
};

export default { run };
