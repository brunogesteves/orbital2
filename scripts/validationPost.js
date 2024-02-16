const validatorAddPost = new JustValidate("#post");

validatorAddPost
  .addField("#title", [
    {
      rule: "required",
      errorMessage: "Obrigatório!",
    },
    {
      rule: "maxLength",
      value: 75,
      errorMessage: "Maxímo 75 caracteres",
    },
  ])

  .addField("#datetime", [
    {
      rule: "required",
      errorMessage: "Obrigatório!",
    },
  ])
  .addField("#section", [
    {
      rule: "required",
      errorMessage: "Obrigatório!",
    },
  ])

  .addField("#summary", [
    {
      rule: "required",
      errorMessage: "Conteúdo Obrigatório",
    },
  ])
  .onSuccess((event) => {
    event.currentTarget.submit();
  });
