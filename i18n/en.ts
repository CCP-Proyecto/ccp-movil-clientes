export default {
  common: {
    welcome: "Welcome",
    loading: "Loading...",
    error: "An error occurred",
    version: "Version",
  },
  auth: {
    screenTitle: "Login - clients",
    toast: {
      text1: "Connection error",
      text2: "Could not connect to the server",
    },
    login: {
      username: "Username",
      password: "Password",
      button: "Login",
      signup: "Sign up",
      toast: {
        text1: "Login error",
        text2: "Please check your credentials",
      },
      zod: {
        email: "Invalid email",
        password: "Password is required",
      },
    },
    signup: {
      screenTitle: "Register",
      title: "Start now",
      subTitle: "Register is easy and fast",
      documentLabel: "Document type",
      documentPlaceholder: "Select document type",
      documentTypes: {
        CC: "Citizen Card",
        NIT: "NIT",
      },
      idNumberPlaceholder: "ID number",
      namePlaceholder: "Name",
      lastNamePlaceholder: "Last name",
      phonePlaceholder: "Phone",
      addressPlaceholder: "Address",
      loginDataTitle: "Login data",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Password",
      termsAndConditions:
        "I accept the terms and conditions and the privacy policy",
      allowContact:
        "I allow CCP to send me information through WhatsApp, email, and SMS",
      button: "Sign up",
      toast: {
        success: {
          text1: "Registration successful",
          text2: "You can now log in",
        },
        error: {
          register: {
            text1: "Registration error",
            text2: "Please check your data",
          },
          storage: {
            text1: "Storage error",
            text2: "Could not save user data",
          },
        },
      },
      zod: {
        documentType: "Document type is required",
        idNumber: "ID number is required",
        name: "Name is required",
        lastName: "Last name is required",
        phone: "Phone is required",
        address: "Address is required",
        email: "Email is required",
        password: "Password is required",
        acceptTerms:
          "You must accept the terms and conditions and the privacy policy",
      },
    },
  },
  menu: {
    createTitle: "Create",
    consultTitle: "Consult",
    createButton: "Create order",
    getDeliveriesButton: "Deliveries",
    getOrdersButton: "Orders",
  },
  createOrder: {
    screenTitle: "Create order",
    subTitle: "Select the products you want to order",
    noProducts: "No products available",
    totalLabel: "Total",
    button: "Create order",
    toast: {
      success: {
        text1: "Order created successfully",
        text2: "You can now view your orders",
      },
      error: {
        text1: "Error creating order",
        text2: "Please check your data",
      },
    },
  },
  deliveries: {
    screenTitle: "Deliveries",
    subTitle: "This is the status of your delivery",
    noDeliveries: "No deliveries available",
    orderNumber: "Order number",
    deliveryDetails: "Details",
    deliveryDate: "Date",
    deliveryCity: "City",
  },
  orders: {
    screenTitle: "My orders",
    subTitle: "This is the status of your orders",
    noOrders: "No hay pedidos disponibles",
    customer: "Customer",
    address: "Address",
    deliveryDate: "Delivery date",
    products: "Products",
    quantity: "Quantity",
    unitPrice: "Unit price",
    status: {
      delivered: "Delivered",
      inProcess: "In process",
      pending: "Pending",
      confirmed: "Confirmed",
      cancelled: "Cancelled",
    },
  },
};
