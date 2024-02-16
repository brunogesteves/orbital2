const validator = new JustValidate("#async_form");

validator
  .addField("#email", [
    {
      rule: "required",
      errorMessage: "Email Obrigatório!",
    },
    {
      rule: "email",
      errorMessage: "Não é um Email válido",
    },
  ])
  .addField("#password", [
    {
      rule: "required",
      errorMessage: "Senha Obrigatório!",
    },
  ])
  .onSuccess((event) => {
    document.getElementById("async_form").submit();
  });
