const validator = new JustValidate("#formAddAds");

validator
  .addField("#name", [
    {
      rule: "required",
      errorMessage: "Nome Obrigatório!",
    },
  ])
  .addField("#link", [
    {
      validator: (value) => {
        const res = value.includes("http");
        return res;
      },

      errorMessage: "Link errado!. Deve conter 'https://www'",
    },
  ])
  .addField("#beginTime", [
    {
      rule: "required",
      errorMessage: "Data inicial Obrigatória!",
    },
  ])
  .addField("#finalTime", [
    {
      rule: "required",
      errorMessage: "Data Final Obrigatória!",
    },
  ])
  .onSuccess((event) => {
    document.getElementById("formAddAds").submit();
  });
