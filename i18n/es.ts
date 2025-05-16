export default {
  common: {
    welcome: "Bienvenido/a",
    loading: "Cargando...",
    error: "Ocurrió un error",
    version: "Versión",
  },
  auth: {
    screenTitle: "Inicio de sesión - clientes",
    toast: {
      text1: "Error de conexión",
      text2: "No se pudo conectar al servidor",
    },
    login: {
      username: "Usuario",
      password: "Contraseña",
      button: "Iniciar sesión",
      signup: "Regístrate",
      toast: {
        text1: "Error de inicio de sesión",
        text2: "Por favor, verifica tus credenciales",
      },
      zod: {
        email: "Correo electrónico inválido",
        password: "La contraseña es obligatoria",
      },
    },
    signup: {
      screenTitle: "Registro",
      title: "Comienza ahora",
      subTitle: "Registrarse es fácil y rápido",
      documentLabel: "Tipo de documento",
      documentPlaceholder: "Selecciona el tipo de documento",
      documentTypes: {
        CC: "Cédula de Ciudadanía",
        NIT: "NIT",
      },
      idNumberPlaceholder: "Número de identificación",
      namePlaceholder: "Nombre",
      lastNamePlaceholder: "Apellido",
      phonePlaceholder: "Teléfono",
      addressPlaceholder: "Dirección",
      loginDataTitle: "Datos de acceso",
      emailPlaceholder: "Correo electrónico",
      passwordPlaceholder: "Contraseña",
      termsAndConditions:
        "Acepto los términos y condiciones y la política de privacidad",
      allowContact:
        "Autorizo a CCP a enviarme información a través de WhatsApp, correo electrónico y SMS",
      button: "Registrarme",
      toast: {
        success: {
          text1: "Registro exitoso",
          text2: "Ahora puedes iniciar sesión",
        },
        error: {
          register: {
            text1: "Error de registro",
            text2: "Por favor, verifica tus datos",
          },
          storage: {
            text1: "Error de almacenamiento",
            text2: "No se pudo guardar la información",
          },
        },
      },
      zod: {
        documentType: "El tipo de documento es obligatorio",
        idNumber: "El número de identificación es obligatorio",
        name: "El nombre es obligatorio",
        lastName: "El apellido es obligatorio",
        phone: "El teléfono es obligatorio",
        address: "La dirección es obligatoria",
        email: "El correo electrónico es obligatorio",
        password: "La contraseña es obligatoria",
        acceptTerms:
          "Debes aceptar los términos y condiciones y la política de privacidad",
      },
    },
  },
  menu: {
    createTitle: "Crear",
    consultTitle: "Consultar",
    createButton: "Crear pedido",
    getDeliveriesButton: "Entregas",
  },
  createOrder: {
    screenTitle: "Crear pedido",
    subTitle: "Selecciona los productos que deseas pedir",
    noProducts: "No hay productos disponibles",
    totalLabel: "Total",
    button: "Crear pedido",
    toast: {
      success: {
        text1: "Pedido creado exitosamente",
        text2: "Ahora puedes ver el estado de tu entrega",
      },
      error: {
        text1: "Error al crear el pedido",
        text2: "Por favor, verifica tus datos",
      },
    },
  },
};
